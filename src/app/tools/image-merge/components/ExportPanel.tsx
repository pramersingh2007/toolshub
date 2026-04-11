import React from 'react';
import { Download } from 'lucide-react';
import { MergeOptions, OutputFormat } from '../types';

interface ExportPanelProps {
  options: MergeOptions;
  onChange: (options: MergeOptions) => void;
  onExport: () => void;
  isExporting: boolean;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ options, onChange, onExport, isExporting }) => {
  const update = (key: keyof MergeOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
      <div className="flex items-center space-x-2">
        <Download className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-800">Export Settings</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
        <select
          value={options.format}
          onChange={(e) => update('format', e.target.value as OutputFormat)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="image/png">PNG (Lossless)</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
        </select>
      </div>

      {(options.format === 'image/jpeg' || options.format === 'image/webp') && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Compression Level</label>
            <span className="text-sm font-mono text-slate-500">{options.quality}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={options.quality}
            onChange={(e) => update('quality', parseInt(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mt-1">
            <span>High Quality (0%)</span>
            <span>Small Size (100%)</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Scale (Resolution)</label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((scale) => (
            <button
              key={scale}
              onClick={() => update('scale', scale)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                options.scale === scale
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {scale}x {scale === 3 && '(HD)'}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onExport}
        disabled={isExporting}
        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm hover:shadow-md"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download Merged Image</span>
          </>
        )}
      </button>
    </div>
  );
};