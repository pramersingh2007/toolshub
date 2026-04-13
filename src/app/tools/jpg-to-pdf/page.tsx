"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ALL_TOOLS } from '@/lib/tools-registry';
import { useJpgToPdf } from './hooks/useJpgToPdf';
import { ImageUploader } from './components/ImageUploader';
import { SortableGrid } from './components/SortableGrid';
import { PageSettings } from './components/PageSettings';
import { PreviewPanel } from './components/PreviewPanel';
import { ActionBar } from './components/ActionBar';
import { FileImage } from 'lucide-react';

export default function JpgToPdfTool() {
  const {
    images,
    addImages,
    removeImage,
    clearAll,
    reorderImages,
    settings,
    setSettings,
    preset,
    setPreset,
    quality,
    setQuality,
    filename,
    setFilename,
    isGenerating,
    progress,
    generatePdf
  } = useJpgToPdf();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container max-w-6xl mx-auto py-8 px-4 flex-1">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <FileImage className="w-8 h-8 mr-3 text-primary" />
            JPG to PDF Converter
          </h1>
          <p className="text-muted-foreground">
            Convert multiple JPG, JPEG, or PNG images to a single PDF document. Drag and drop to reorder images.
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Upload & Arrange */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">1. Upload Images</h2>
            <ImageUploader onUpload={addImages} />
            
            {images.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    2. Arrange Pages ({images.length})
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    Drag and drop to reorder
                  </span>
                </div>
                <SortableGrid 
                  images={images} 
                  setImages={reorderImages} 
                  onRemove={removeImage} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Settings & Export */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-8">
            <h2 className="text-lg font-semibold mb-4">3. Page Settings</h2>
            
            <PageSettings 
              settings={settings} 
              onSettingsChange={setSettings} 
            />

            <div className="my-8 py-6 border-y border-border">
              <PreviewPanel 
                settings={settings} 
                firstImage={images[0]} 
              />
            </div>

            <h2 className="text-lg font-semibold mb-4">4. Export</h2>
            <ActionBar
              filename={filename}
              setFilename={setFilename}
              preset={preset}
              setPreset={setPreset}
              quality={quality}
              setQuality={setQuality}
              isGenerating={isGenerating}
              progress={progress}
              onClear={clearAll}
              onGenerate={generatePdf}
              hasImages={images.length > 0}
            />
          </div>
        </div>
      </div>

      {/* Related Tools (Negative Style) */}
      <div className="mt-16 bg-slate-900 text-slate-50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <h3 className="text-2xl font-black mb-2 relative z-10">Related Tools</h3>
        <p className="text-slate-400 mb-8 relative z-10">Explore other free PDF utilities in our suite.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {ALL_TOOLS.filter(t => t.category === 'pdf-tools' && t.id !== 'jpg-to-pdf').map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.id} href={t.link} className="block group">
                <div className="p-6 rounded-3xl bg-slate-800/50 hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-slate-500 h-full flex flex-col">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="font-bold text-lg">{t.name}</div>
                  </div>
                  <div className="text-sm text-slate-400 leading-relaxed flex-1">{t.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  </div>
  );
}
