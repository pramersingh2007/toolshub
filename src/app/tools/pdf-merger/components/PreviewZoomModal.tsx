import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PdfPage } from '../hooks/usePdfMerger';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewZoomModalProps {
  page: PdfPage | null;
  onClose: () => void;
}

export function PreviewZoomModal({ page, onClose }: PreviewZoomModalProps) {
  if (!page) return null;

  return (
    <Dialog open={!!page} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full h-[90vh] bg-slate-900 border-slate-800 p-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 z-10 text-white">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">{page.fileName}</h2>
            <p className="text-sm text-slate-400">Page {page.pageIndex + 1}</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-slate-950 p-8 flex flex-col items-center">
          <div className="relative shadow-2xl bg-white transition-transform duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={page.thumbnailUrl} 
              alt="Zoom Preview" 
              className="max-w-full max-h-[80vh] object-contain transition-transform duration-300"
              style={{ transform: `rotate(${page.rotation}deg)` }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
