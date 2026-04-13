import React from 'react';
import { X, RotateCw, GripVertical, ZoomIn } from 'lucide-react';
import { PdfPage } from '../hooks/usePdfMerger';
import { cn } from '@/lib/utils';

interface PageThumbnailProps {
  page: PdfPage;
  onRemove: (id: string) => void;
  onRotate: (id: string, direction: 'cw' | 'ccw') => void;
  onPreview: (page: PdfPage) => void;
}

export function PageThumbnail({ page, onRemove, onRotate, onPreview }: PageThumbnailProps) {
  // Give different colors to different PDFs to visually distinguish them when interleaved
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 
    'bg-pink-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'
  ];
  const colorClass = colors[page.pdfIndex % colors.length];

  return (
    <div className="relative group bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Drag handle */}
      <div className="absolute top-2 left-2 z-10 p-1.5 bg-black/40 backdrop-blur-sm text-white rounded-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity sortable-handle">
        <GripVertical className="w-4 h-4" />
      </div>
      
      {/* Top right actions */}
      <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onPreview(page)}
          className="p-1.5 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 rounded-lg transition-colors"
          title="Preview Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(page.id)}
          className="p-1.5 bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-600 rounded-lg transition-colors"
          title="Remove Page"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Center Rotate action */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <button
          onClick={() => onRotate(page.id, 'cw')}
          className="p-3 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full pointer-events-auto hover:scale-110 transition-transform shadow-lg"
          title="Rotate 90°"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 text-white z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full shrink-0 shadow-sm", colorClass)} title={`File ${page.pdfIndex + 1}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate opacity-90" title={page.fileName}>
              {page.fileName}
            </p>
            <p className="text-[10px] font-bold tracking-wider text-white/70 uppercase">
              Pg {page.pageIndex + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail Image */}
      <div className="aspect-[1/1.414] w-full overflow-hidden bg-slate-100 flex items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.thumbnailUrl}
          alt={`Page ${page.pageIndex + 1}`}
          className="max-w-full max-h-full object-contain shadow-sm bg-white transition-transform duration-300"
          style={{ transform: `rotate(${page.rotation}deg)` }}
        />
      </div>
    </div>
  );
}
