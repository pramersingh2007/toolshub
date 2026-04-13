import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download, Trash2, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExportPreset } from '../hooks/useJpgToPdf';

interface ActionBarProps {
  filename: string;
  setFilename: (name: string) => void;
  preset: ExportPreset;
  setPreset: (preset: ExportPreset) => void;
  quality: number;
  setQuality: (quality: number) => void;
  isGenerating: boolean;
  progress: number;
  onClear: () => void;
  onGenerate: () => void;
  hasImages: boolean;
}

export function ActionBar({
  filename,
  setFilename,
  preset,
  setPreset,
  quality,
  setQuality,
  isGenerating,
  progress,
  onClear,
  onGenerate,
  hasImages
}: ActionBarProps) {
  return (
    <div className="space-y-6 pt-6 border-t border-border">
      <div className="space-y-3">
        <Label>Output Filename</Label>
        <Input 
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="document.pdf"
        />
      </div>

      <div className="space-y-3">
        <Label>Export Quality Profile</Label>
        <Select
          value={preset}
          onValueChange={(val) => setPreset(val as ExportPreset)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select quality profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High Quality (Print & HD)</SelectItem>
            <SelectItem value="Medium">Medium (Standard Sharing)</SelectItem>
            <SelectItem value="Low">Low (Email / Fast Web)</SelectItem>
            <SelectItem value="Custom">Custom Settings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {preset === 'Custom' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Custom Quality: {Math.round(quality * 100)}%</Label>
          </div>
          <Slider
            value={[quality]}
            min={0.1}
            max={1}
            step={0.05}
            onValueChange={(vals) => setQuality(vals[0])}
          />
          <p className="text-xs text-muted-foreground">
            Lower quality drastically reduces PDF size.
          </p>
        </div>
      )}

      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Generating PDF...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={onClear} 
          disabled={!hasImages || isGenerating}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
        <Button 
          onClick={onGenerate} 
          disabled={!hasImages || isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isGenerating ? 'Processing...' : 'Export PDF'}
        </Button>
      </div>
    </div>
  );
}
