import React from 'react';
import { PageSettings as SettingsType, PageSize, Orientation, FitMode, LayoutMode } from '../hooks/useJpgToPdf';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface PageSettingsProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
}

export function PageSettings({ settings, onSettingsChange }: PageSettingsProps) {
  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Layout Mode</Label>
        <Select
          value={settings.layout}
          onValueChange={(val) => updateSetting('layout', val as LayoutMode)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">1 Image per Page</SelectItem>
            <SelectItem value="Grid">Multiple Images (Grid)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {settings.layout === 'Grid' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-3">
            <Label>Rows</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={settings.gridRows}
              onChange={(e) => updateSetting('gridRows', Number(e.target.value))}
            />
          </div>
          <div className="space-y-3">
            <Label>Cols</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={settings.gridCols}
              onChange={(e) => updateSetting('gridCols', Number(e.target.value))}
            />
          </div>
          <div className="space-y-3">
            <Label>Spacing</Label>
            <Input
              type="number"
              min={0}
              value={settings.gridSpacing}
              onChange={(e) => updateSetting('gridSpacing', Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label>Page Size</Label>
        <Select
          value={settings.pageSize}
          onValueChange={(val) => updateSetting('pageSize', val as PageSize)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
            <SelectItem value="Letter">Letter (8.5 x 11 in)</SelectItem>
            {settings.layout === 'Single' && <SelectItem value="Fit">Fit (Same as image)</SelectItem>}
            <SelectItem value="Custom">Custom Size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {settings.pageSize === 'Custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Width (mm)</Label>
            <Input
              type="number"
              min={10}
              value={settings.customWidth}
              onChange={(e) => updateSetting('customWidth', Number(e.target.value))}
            />
          </div>
          <div className="space-y-3">
            <Label>Height (mm)</Label>
            <Input
              type="number"
              min={10}
              value={settings.customHeight}
              onChange={(e) => updateSetting('customHeight', Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {settings.pageSize !== 'Fit' && (
        <div className="space-y-3">
          <Label>Orientation</Label>
          <Select
            value={settings.orientation}
            onValueChange={(val) => updateSetting('orientation', val as Orientation)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Auto">Auto (Smart Detect)</SelectItem>
              <SelectItem value="Portrait">Portrait</SelectItem>
              <SelectItem value="Landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {settings.pageSize !== 'Fit' && (
        <div className="space-y-3">
          <Label>Image Fit</Label>
          <Select
            value={settings.fitMode}
            onValueChange={(val) => updateSetting('fitMode', val as FitMode)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fit mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Contain">Contain (No Crop)</SelectItem>
              <SelectItem value="Cover">Cover (Fill Page/Cell)</SelectItem>
              <SelectItem value="Original">Original Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Page Margin: {settings.margin} mm</Label>
        </div>
        <Slider
          value={[settings.margin]}
          min={0}
          max={50}
          step={1}
          onValueChange={(vals) => updateSetting('margin', vals[0])}
        />
      </div>

      <div className="pt-4 border-t border-border space-y-4">
        <div className="space-y-3">
          <Label>Watermark Text</Label>
          <Input
            placeholder="e.g. CONFIDENTIAL"
            value={settings.watermarkText}
            onChange={(e) => updateSetting('watermarkText', e.target.value)}
          />
        </div>
        
        {settings.watermarkText && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Watermark Opacity: {Math.round(settings.watermarkOpacity * 100)}%</Label>
            </div>
            <Slider
              value={[settings.watermarkOpacity]}
              min={0.1}
              max={1}
              step={0.1}
              onValueChange={(vals) => updateSetting('watermarkOpacity', vals[0])}
            />
          </div>
        )}

        <div className="flex items-center justify-between space-x-2 pt-2">
          <Label htmlFor="page-numbers" className="flex-1 cursor-pointer">
            Add Page Numbers
          </Label>
          <Switch
            id="page-numbers"
            checked={settings.pageNumbers}
            onCheckedChange={(checked) => updateSetting('pageNumbers', checked)}
          />
        </div>
      </div>
    </div>
  );
}
