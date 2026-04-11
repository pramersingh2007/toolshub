import { useState, useCallback } from 'react';
import { ProcessingImage, ProcessingSettings } from '../lib/tools/add-white-bg/types';
import { processImage } from '../lib/tools/add-white-bg/ProcessingEngine';
import { downloadAll } from '../lib/tools/add-white-bg/ExportEngine';

export const useImageProcessor = () => {
  const [images, setImages] = useState<ProcessingImage[]>([]);
  const [settings, setSettings] = useState<ProcessingSettings>({
    removeBg: false,
    bgColor: '#ffffff',
    padding: 0,
    format: 'image/jpeg',
    quality: 0.9,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const addImages = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      width: 0,
      height: 0,
      status: 'Waiting' as const,
    }));
    
    // Attempt to load dimensions
    newImages.forEach(img => {
        const image = new Image();
        image.onload = () => {
            setImages(prev => prev.map(p => p.id === img.id ? { ...p, width: image.width, height: image.height } : p));
        };
        image.src = img.previewUrl;
    });

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((p) => p.id === id);
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
      if (img?.processedUrl) URL.revokeObjectURL(img.processedUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const processAll = useCallback(async () => {
    setIsProcessing(true);
    
    const queue = [...images];
    
    // We will process them sequentially to avoid overwhelming browser or API
    for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        if (item.status === 'Done') continue;

        try {
            const blob = await processImage(item.file, settings, (status) => {
                setImages((prev) => 
                    prev.map((p) => (p.id === item.id ? { ...p, status } : p))
                );
            });
            
            const processedUrl = URL.createObjectURL(blob);
            setImages((prev) => 
                prev.map((p) => 
                    p.id === item.id 
                    ? { ...p, status: 'Done', processedBlob: blob, processedUrl } 
                    : p
                )
            );
        } catch (error: any) {
            setImages((prev) => 
                prev.map((p) => 
                    p.id === item.id 
                    ? { ...p, status: 'Error', error: error.message } 
                    : p
                )
            );
        }
    }
    
    setIsProcessing(false);
  }, [images, settings]);

  const downloadCompleted = useCallback(() => {
    const completed = images.filter((img) => img.status === 'Done' && img.processedBlob);
    if (completed.length === 0) return;

    const filesToDownload = completed.map((img) => ({
      blob: img.processedBlob!,
      originalName: img.file.name,
    }));

    downloadAll(filesToDownload, settings.format);
  }, [images, settings.format]);

  return {
    images,
    settings,
    isProcessing,
    setSettings,
    addImages,
    removeImage,
    processAll,
    downloadCompleted,
  };
};
