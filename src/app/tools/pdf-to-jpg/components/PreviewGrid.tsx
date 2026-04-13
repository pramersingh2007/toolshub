import React from 'react';
import { Download } from 'lucide-react';
import { ConvertedImage } from '../hooks/usePDFToImage';

interface PreviewGridProps {
  images: ConvertedImage[];
}

export const PreviewGrid: React.FC<PreviewGridProps> = ({ images }) => {
  if (images.length === 0) return null;

  const downloadImage = (img: ConvertedImage) => {
    const a = document.createElement('a');
    a.href = img.dataUrl;
    a.download = `page-${img.pageNum}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((img) => (
        <div key={img.pageNum} className="group relative bg-muted/30 rounded-2xl overflow-hidden border border-border">
          <div className="aspect-[3/4] relative flex items-center justify-center p-2">
            <img 
              src={img.dataUrl} 
              alt={`Page ${img.pageNum}`} 
              className="max-w-full max-h-full object-contain shadow-sm"
              loading="lazy"
            />
          </div>
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
            <button
              onClick={() => downloadImage(img)}
              className="bg-background text-foreground p-3 rounded-full hover:scale-105 transition-all shadow-xl flex items-center space-x-2"
              title="Download Image"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
            Page {img.pageNum}
          </div>
        </div>
      ))}
    </div>
  );
};
