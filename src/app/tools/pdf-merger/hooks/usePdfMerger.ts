import { useState, useCallback, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';

export interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  originalPagesCount: number;
}

export interface PdfPage {
  id: string;
  fileId: string;
  pageIndex: number; // 0-based index in the original file
  rotation: number; // 0, 90, 180, 270
  thumbnailUrl: string;
  originalWidth: number;
  originalHeight: number;
  fileName: string;
  pdfIndex: number; // File upload order index (A=0, B=1)
}

export type MergeMode = 'Sequential' | 'Interleaved';

const MAX_FREE_FILES = 10;
const MAX_FREE_SIZE_MB = 50;

export function usePdfMerger() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergeMode, setMergeMode] = useState<MergeMode>('Sequential');
  const [filename, setFilename] = useState('merged_document.pdf');
  const [previewPage, setPreviewPage] = useState<PdfPage | null>(null);

  // Store file buffers so we don't have to read them multiple times
  const fileBuffers = useRef<{ [fileId: string]: ArrayBuffer }>({});

  const addFiles = useCallback(async (newFiles: File[]) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const validFiles = newFiles.filter(f => f.type === 'application/pdf');
      
      // Limit check
      if (files.length + validFiles.length > MAX_FREE_FILES) {
        alert(`Free version limits up to ${MAX_FREE_FILES} files.`);
        validFiles.splice(MAX_FREE_FILES - files.length);
      }

      let totalSize = files.reduce((acc, f) => acc + f.size, 0) + validFiles.reduce((acc, f) => acc + f.size, 0);
      if (totalSize > MAX_FREE_SIZE_MB * 1024 * 1024) {
        alert(`Total size exceeds ${MAX_FREE_SIZE_MB}MB free limit. Extra files will be skipped.`);
        // simple drop logic, ideally would check per file size
        setIsProcessing(false);
        return;
      }

      const addedFiles: PdfFile[] = [];
      const addedPages: PdfPage[] = [];
      const currentFileCount = files.length;

      // Load pdf.js dynamically
      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined' && 'Worker' in window) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const fileId = crypto.randomUUID();
        const arrayBuffer = await file.arrayBuffer();
        fileBuffers.current[fileId] = arrayBuffer;

        // Render thumbnails using PDF.js
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        addedFiles.push({
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          originalPagesCount: numPages
        });

        const fileIndex = currentFileCount + i;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 0.5 }); // Low res for thumbnail
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({ canvasContext: context, viewport }).promise;
            
            addedPages.push({
              id: crypto.randomUUID(),
              fileId,
              pageIndex: pageNum - 1,
              rotation: 0,
              thumbnailUrl: canvas.toDataURL('image/jpeg', 0.6),
              originalWidth: viewport.width,
              originalHeight: viewport.height,
              fileName: file.name,
              pdfIndex: fileIndex
            });
          }
          
          setProgress(((i * numPages + pageNum) / (validFiles.length * numPages)) * 100);
        }
      }

      setFiles(prev => [...prev, ...addedFiles]);
      setPages(prev => [...prev, ...addedPages]);
    } catch (err) {
      console.error(err);
      alert("Failed to load some PDFs.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [files]);

  const clearAll = useCallback(() => {
    setFiles([]);
    setPages([]);
    fileBuffers.current = {};
    setPreviewPage(null);
  }, []);

  const removePage = useCallback((pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
  }, []);

  const rotatePage = useCallback((pageId: string, direction: 'cw' | 'ccw') => {
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        let newRot = p.rotation + (direction === 'cw' ? 90 : -90);
        if (newRot >= 360) newRot = 0;
        if (newRot < 0) newRot = 270;
        return { ...p, rotation: newRot };
      }
      return p;
    }));
  }, []);

  const reorderPages = useCallback((newPages: PdfPage[]) => {
    setPages(newPages);
  }, []);

  // Interleave A1, B1, A2, B2...
  const applyInterleave = useCallback(() => {
    const pagesByFile: { [fileId: string]: PdfPage[] } = {};
    files.forEach(f => {
      pagesByFile[f.id] = pages.filter(p => p.fileId === f.id).sort((a, b) => a.pageIndex - b.pageIndex);
    });

    const newOrder: PdfPage[] = [];
    let hasMore = true;
    let index = 0;
    
    while(hasMore) {
      hasMore = false;
      for (const f of files) {
        const filePages = pagesByFile[f.id];
        if (filePages && index < filePages.length) {
          newOrder.push(filePages[index]);
          hasMore = true;
        }
      }
      index++;
    }
    
    setPages(newOrder);
    setMergeMode('Interleaved');
  }, [files, pages]);

  const applySequential = useCallback(() => {
    const newOrder = [...pages].sort((a, b) => {
      if (a.pdfIndex !== b.pdfIndex) return a.pdfIndex - b.pdfIndex;
      return a.pageIndex - b.pageIndex;
    });
    setPages(newOrder);
    setMergeMode('Sequential');
  }, [pages]);

  const mergePdfs = async () => {
    if (pages.length === 0) return;
    setIsMerging(true);
    setProgress(0);

    try {
      const finalPdf = await PDFDocument.create();
      
      // Load all required PDF documents into memory (only once per file)
      const loadedPdfs: { [fileId: string]: PDFDocument } = {};
      
      // Sequential merging to prevent memory bloat for extreme sizes
      for (let i = 0; i < pages.length; i++) {
        const pageMeta = pages[i];
        
        if (!loadedPdfs[pageMeta.fileId]) {
          loadedPdfs[pageMeta.fileId] = await PDFDocument.load(fileBuffers.current[pageMeta.fileId]);
        }
        
        const srcPdf = loadedPdfs[pageMeta.fileId];
        
        // Copy the specific page
        const [copiedPage] = await finalPdf.copyPages(srcPdf, [pageMeta.pageIndex]);
        
        // Apply rotation if changed by user
        if (pageMeta.rotation !== 0) {
          // Add to existing rotation
          const currentRot = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees(currentRot + pageMeta.rotation));
        }
        
        finalPdf.addPage(copiedPage);
        setProgress(((i + 1) / pages.length) * 100);
      }

      const pdfBytes = await finalPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Error during merge", err);
      alert("Failed to merge PDFs.");
    } finally {
      setIsMerging(false);
      setProgress(0);
    }
  };

  return {
    files,
    pages,
    addFiles,
    removePage,
    clearAll,
    reorderPages,
    rotatePage,
    isProcessing,
    isMerging,
    progress,
    mergeMode,
    setMergeMode,
    applyInterleave,
    applySequential,
    filename,
    setFilename,
    mergePdfs,
    previewPage,
    setPreviewPage
  };
}