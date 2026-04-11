import React from 'react';
import { MergeOptions, MergeDirection, Alignment } from '../types';

interface MergeSettingsProps {
  options: MergeOptions;
  onChange: (options: MergeOptions) => void;
}

export const MergeSettings: React.FC<MergeSettingsProps> = ({ options, onChange }) => {
  const update = (key: keyof MergeOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Direction */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Direction</label>
        <div className="grid grid-cols-3 gap-2">
          {(['vertical', 'horizontal', 'grid'] as MergeDirection[]).map((dir) => (
            <button
              key={dir}
              onClick={() => update('direction', dir)}
              className={`px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                options.direction === dir
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Columns */}
      {options.direction === 'grid' && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Columns</label>
          <input
            type="number"
            min={1}
            max={10}
            value={options.columns}
            onChange={(e) => update('columns', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Alignment */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Alignment</label>
        <div className="grid grid-cols-3 gap-2">
          {(['start', 'center', 'end'] as Alignment[]).map((align) => (
            <button
              key={align}
              onClick={() => update('alignment', align)}
              className={`px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                options.alignment === align
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {align === 'start' ? 'Start' : align === 'end' ? 'End' : 'Center'}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing / Gap */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">Spacing (Gap)</label>
          <span className="text-sm font-mono text-slate-500">{options.gap}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={200}
          value={options.gap}
          onChange={(e) => update('gap', parseInt(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Background Color</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={options.bgColor}
            onChange={(e) => update('bgColor', e.target.value)}
            className="w-10 h-10 p-0 border-0 rounded cursor-pointer overflow-hidden shadow-sm"
          />
          <input
            type="text"
            value={options.bgColor}
            onChange={(e) => update('bgColor', e.target.value)}
            className="flex-1 px-3 py-2 font-mono text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            maxLength={7}
          />
        </div>
      </div>
    </div>
  );
};