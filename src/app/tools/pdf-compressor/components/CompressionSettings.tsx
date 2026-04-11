import React from 'react';
import { CompressionSettings as ISettings } from '../types';
import { Slider } from '@/components/ui/slider';
import { FileArchive, ArrowRight } from 'lucide-react';

interface CompressionSettingsProps {
  settings: ISettings;
  setSettings: (s: ISettings) => void;
  disabled: boolean;
  originalSize?: number;
  resultBlob?: Blob | null;
  isCompressing?: boolean;
}

export const CompressionSettings: React.FC<CompressionSettingsProps> = ({ 
  settings, 
  setSettings, 
  disabled, 
  originalSize = 0,
  resultBlob,
  isCompressing
}) => {
  
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const exactSize = resultBlob ? formatSize(resultBlob.size) : '...';

  return (
    <div className={`space-y-6 bg-slate-50 border border-slate-200 p-6 rounded-2xl`}>
      
      {/* Exact Real-time Size Estimator */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-100 shadow-sm transition-all duration-300">
         <div className="flex flex-col">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Size</span>
           <span className="text-lg font-bold text-slate-700">{formatSize(originalSize)}</span>
         </div>
         <ArrowRight className="w-5 h-5 text-slate-300" />
         <div className="flex flex-col text-right">
           <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-end gap-1">
             <FileArchive className="w-3 h-3" /> Exact Final Size
           </span>
           <span className="text-xl font-black text-indigo-600 transition-all duration-300">
             {isCompressing ? (
                <span className="text-sm animate-pulse text-indigo-400 flex items-center gap-1 justify-end mt-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing
                </span>
             ) : exactSize}
           </span>
         </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-slate-700">Compression Level</label>
          <span className="text-indigo-600 font-black text-xl bg-indigo-50 px-3 py-1 rounded-lg">{settings.compressionLevel}%</span>
        </div>
        
        {/* Highly Attractive Cursor/Slider */}
        <div className="px-1">
          <Slider 
            value={[settings.compressionLevel]} 
            onValueChange={(val) => setSettings({ compressionLevel: val[0] })} 
            max={100} 
            min={1} 
            step={1} 
            className="py-4 cursor-pointer [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:bg-indigo-600 [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-transform [&_[role=slider]]:hover:scale-110"
            disabled={disabled && isCompressing}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">
          <span className="bg-slate-100 px-2 py-1 rounded">Low Compression</span>
          <span className="bg-slate-100 px-2 py-1 rounded">Maximum Compression</span>
        </div>
      </div>

    </div>
  );
};
