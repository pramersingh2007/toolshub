import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  className?: string;
}

export function ImageUploader({ onUpload, className }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer text-center",
        isDragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <UploadCloud className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? "Drop the images here" : "Drag & drop images here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to select files
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground pt-4">
          <div className="flex items-center">
            <ImageIcon className="w-4 h-4 mr-1" />
            JPG, JPEG, PNG
          </div>
        </div>
      </div>
    </div>
  );
}
