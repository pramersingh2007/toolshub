import React from 'react';
import { CompressionStats } from '../types';
import { ArrowDownToLine, FileArchive } from 'lucide-react';

interface StatsPanelProps {
  stats: CompressionStats | null;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  if (!stats) return null;

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savedSize = stats.originalSize - stats.compressedSize;
  const isReduced = stats.reductionPercentage > 0;

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mt-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
        <FileArchive className="w-4 h-4" /> Compression Results
      </h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Original Size</p>
          <p className="text-xl font-black text-slate-700">{formatSize(stats.originalSize)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Compressed Size</p>
          <p className="text-xl font-black text-emerald-600">{formatSize(stats.compressedSize)}</p>
        </div>
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wide mb-1 relative z-10">Space Saved</p>
          <p className="text-xl font-black relative z-10 flex items-center justify-center gap-1">
            <ArrowDownToLine className="w-4 h-4" /> {Math.round(stats.reductionPercentage)}%
          </p>
        </div>
      </div>

      {isReduced ? (
        <p className="text-sm text-emerald-700 font-medium text-center">
          Great! You saved <strong>{formatSize(savedSize)}</strong> without losing visible quality.
        </p>
      ) : (
        <p className="text-sm text-amber-600 font-medium text-center bg-amber-50 p-2 rounded-lg border border-amber-200">
          This file is already highly optimized. Further compression isn't possible structurally.
        </p>
      )}
    </div>
  );
};