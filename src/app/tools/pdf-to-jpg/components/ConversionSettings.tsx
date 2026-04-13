import React from 'react';
import { ConversionSettings as Settings } from '../hooks/usePDFToImage';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConversionSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
  disabled?: boolean;
}

export const ConversionSettings: React.FC<ConversionSettingsProps> = ({ settings, onChange, disabled }) => {
  return (
    <div className="bg-card p-6 rounded-3xl shadow-sm border border-border space-y-6">
      <h3 className="font-bold text-foreground text-lg">Conversion Settings</h3>
      
      {/* DPI / Quality */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Image Resolution</Label>
        <Select 
          disabled={disabled}
          value={settings.dpiScale.toString()}
          onValueChange={(val) => onChange({ ...settings, dpiScale: parseInt(val) })}
        >
          <SelectTrigger className="w-full px-4 h-[50px] border border-border bg-background text-foreground rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-medium transition-all hover:border-primary/50">
            <SelectValue placeholder="Select resolution" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-border bg-card text-card-foreground shadow-xl p-1.5 animate-in fade-in-80 zoom-in-95">
            <SelectItem value="1" className="py-3 px-4 font-semibold rounded-xl cursor-pointer focus:bg-primary focus:text-primary-foreground transition-all data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary">
              Standard Quality (1x)
            </SelectItem>
            <SelectItem value="2" className="py-3 px-4 font-semibold rounded-xl cursor-pointer focus:bg-primary focus:text-primary-foreground transition-all data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary">
              High Quality (2x)
            </SelectItem>
            <SelectItem value="3" className="py-3 px-4 font-semibold rounded-xl cursor-pointer focus:bg-primary focus:text-primary-foreground transition-all data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary">
              Print Quality (3x)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* JPEG Quality */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">JPEG Quality</Label>
          <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            {Math.round(settings.jpegQuality * 100)}%
          </span>
        </div>
        <Slider
          disabled={disabled}
          min={0.1}
          max={1}
          step={0.1}
          value={[settings.jpegQuality]}
          onValueChange={(val) => onChange({ ...settings, jpegQuality: val[0] })}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Page Range */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium text-foreground">Pages to Convert</Label>
        <input
          type="text"
          value={settings.pageRange}
          disabled={disabled}
          onChange={(e) => onChange({ ...settings, pageRange: e.target.value })}
          placeholder="e.g. all, 1-3, 5, 8"
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all disabled:bg-muted disabled:text-muted-foreground placeholder:text-muted-foreground/60"
        />
        <p className="text-xs text-muted-foreground">Leave 'all' or enter specific pages like '1-3, 5'</p>
      </div>
    </div>
  );
};
