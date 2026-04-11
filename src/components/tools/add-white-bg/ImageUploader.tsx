import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={`relative w-full h-64 border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 text-center ${
        isDragActive 
          ? 'border-primary bg-primary/5 shadow-inner' 
          : 'border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
      }`}
    >
      <input {...getInputProps()} />
      <div className={`p-5 rounded-full mb-4 transition-colors duration-300 ${
        isDragActive 
          ? 'bg-primary/20 text-primary' 
          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
      }`}>
        {isDragActive ? (
          <UploadCloud className="w-10 h-10 animate-bounce" />
        ) : (
          <ImageIcon className="w-10 h-10" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {isDragActive ? 'Drop images to process' : 'Drag & drop your images here'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        Supports PNG, JPG, and WEBP formats. You can upload multiple files at once for batch processing.
      </p>
    </Card>
  );
}
