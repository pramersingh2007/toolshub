import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { ImageItem } from '../types';

interface ImageUploaderProps {
  onAddImages: (images: ImageItem[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAddImages }) => {
  const handleFiles = async (files: FileList | File[]) => {
    const newImages: ImageItem[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        
        // Load image to get dimensions
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = previewUrl;
        });

        newImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl,
          width: img.width,
          height: img.height,
        });
      }
    }
    onAddImages(newImages);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById('image-upload')?.click()}
    >
      <input
        type="file"
        id="image-upload"
        className="hidden"
        multiple
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = ''; // Reset
        }}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-700">Click or drag images to upload</p>
          <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG, WebP (Multiple allowed)</p>
        </div>
      </div>
    </div>
  );
};