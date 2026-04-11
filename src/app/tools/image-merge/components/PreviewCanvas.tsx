import React, { useEffect, useRef, useState } from 'react';
import { ImageItem, MergeOptions } from '../types';
import { renderMergedImage } from '../engine';

interface PreviewCanvasProps {
  images: ImageItem[];
  options: MergeOptions;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ images, options }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [fileSize, setFileSize] = useState<number>(0);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    let active = true;
    const render = async () => {
      if (images.length === 0 || !canvasRef.current) return;
      setIsRendering(true);
      
      try {
        await renderMergedImage(canvasRef.current, images, { ...options, scale: 1 }); // Preview at 1x
        
        // Calculate estimated file size of the canvas to reflect real-time compression
        if (active) {
          const calculatedQuality = Math.max(0.01, (100 - options.quality) / 100);
          const dataUrl = canvasRef.current.toDataURL(options.format, calculatedQuality);
          // length of base64 string * 3/4 gives approximate size in bytes
          const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
          setFileSize(sizeInBytes);
        }

      } catch (err) {
        console.error('Render error', err);
      } finally {
        if (active) setIsRendering(false);
      }
    };
    
    // Simple debounce for smoother preview changes
    const timeout = setTimeout(render, 150);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [images, options]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[400px] bg-slate-50 text-slate-400 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-sm font-medium">Add images to see preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* File Size Indicator */}
      <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-4">
        <div>
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Estimated Output Size</p>
          <p className="text-2xl font-black text-indigo-700">{formatSize(fileSize * options.scale * options.scale)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Format</p>
          <p className="text-sm font-bold text-indigo-700 uppercase">{options.format.split('/')[1]}</p>
        </div>
      </div>

      <div 
        className="relative w-full h-[500px] overflow-auto border border-slate-200 rounded-xl shadow-inner"
        style={{ 
          backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)', 
          backgroundSize: '20px 20px', 
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          backgroundColor: '#f9fafb'
        }}
      >
        {isRendering && (
          <div className="sticky top-4 left-1/2 -translate-x-1/2 w-max bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg z-10 flex items-center space-x-2 animate-pulse">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Rendering Preview...
          </div>
        )}
        <div className="p-8 w-max min-w-full min-h-full flex items-center justify-center">
          <canvas ref={canvasRef} className="shadow-2xl max-w-full h-auto rounded ring-1 ring-slate-900/5 transition-opacity duration-300" style={{ opacity: isRendering ? 0.7 : 1 }} />
        </div>
      </div>
    </div>
  );
};