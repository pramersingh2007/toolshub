import { useState, useCallback, useEffect, useRef } from 'react';
import { PDFFile, CompressionStats, CompressionSettings } from '../types';
import { compressPDF } from '../engine/compressor';

export function usePDFCompressor() {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [settings, setSettings] = useState<CompressionSettings>({ compressionLevel: 50 });
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [stats, setStats] = useState<CompressionStats | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') return;
    
    const url = URL.createObjectURL(file);
    
    let pageCount = 0;
    try {
      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      pageCount = pdf.numPages;
    } catch (e) {
      console.error("Failed to parse PDF pages", e);
    }

    setPdfFile({
      file,
      name: file.name,
      size: file.size,
      pageCount,
      url,
    });
    
    setResultBlob(null);
    setStats(null);
    setProgress(0);
  };

  const clearFile = useCallback(() => {
    if (pdfFile?.url) {
      URL.revokeObjectURL(pdfFile.url);
    }
    setPdfFile(null);
    setResultBlob(null);
    setStats(null);
    setProgress(0);
    setIsCompressing(false);
  }, [pdfFile]);

  // Real-time automatic compression when slider moves
  useEffect(() => {
    if (!pdfFile) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Debounce compression by 600ms so it doesn't run excessively while dragging
    timeoutRef.current = setTimeout(async () => {
      setIsCompressing(true);
      setProgress(0);
      
      try {
        const blob = await compressPDF(pdfFile.url, settings.compressionLevel, setProgress);
        const compressedSize = blob.size;
        const originalSize = pdfFile.size;
        const reductionPercentage = Math.max(0, ((originalSize - compressedSize) / originalSize) * 100);

        setResultBlob(blob);
        setStats({
          originalSize,
          compressedSize,
          reductionPercentage,
        });
      } catch (error) {
        console.error('Compression failed', error);
      } finally {
        setIsCompressing(false);
      }
    }, 600);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pdfFile, settings.compressionLevel]);

  const download = () => {
    if (!resultBlob || !pdfFile) return;
    
    const url = URL.createObjectURL(resultBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed-${pdfFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    pdfFile,
    settings,
    setSettings,
    isCompressing,
    progress,
    resultBlob,
    stats,
    handleUpload,
    clearFile,
    download,
  };
}
