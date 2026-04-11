import React, { useEffect, useRef, useState } from 'react';

interface PreviewPanelProps {
  fileUrl: string | null;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ fileUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number>(0);
  const [pdfRef, setPdfRef] = useState<any>(null);

  useEffect(() => {
    if (!fileUrl) return;

    let active = true;
    const loadPdf = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        
        if (!active) return;
        
        setPdfRef(pdf);
        setPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();

    return () => {
      active = false;
    };
  }, [fileUrl]);

  if (!fileUrl) return null;

  return (
    <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 shadow-inner flex flex-col items-center flex-1 h-[600px]">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 w-full text-center">
        All Pages Preview ({pages})
      </h3>
      <div ref={containerRef} className="w-full flex-1 overflow-y-auto overflow-x-hidden space-y-6 pb-4 custom-scrollbar">
        {Array.from({ length: pages }).map((_, i) => (
          <PdfPage key={i} pageNumber={i + 1} pdf={pdfRef} />
        ))}
      </div>
    </div>
  );
};

const PdfPage = ({ pageNumber, pdf }: { pageNumber: number, pdf: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    
    let active = true;
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (!active) return;

        const viewport = page.getViewport({ scale: 1.0 }); // Slightly smaller scale for list view
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error(`Error rendering page ${pageNumber}`, err);
      }
    };

    renderPage();

    return () => {
      active = false;
    }
  }, [pdf, pageNumber]);

  return (
    <div className="bg-white p-2 rounded-lg border shadow-md w-full max-w-[280px] mx-auto relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="max-w-full h-auto object-contain" />
      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
        Page {pageNumber}
      </div>
    </div>
  );
}