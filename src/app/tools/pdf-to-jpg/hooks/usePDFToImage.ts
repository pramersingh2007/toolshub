import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdf.js to run client-side without locking the main thread
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface ConversionSettings {
  dpiScale: number;
  jpegQuality: number;
  pageRange: string;
}

export interface ConvertedImage {
  pageNum: number;
  dataUrl: string;
}

export function usePDFToImage() {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentConvertingPage, setCurrentConvertingPage] = useState(0);
  const [totalConvertingPages, setTotalConvertingPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const parsePageRange = (rangeStr: string, totalPages: number): number[] => {
    if (!rangeStr || rangeStr.trim().toLowerCase() === 'all') {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages = new Set<number>();
    const parts = rangeStr.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= totalPages) pages.add(i);
          }
        }
      } else {
        const page = parseInt(trimmed, 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
          pages.add(page);
        }
      }
    }
    
    const result = Array.from(pages).sort((a, b) => a - b);
    if (result.length === 0) throw new Error("Invalid page range. Please check your input.");
    return result;
  };

  const convertPDF = useCallback(async (file: File, settings: ConversionSettings): Promise<ConvertedImage[]> => {
    setIsConverting(true);
    setError(null);
    setProgress(0);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const totalPages = pdf.numPages;
      const pagesToConvert = parsePageRange(settings.pageRange, totalPages);
      
      setTotalConvertingPages(pagesToConvert.length);
      const convertedImages: ConvertedImage[] = [];

      for (let i = 0; i < pagesToConvert.length; i++) {
        const pageNum = pagesToConvert[i];
        setCurrentConvertingPage(pageNum);
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: settings.dpiScale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error("Could not create canvas context");
        
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        
        const renderContext = {
          canvasContext: context,
          canvas: canvas,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        
        const dataUrl = canvas.toDataURL('image/jpeg', settings.jpegQuality);
        convertedImages.push({ pageNum, dataUrl });
        
        setProgress(Math.round(((i + 1) / pagesToConvert.length) * 100));
        
        // Free memory for performance optimization
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }
      
      return convertedImages;
    } catch (err: any) {
      setError(err.message || "An error occurred during conversion.");
      throw err;
    } finally {
      setIsConverting(false);
      setProgress(0);
      setCurrentConvertingPage(0);
      setTotalConvertingPages(0);
    }
  }, []);

  return { convertPDF, isConverting, progress, currentConvertingPage, totalConvertingPages, error };
}
