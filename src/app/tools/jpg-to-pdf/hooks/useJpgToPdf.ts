import { useState, useCallback, useEffect } from 'react';
import jsPDF from 'jspdf';

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  name: string;
  size: number;
}

export type PageSize = 'A4' | 'Letter' | 'Fit' | 'Custom';
export type Orientation = 'Portrait' | 'Landscape' | 'Auto';
export type FitMode = 'Contain' | 'Cover' | 'Original';
export type LayoutMode = 'Single' | 'Grid';
export type ExportPreset = 'High' | 'Medium' | 'Low' | 'Custom';

export interface PageSettings {
  pageSize: PageSize;
  orientation: Orientation;
  fitMode: FitMode;
  margin: number;
  customWidth: number; // in mm
  customHeight: number; // in mm
  layout: LayoutMode;
  gridRows: number;
  gridCols: number;
  gridSpacing: number; // in mm
  watermarkText: string;
  watermarkOpacity: number; // 0 to 1
  pageNumbers: boolean;
}

export function useJpgToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<PageSettings>({
    pageSize: 'A4',
    orientation: 'Auto',
    fitMode: 'Contain',
    margin: 10,
    customWidth: 210,
    customHeight: 297,
    layout: 'Single',
    gridRows: 2,
    gridCols: 2,
    gridSpacing: 5,
    watermarkText: '',
    watermarkOpacity: 0.2,
    pageNumbers: false,
  });
  
  const [preset, setPreset] = useState<ExportPreset>('Medium');
  const [quality, setQuality] = useState(0.75); // tied to preset initially
  const [filename, setFilename] = useState('converted.pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync preset with quality
  useEffect(() => {
    if (preset === 'High') setQuality(0.95);
    else if (preset === 'Medium') setQuality(0.75);
    else if (preset === 'Low') setQuality(0.5);
  }, [preset]);

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    setPreset('Custom');
  };

  const addImages = useCallback(async (files: File[]) => {
    const newImages: ImageFile[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      
      const previewUrl = URL.createObjectURL(file);
      const dimensions = await new Promise<{width: number, height: number}>((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.src = previewUrl;
      });

      newImages.push({
        id: crypto.randomUUID(),
        file,
        previewUrl,
        width: dimensions.width,
        height: dimensions.height,
        name: file.name,
        size: file.size,
      });
    }

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const idx = prev.findIndex(img => img.id === id);
      if (idx !== -1) URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  }, [images]);

  const reorderImages = useCallback((newImages: ImageFile[]) => {
    setImages(newImages);
  }, []);

  const drawImageToPdf = async (pdf: jsPDF, img: ImageFile, x: number, y: number, cellW: number, cellH: number) => {
    const imgElement = document.createElement('img');
    imgElement.src = img.previewUrl;
    await new Promise((resolve) => { imgElement.onload = resolve; });

    let finalW = cellW;
    let finalH = cellH;
    let finalX = x;
    let finalY = y;

    const imgRatio = img.width / img.height;
    const cellRatio = cellW / cellH;

    if (settings.fitMode === 'Original') {
      finalW = img.width * 25.4 / 72;
      finalH = img.height * 25.4 / 72;
      finalX = x + (cellW - finalW) / 2;
      finalY = y + (cellH - finalH) / 2;
    } else if (settings.fitMode === 'Contain') {
      if (imgRatio > cellRatio) {
        finalW = cellW;
        finalH = finalW / imgRatio;
      } else {
        finalH = cellH;
        finalW = finalH * imgRatio;
      }
      finalX = x + (cellW - finalW) / 2;
      finalY = y + (cellH - finalH) / 2;
    }

    // Determine max resolution based on preset
    const maxDim = preset === 'High' ? 2500 : (preset === 'Medium' ? 1500 : (preset === 'Low' ? 800 : 2000));
    let scale = 1;
    if (img.width > maxDim || img.height > maxDim) {
      scale = Math.min(maxDim / img.width, maxDim / img.height);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    if (settings.fitMode === 'Cover') {
      // For cover, we crop exactly to the cell ratio to prevent overflowing
      const sourceRatio = img.width / img.height;
      let sWidth = img.width;
      let sHeight = img.height;
      let sx = 0;
      let sy = 0;
      
      if (sourceRatio > cellRatio) {
        sWidth = img.height * cellRatio;
        sx = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / cellRatio;
        sy = (img.height - sHeight) / 2;
      }
      
      canvas.width = sWidth * scale;
      canvas.height = sHeight * scale;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgElement, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      
      // Override finals to fill cell exactly
      finalW = cellW;
      finalH = cellH;
      finalX = x;
      finalY = y;
    } else {
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    }

    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    pdf.addImage(compressedDataUrl, 'JPEG', finalX, finalY, finalW, finalH, undefined, 'FAST');
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setProgress(0);

    try {
      let pdf: jsPDF | null = null;
      const imagesPerPage = settings.layout === 'Grid' ? settings.gridRows * settings.gridCols : 1;
      const totalPages = Math.ceil(images.length / imagesPerPage);
      
      let imageIndex = 0;

      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        const firstImgOfPage = images[imageIndex];
        
        let pw = settings.pageSize === 'Custom' ? settings.customWidth : (settings.pageSize === 'Letter' ? 215.9 : 210);
        let ph = settings.pageSize === 'Custom' ? settings.customHeight : (settings.pageSize === 'Letter' ? 279.4 : 297);

        if (settings.pageSize === 'Fit') {
          if (settings.layout === 'Grid') {
            pw = 210; ph = 297; // fallback for grid
          } else {
            pw = firstImgOfPage.width * 25.4 / 72;
            ph = firstImgOfPage.height * 25.4 / 72;
          }
        }

        let orientation = settings.orientation === 'Landscape' ? 'l' : 'p';
        if (settings.orientation === 'Auto') {
          if (settings.layout === 'Grid') {
            orientation = 'p'; // default to portrait for grid auto
          } else {
            orientation = firstImgOfPage.width > firstImgOfPage.height ? 'l' : 'p';
          }
        }

        if (orientation === 'l' && settings.pageSize !== 'Fit') {
          const temp = pw;
          pw = ph;
          ph = temp;
        }

        if (pageNum === 0) {
          pdf = new jsPDF({
            unit: 'mm',
            format: [pw, ph],
            orientation: orientation as 'p' | 'l'
          });
        } else {
          pdf!.addPage([pw, ph], orientation as 'p' | 'l');
        }

        const margin = settings.margin;
        const availableW = pw - margin * 2;
        const availableH = ph - margin * 2;

        if (settings.layout === 'Single') {
          // Draw single image
          const img = images[imageIndex];
          await drawImageToPdf(pdf!, img, margin, margin, availableW, availableH);
          imageIndex++;
          setProgress((imageIndex / images.length) * 100);
        } else {
          // Grid layout
          const cols = settings.gridCols;
          const rows = settings.gridRows;
          const spacing = settings.gridSpacing;
          
          const cellW = (availableW - spacing * (cols - 1)) / cols;
          const cellH = (availableH - spacing * (rows - 1)) / rows;
          
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (imageIndex >= images.length) break;
              
              const x = margin + c * (cellW + spacing);
              const y = margin + r * (cellH + spacing);
              
              const img = images[imageIndex];
              await drawImageToPdf(pdf!, img, x, y, cellW, cellH);
              imageIndex++;
              setProgress((imageIndex / images.length) * 100);
            }
          }
        }

        // Draw Watermark
        if (settings.watermarkText) {
          pdf!.setTextColor(180, 180, 180);
          pdf!.setFontSize(40);
          
          // Typescript workaround for GState
          const gState = new (pdf as any).GState({ opacity: settings.watermarkOpacity });
          (pdf as any).setGState(gState);
          
          const textOptions: any = { align: 'center', angle: 45 };
          pdf!.text(settings.watermarkText, pw / 2, ph / 2, textOptions);
          
          const gStateReset = new (pdf as any).GState({ opacity: 1.0 });
          (pdf as any).setGState(gStateReset);
        }

        // Draw Page Numbers
        if (settings.pageNumbers) {
          pdf!.setFontSize(10);
          pdf!.setTextColor(120, 120, 120);
          pdf!.text(`Page ${pageNum + 1} of ${totalPages}`, pw / 2, ph - Math.max(margin / 2, 5), { align: 'center' });
        }
      }

      pdf!.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return {
    images,
    addImages,
    removeImage,
    clearAll,
    reorderImages,
    settings,
    setSettings,
    preset,
    setPreset,
    quality,
    setQuality: handleQualityChange,
    filename,
    setFilename,
    isGenerating,
    progress,
    generatePdf
  };
}