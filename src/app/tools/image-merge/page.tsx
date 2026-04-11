'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ImageItem, MergeOptions } from './types';
import { ImageUploader } from './components/ImageUploader';
import { SortableGrid } from './components/SortableGrid';
import { MergeSettings } from './components/MergeSettings';
import { PreviewCanvas } from './components/PreviewCanvas';
import { ExportPanel } from './components/ExportPanel';
import { renderMergedImage } from './engine';
import { Trash2 } from 'lucide-react';

export default function ImageMergeTool() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [options, setOptions] = useState<MergeOptions>({
    direction: 'vertical',
    columns: 2,
    gap: 10,
    bgColor: '#ffffff',
    alignment: 'center',
    format: 'image/jpeg',
    quality: 0,
    scale: 1,
  });

  const [isExporting, setIsExporting] = useState(false);

  // Cleanup object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddImages = useCallback((newImages: ImageItem[]) => {
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear all images?')) return;
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  }, [images]);

  const handleExport = async () => {
    if (images.length === 0) return;
    setIsExporting(true);

    try {
      // Small timeout to allow UI to update to "Processing..." state
      await new Promise(r => setTimeout(r, 50));
      
      const canvas = document.createElement('canvas');
      await renderMergedImage(canvas, images, options);

      // Calculate quality (0 compression = 1.0 quality, 100 compression = 0.01 quality)
      const calculatedQuality = Math.max(0.01, (100 - options.quality) / 100);
      
      const blob = await new Promise<Blob | null>((resolve) => 
        canvas.toBlob(resolve, options.format, calculatedQuality)
      );

      if (!blob) throw new Error('Export failed to generate blob');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const ext = options.format.split('/')[1];
      link.download = `merged-image-${Date.now()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export Error:', error);
      alert('Failed to export image. Ensure images are valid and try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Image Merge Tool</h1>
          <p className="mt-3 text-lg text-slate-600">
            Combine multiple images into one. Reorder, choose layout directions, and export in high quality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Settings */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Layout Settings</h2>
                {images.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Clear All
                  </button>
                )}
              </div>
              
              <MergeSettings options={options} onChange={setOptions} />
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <ExportPanel 
                  options={options} 
                  onChange={setOptions} 
                  onExport={handleExport} 
                  isExporting={isExporting} 
                />
              </div>
            </div>
          </div>

          {/* Right Panel: Preview & Upload */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">1. Add Images</h2>
              <ImageUploader onAddImages={handleAddImages} />
              <SortableGrid images={images} setImages={setImages} onRemove={handleRemoveImage} />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">2. Live Preview</h2>
              <PreviewCanvas images={images} options={options} />
            </div>
          </div>

        </div>

        {/* How to Use Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">How to Use the Image Merge Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">1</div>
              <h3 className="font-semibold text-slate-800">Upload Images</h3>
              <p className="text-sm text-slate-600">Drag and drop or click to select multiple images. Supported formats are JPG, PNG, and WebP.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">2</div>
              <h3 className="font-semibold text-slate-800">Adjust Layout</h3>
              <p className="text-sm text-slate-600">Choose between vertical, horizontal, or grid layouts. You can also reorder images by dragging them.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">3</div>
              <h3 className="font-semibold text-slate-800">Export & Download</h3>
              <p className="text-sm text-slate-600">Select your desired format (PNG, JPEG), set the compression level, and click download to get your merged image.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}