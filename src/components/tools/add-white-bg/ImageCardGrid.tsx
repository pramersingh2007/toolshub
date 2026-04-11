import { ProcessingImage } from '../../../lib/tools/add-white-bg/types';
import { downloadBlob } from '../../../lib/tools/add-white-bg/ExportEngine';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Loader2, CheckCircle2, AlertCircle, Wand2, ImageIcon } from 'lucide-react';

interface ImageCardGridProps {
  images: ProcessingImage[];
  onRemove: (id: string) => void;
  format: string;
}

export function ImageCardGrid({ images, onRemove, format }: ImageCardGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img) => (
        <Card key={img.id} className="overflow-hidden flex flex-col relative group border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(img.id)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="h-48 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-center relative overflow-hidden pattern-dots pattern-gray-200 dark:pattern-gray-800 pattern-size-4">
            <img
              src={img.processedUrl || img.previewUrl}
              alt="preview"
              className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform hover:scale-105"
            />
          </div>

          <div className="p-4 flex flex-col flex-1 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="text-sm font-medium truncate text-gray-800 dark:text-gray-200" title={img.file.name}>
              {img.file.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              {img.width > 0 ? `${img.width} × ${img.height}` : 'Loading dimensions...'}
            </div>

            <div className="mt-4 flex items-center justify-between mt-auto">
              <div className="flex items-center">
                {img.status === 'Waiting' && (
                  <Badge variant="secondary" className="font-normal">
                    Waiting...
                  </Badge>
                )}
                {img.status === 'AI Removing' && (
                  <Badge variant="default" className="font-normal bg-purple-500 hover:bg-purple-600 flex gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> AI Magic
                  </Badge>
                )}
                {img.status === 'Processing' && (
                  <Badge variant="default" className="font-normal bg-blue-500 hover:bg-blue-600 flex gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Processing
                  </Badge>
                )}
                {img.status === 'Done' && (
                  <Badge variant="outline" className="font-normal border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 flex gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </Badge>
                )}
                {img.status === 'Error' && (
                  <Badge variant="destructive" className="font-normal flex gap-1 truncate max-w-[120px]" title={img.error}>
                    <AlertCircle className="w-3 h-3" /> Error
                  </Badge>
                )}
              </div>

              {img.status === 'Done' && img.processedBlob && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => downloadBlob(img.processedBlob!, `processed_${img.file.name}`)}
                  className="h-8 text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Save
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
