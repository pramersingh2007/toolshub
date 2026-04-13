import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressStatusProps {
  isConverting: boolean;
  progress: number;
  currentPage: number;
  totalPages: number;
}

export const ProgressStatus: React.FC<ProgressStatusProps> = ({ 
  isConverting, progress, currentPage, totalPages 
}) => {
  if (!isConverting) return null;

  return (
    <div className="bg-card p-6 rounded-3xl shadow-sm border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="font-bold text-foreground">Converting PDF...</span>
        </div>
        <span className="text-sm font-black text-primary">{progress}%</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center font-medium">
        Processing page {currentPage} of {totalPages}
      </p>
    </div>
  );
};
