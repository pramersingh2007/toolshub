import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { PdfPage } from '../hooks/usePdfMerger';
import { PageThumbnail } from './PageThumbnail';

interface PageGridProps {
  pages: PdfPage[];
  setPages: (pages: PdfPage[]) => void;
  onRemove: (id: string) => void;
  onRotate: (id: string, direction: 'cw' | 'ccw') => void;
  onPreview: (page: PdfPage) => void;
}

export function PageGrid({ pages, setPages, onRemove, onRotate, onPreview }: PageGridProps) {
  if (pages.length === 0) return null;

  return (
    <ReactSortable
      list={pages as any[]}
      setList={setPages as any}
      animation={200}
      handle=".sortable-handle"
      ghostClass="opacity-30"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6"
    >
      {pages.map((page) => (
        <div key={page.id}>
          <PageThumbnail
            page={page}
            onRemove={onRemove}
            onRotate={onRotate}
            onPreview={onPreview}
          />
        </div>
      ))}
    </ReactSortable>
  );
}
