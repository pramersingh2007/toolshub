import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PdfUploaderProps {
  onUpload: (files: File[]) => void;
  className?: string;
}

export function PdfUploader({ onUpload, className }: PdfUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
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
            {isDragActive ? "Drop the PDFs here" : "Drag & drop PDFs here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to select files
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground pt-4">
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            Supports multiple PDF files
          </div>
        </div>
      </div>
    </div>
  );
}
