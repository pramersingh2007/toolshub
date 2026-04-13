import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { ImageFile } from '../hooks/useJpgToPdf';

interface ThumbnailGridProps {
  image: ImageFile;
  index: number;
  onRemove: (id: string) => void;
}

export function ThumbnailGrid({ image, index, onRemove }: ThumbnailGridProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative group bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-2 left-2 z-10 p-1 bg-black/50 text-white rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity sortable-handle">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <button
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 z-10 p-1 bg-destructive/80 text-destructive-foreground hover:bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Remove"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-white z-10 pointer-events-none">
        <div className="flex justify-between items-end">
          <div className="truncate pr-2">
            <p className="text-sm font-medium truncate" title={image.name}>
              {index + 1}. {image.name}
            </p>
            <p className="text-xs text-white/70">
              {formatSize(image.size)} • {image.width}x{image.height}
            </p>
          </div>
        </div>
      </div>

      <div className="aspect-[4/3] w-full overflow-hidden bg-muted flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.previewUrl}
          alt={image.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
      </div>
    </div>
  );
}
