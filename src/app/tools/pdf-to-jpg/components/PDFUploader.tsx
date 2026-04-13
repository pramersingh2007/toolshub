import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileIcon, X } from 'lucide-react';

interface PDFUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  totalPages: number | null;
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileSelect, selectedFile, totalPages }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50 bg-background'
          }`}
        >
          <input {...getInputProps()} />
          <div className={`p-4 rounded-full mb-4 ${isDragActive ? 'bg-primary/10' : 'bg-muted'}`}>
            <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <p className="text-lg font-bold text-foreground">
            {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF here"}
          </p>
          <p className="text-sm text-muted-foreground mt-2 font-medium">or click to browse from your computer</p>
        </div>
      ) : (
        <div className="border border-border rounded-3xl p-4 bg-card flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
            <FileIcon className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">
              {selectedFile.name}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 font-medium">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              {totalPages !== null && ` • ${totalPages} pages`}
            </p>
          </div>
          <button 
            onClick={() => onFileSelect(null)}
            className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
