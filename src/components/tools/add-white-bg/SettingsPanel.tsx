import { ProcessingSettings } from '../../../lib/tools/add-white-bg/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings2, Image as ImageIcon, PaintBucket, Scaling, Scissors } from 'lucide-react';

interface SettingsPanelProps {
  settings: ProcessingSettings;
  setSettings: (settings: ProcessingSettings) => void;
  disabled: boolean;
}

export function SettingsPanel({ settings, setSettings, disabled }: SettingsPanelProps) {
  return (
    <Card className="sticky top-24 border-none shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Settings
        </CardTitle>
        <CardDescription>Configure output options</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        
        {/* Remove Background Option */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5 flex-1">
            <Label className="text-base flex items-center gap-2 cursor-pointer" htmlFor="remove-bg">
              <Scissors className="w-4 h-4 text-muted-foreground" />
              Remove Original Bg (AI)
            </Label>
            <p className="text-xs text-muted-foreground">Automatically remove existing background</p>
          </div>
          <Switch
            id="remove-bg"
            disabled={disabled}
            checked={settings.removeBg}
            onCheckedChange={(checked) => setSettings({ ...settings, removeBg: checked })}
          />
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Background Color */}
        <div className="space-y-3">
          <Label className="text-base flex items-center gap-2">
            <PaintBucket className="w-4 h-4 text-muted-foreground" />
            Background Color
          </Label>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
              <input
                type="color"
                disabled={disabled}
                value={settings.bgColor}
                onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
              />
            </div>
            <Input
              type="text"
              disabled={disabled}
              value={settings.bgColor.toUpperCase()}
              onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
              className="font-mono uppercase"
            />
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Padding Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base flex items-center gap-2">
              <Scaling className="w-4 h-4 text-muted-foreground" />
              Padding
            </Label>
            <span className="text-sm font-mono bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
              {settings.padding}px
            </span>
          </div>
          <Slider
            disabled={disabled}
            value={[settings.padding]}
            min={0}
            max={500}
            step={10}
            onValueChange={([val]) => setSettings({ ...settings, padding: val })}
            className="w-full"
          />
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Format Select */}
        <div className="space-y-3">
          <Label className="text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            Output Format
          </Label>
          <Select
            disabled={disabled}
            value={settings.format}
            onValueChange={(val: any) => setSettings({ ...settings, format: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image/jpeg">JPEG Image</SelectItem>
              <SelectItem value="image/png">PNG Image</SelectItem>
              <SelectItem value="image/webp">WEBP Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quality Slider (if not PNG) */}
        {settings.format !== 'image/png' && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-base text-muted-foreground">Quality</Label>
              <span className="text-sm font-mono bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                {Math.round(settings.quality * 100)}%
              </span>
            </div>
            <Slider
              disabled={disabled}
              value={[settings.quality]}
              min={0.1}
              max={1}
              step={0.1}
              onValueChange={([val]) => setSettings({ ...settings, quality: val })}
              className="w-full"
            />
          </div>
        )}

      </CardContent>
    </Card>
  );
}
