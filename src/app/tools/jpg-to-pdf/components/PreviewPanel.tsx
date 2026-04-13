import React, { useRef, useEffect } from 'react';
import { PageSettings, ImageFile } from '../hooks/useJpgToPdf';

interface PreviewPanelProps {
  settings: PageSettings;
  firstImage?: ImageFile;
}

export function PreviewPanel({ settings, firstImage }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!firstImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate physical page size (in mm)
    let pw = settings.pageSize === 'Custom' ? settings.customWidth : (settings.pageSize === 'Letter' ? 215.9 : 210);
    let ph = settings.pageSize === 'Custom' ? settings.customHeight : (settings.pageSize === 'Letter' ? 279.4 : 297);

    if (settings.pageSize === 'Fit') {
      if (settings.layout === 'Grid') {
        pw = 210; ph = 297; // fallback for grid
      } else {
        pw = firstImage.width * 25.4 / 72;
        ph = firstImage.height * 25.4 / 72;
      }
    }

    let orientation = settings.orientation === 'Landscape' ? 'l' : 'p';
    if (settings.orientation === 'Auto') {
      if (settings.layout === 'Grid') {
        orientation = 'p'; 
      } else {
        orientation = firstImage.width > firstImage.height ? 'l' : 'p';
      }
    }

    if (orientation === 'l' && settings.pageSize !== 'Fit') {
      const temp = pw;
      pw = ph;
      ph = temp;
    }

    // Set canvas resolution strictly proportional to mm
    const pixelsPerMm = 4; // 1mm = 4px for preview clarity
    canvas.width = pw * pixelsPerMm;
    canvas.height = ph * pixelsPerMm;
    
    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const marginPx = settings.margin * pixelsPerMm;
    const availableW = canvas.width - marginPx * 2;
    const availableH = canvas.height - marginPx * 2;

    // Draw Margin dashed lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; // primary color faded
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(marginPx, marginPx, availableW, availableH);
    ctx.setLineDash([]); // reset

    const drawPreviewImage = (imgElem: HTMLImageElement, x: number, y: number, cellW: number, cellH: number) => {
      let finalW = cellW;
      let finalH = cellH;
      let finalX = x;
      let finalY = y;

      const imgRatio = firstImage.width / firstImage.height;
      const cellRatio = cellW / cellH;

      if (settings.fitMode === 'Original') {
        // Convert img px to mm to canvas px
        finalW = (firstImage.width * 25.4 / 72) * pixelsPerMm;
        finalH = (firstImage.height * 25.4 / 72) * pixelsPerMm;
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

      if (settings.fitMode === 'Cover') {
        let sWidth = firstImage.width;
        let sHeight = firstImage.height;
        let sx = 0;
        let sy = 0;
        
        if (imgRatio > cellRatio) {
          sWidth = firstImage.height * cellRatio;
          sx = (firstImage.width - sWidth) / 2;
        } else {
          sHeight = firstImage.width / cellRatio;
          sy = (firstImage.height - sHeight) / 2;
        }
        
        ctx.drawImage(imgElem, sx, sy, sWidth, sHeight, x, y, cellW, cellH);
      } else {
        ctx.drawImage(imgElem, 0, 0, firstImage.width, firstImage.height, finalX, finalY, finalW, finalH);
      }
    };

    const img = new Image();
    img.onload = () => {
      if (settings.layout === 'Single') {
        drawPreviewImage(img, marginPx, marginPx, availableW, availableH);
      } else {
        // Grid Preview (Show first image repeated faintly to indicate grid)
        const cols = settings.gridCols;
        const rows = settings.gridRows;
        const spacingPx = settings.gridSpacing * pixelsPerMm;
        
        const cellW = (availableW - spacingPx * (cols - 1)) / cols;
        const cellH = (availableH - spacingPx * (rows - 1)) / rows;
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = marginPx + c * (cellW + spacingPx);
            const y = marginPx + r * (cellH + spacingPx);
            
            // Draw placeholder cell border
            ctx.strokeStyle = '#e5e7eb';
            ctx.strokeRect(x, y, cellW, cellH);
            
            // Draw image in first cell, faded in others
            ctx.globalAlpha = (r === 0 && c === 0) ? 1.0 : 0.3;
            drawPreviewImage(img, x, y, cellW, cellH);
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // Draw Watermark on Canvas Preview
      if (settings.watermarkText) {
        ctx.fillStyle = `rgba(180, 180, 180, ${settings.watermarkOpacity})`;
        ctx.font = `bold ${Math.min(canvas.width, canvas.height) / 8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 4); // -45 degrees
        ctx.fillText(settings.watermarkText, 0, 0);
        ctx.restore();
      }

      // Draw Page Numbers on Canvas Preview
      if (settings.pageNumbers) {
        ctx.fillStyle = '#787878';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Page 1 of 1', canvas.width / 2, canvas.height - Math.max(marginPx / 2, 20));
      }
    };
    img.src = firstImage.previewUrl;

  }, [firstImage, settings]);

  if (!firstImage) return null;

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Live Canvas Preview</h3>
      
      <div 
        className="relative w-full h-[400px] overflow-auto border border-slate-200 rounded-xl shadow-inner"
        style={{ 
          backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)', 
          backgroundSize: '20px 20px', 
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          backgroundColor: '#f9fafb'
        }}
      >
        <div className="p-8 w-max min-w-full min-h-full flex items-center justify-center">
          <canvas 
            ref={canvasRef}
            className="shadow-2xl max-w-full h-auto rounded ring-1 ring-slate-900/5 transition-opacity duration-300"
            style={{
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Generated via HTML5 Canvas
      </p>
    </div>
  );
}