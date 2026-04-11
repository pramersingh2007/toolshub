import { PDFDocument } from 'pdf-lib';

export const compressPDF = async (
  fileUrl: string,
  compressionLevel: number,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  if (onProgress) onProgress(5);
  
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  const loadingTask = pdfjsLib.getDocument(fileUrl);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const newPdf = await PDFDocument.create();

  // Map 1-100 compression level to actual canvas scale and JPEG quality
  // 1 = Best quality (low compression), 100 = Lowest quality (high compression)
  const quality = Math.max(0.1, 1.0 - (compressionLevel / 100) * 0.9); // Range: 1.0 -> 0.1
  const scaleFactor = Math.max(0.8, 2.0 - (compressionLevel / 100) * 1.2); // Range: 2.0 -> 0.8

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: scaleFactor });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx!, viewport, canvas }).promise;

    const imgData = canvas.toDataURL('image/jpeg', quality);
    const image = await newPdf.embedJpg(imgData);
    
    const originalViewport = page.getViewport({ scale: 1.0 });
    const pdfPage = newPdf.addPage([originalViewport.width, originalViewport.height]);
    
    pdfPage.drawImage(image, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });

    if (onProgress) onProgress(Math.round((i / numPages) * 90));
    
    // Yield to event loop to keep UI responsive
    await new Promise(r => setTimeout(r, 10));
  }

  const pdfBytes = await newPdf.save({ useObjectStreams: true });
  if (onProgress) onProgress(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
};
