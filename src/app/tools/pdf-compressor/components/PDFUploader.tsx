import React, { useCallback, useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { PDFFile } from '../types';

interface PDFUploaderProps {
  pdfFile: PDFFile | null;
  onUpload: (file: File) => void;
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({ pdfFile, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onUpload(files[0]);
    }
  }, [onUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (pdfFile) {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-center justify-between animate-in fade-in zoom-in-95">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">{pdfFile.name}</h3>
            <p className="text-sm text-slate-500 font-medium">
              {formatSize(pdfFile.size)} • {pdfFile.pageCount ? `${pdfFile.pageCount} Pages` : 'Calculating...'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm"
        >
          Change File
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleChange} 
          accept="application/pdf" 
          className="hidden" 
        />
      </div>
    );
  }

  return (
    <div
      className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group shadow-sm bg-white"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept="application/pdf" 
        className="hidden" 
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <UploadCloud className="w-10 h-10" />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-800">Select PDF File</p>
          <p className="text-sm text-slate-500 mt-2 font-medium">or drag and drop your file here</p>
        </div>
      </div>
    </div>
  );
};