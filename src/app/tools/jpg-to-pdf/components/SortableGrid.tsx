import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { ImageFile } from '../hooks/useJpgToPdf';
import { ThumbnailGrid } from './ThumbnailGrid';

interface SortableGridProps {
  images: ImageFile[];
  setImages: (images: ImageFile[]) => void;
  onRemove: (id: string) => void;
}

export function SortableGrid({ images, setImages, onRemove }: SortableGridProps) {
  if (images.length === 0) return null;

  return (
    <ReactSortable
      list={images as any[]}
      setList={setImages as any}
      animation={200}
      handle=".sortable-handle"
      ghostClass="opacity-50"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6"
    >
      {images.map((image, index) => (
        <div key={image.id}>
          <ThumbnailGrid
            image={image}
            index={index}
            onRemove={onRemove}
          />
        </div>
      ))}
    </ReactSortable>
  );
}
