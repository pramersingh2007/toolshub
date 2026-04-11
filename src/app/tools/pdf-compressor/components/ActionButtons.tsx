import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

interface ActionButtonsProps {
  hasFile: boolean;
  hasResult: boolean;
  isCompressing: boolean;
  progress: number;
  onDownload: () => void;
  onClear: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasFile,
  hasResult,
  isCompressing,
  progress,
  onDownload,
  onClear,
}) => {
  if (!hasFile) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
      <button
        onClick={onDownload}
        disabled={isCompressing || !hasResult}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:pointer-events-none relative overflow-hidden"
      >
        {isCompressing ? (
          <>
            {/* Progress Bar Background */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-indigo-500/30 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            <svg className="animate-spin h-5 w-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="relative z-10">Compressing... {progress}%</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" /> Download Exact File
          </>
        )}
      </button>

      <button
        onClick={onClear}
        className="px-6 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-5 h-5" /> Clear
      </button>
    </div>
  );
};
