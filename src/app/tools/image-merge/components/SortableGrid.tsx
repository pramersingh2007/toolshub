import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { X } from 'lucide-react';
import { ImageItem } from '../types';

interface SortableGridProps {
  images: ImageItem[];
  setImages: (images: ImageItem[]) => void;
  onRemove: (id: string) => void;
}

export const SortableGrid: React.FC<SortableGridProps> = ({ images, setImages, onRemove }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Reorder Images (Drag & Drop)</h3>
      <ReactSortable
        list={images}
        setList={setImages}
        animation={200}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
        ghostClass="opacity-50"
      >
        {images.map((item) => (
          <div key={item.id} className="relative group cursor-grab active:cursor-grabbing aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.previewUrl}
              alt="preview"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              className="absolute top-1 right-1 p-1.5 bg-white/90 text-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:scale-105 shadow-sm"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 truncate text-center">
              {item.width} x {item.height}
            </div>
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};