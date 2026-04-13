import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Download, LayoutList, Layers, Loader2, Trash2 } from 'lucide-react';
import { MergeMode, PdfFile } from '../hooks/usePdfMerger';

interface MergeSettingsProps {
  files: PdfFile[];
  mergeMode: MergeMode;
  setMergeMode: (mode: MergeMode) => void;
  applySequential: () => void;
  applyInterleave: () => void;
  filename: string;
  setFilename: (name: string) => void;
  isMerging: boolean;
  progress: number;
  onMerge: () => void;
  onClear: () => void;
  hasPages: boolean;
}

export function MergeSettings({
  files,
  mergeMode,
  setMergeMode,
  applySequential,
  applyInterleave,
  filename,
  setFilename,
  isMerging,
  progress,
  onMerge,
  onClear,
  hasPages
}: MergeSettingsProps) {
  
  const handleModeChange = (mode: string) => {
    const newMode = mode as MergeMode;
    setMergeMode(newMode);
    if (newMode === 'Sequential') applySequential();
    if (newMode === 'Interleaved') applyInterleave();
  };

  return (
    <div className="space-y-8">
      {/* File Info Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-sm font-bold text-slate-800 mb-2">Files Uploaded: {files.length}</p>
        <ul className="text-xs text-slate-500 space-y-1 max-h-32 overflow-y-auto pr-2">
          {files.map((f, i) => (
            <li key={f.id} className="flex justify-between items-center truncate">
              <span className="truncate pr-2">{i+1}. {f.name}</span>
              <span className="shrink-0">{f.originalPagesCount} pg</span>
            </li>
          ))}
          {files.length === 0 && <li>No files uploaded yet.</li>}
        </ul>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Auto-Arrange Mode</Label>
        <RadioGroup value={mergeMode} onValueChange={handleModeChange} className="grid grid-cols-1 gap-3">
          <div>
            <RadioGroupItem value="Sequential" id="seq" className="peer sr-only" disabled={files.length === 0} />
            <Label
              htmlFor="seq"
              className="flex items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LayoutList className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Sequential Merge</div>
                  <div className="text-xs text-muted-foreground">Append files one after another (A1, A2, B1, B2)</div>
                </div>
              </div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="Interleaved" id="intl" className="peer sr-only" disabled={files.length < 2} />
            <Label
              htmlFor="intl"
              className="flex items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Interleave Merge</div>
                  <div className="text-xs text-muted-foreground">Mix pages alternately (A1, B1, A2, B2)</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-slate-500 italic">
          *Note: You can always manually drag and drop pages in the grid to fine-tune the exact order.
        </p>
      </div>

      <div className="space-y-3 pt-6 border-t border-border">
        <Label>Output Filename</Label>
        <Input 
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="merged_document.pdf"
        />
      </div>

      {isMerging && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Generating PDF...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={onClear} 
          disabled={!hasPages || isMerging}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
        <Button 
          onClick={onMerge} 
          disabled={!hasPages || isMerging}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isMerging ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isMerging ? 'Processing...' : 'Export PDF'}
        </Button>
      </div>
    </div>
  );
}
