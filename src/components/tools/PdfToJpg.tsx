"use client";

import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFUploader } from '@/app/tools/pdf-to-jpg/components/PDFUploader';
import { ConversionSettings } from '@/app/tools/pdf-to-jpg/components/ConversionSettings';
import { ProgressStatus } from '@/app/tools/pdf-to-jpg/components/ProgressStatus';
import { PreviewGrid } from '@/app/tools/pdf-to-jpg/components/PreviewGrid';
import { usePDFToImage, ConversionSettings as Settings, ConvertedImage } from '@/app/tools/pdf-to-jpg/hooks/usePDFToImage';
import { downloadZip } from '@/app/tools/pdf-to-jpg/utils/exportZip';
import { DownloadCloud, Trash2, ArrowRight, FileImage } from 'lucide-react';

export default function PDFToJPGPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings>({
    dpiScale: 2,
    jpegQuality: 0.8,
    pageRange: 'all',
  });
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isZipLoading, setIsZipLoading] = useState(false);

  const { convertPDF, isConverting, progress, currentConvertingPage, totalConvertingPages, error } = usePDFToImage();

  // Get total pages when file is selected
  useEffect(() => {
    if (!file) {
      setTotalPages(null);
      return;
    }
    const loadPDF = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setTotalPages(pdf.numPages);
      } catch (err) {
        console.error("Error reading PDF:", err);
      }
    };
    loadPDF();
  }, [file]);

  const handleConvert = async () => {
    if (!file) return;
    try {
      const images = await convertPDF(file, settings);
      setConvertedImages(images);
    } catch (err) {
      console.error("Conversion failed:", err);
    }
  };

  const handleDownloadAll = async () => {
    if (convertedImages.length === 0) return;
    setIsZipLoading(true);
    try {
      await downloadZip(convertedImages, 'pdf-images.zip');
    } catch (err) {
      console.error("ZIP creation failed:", err);
    } finally {
      setIsZipLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setConvertedImages([]);
    setTotalPages(null);
  };

  return (
    <div className="w-full space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Upload & Settings */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border">
              <PDFUploader 
                selectedFile={file} 
                onFileSelect={(f) => {
                  setFile(f);
                  setConvertedImages([]);
                }} 
                totalPages={totalPages}
              />
            </div>

            {file && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <ConversionSettings 
                  settings={settings} 
                  onChange={setSettings} 
                  disabled={isConverting} 
                />

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-2xl text-sm border border-destructive/20 flex items-center space-x-2 font-medium">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full py-4 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-2xl font-bold shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
                >
                  <span>{isConverting ? 'Converting...' : 'Convert to JPG'}</span>
                  {!isConverting && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            )}

            <ProgressStatus 
              isConverting={isConverting}
              progress={progress}
              currentPage={currentConvertingPage}
              totalPages={totalConvertingPages}
            />
          </div>

          {/* Right Panel: Preview & Downloads */}
          <div className="lg:col-span-7">
            {convertedImages.length > 0 ? (
              <div className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-border space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <h3 className="font-black text-foreground text-2xl tracking-tight">Converted Images</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">{convertedImages.length} pages ready to download</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleClear}
                      className="text-muted-foreground hover:text-destructive p-3 rounded-2xl hover:bg-destructive/10 transition-colors"
                      title="Clear All"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownloadAll}
                      disabled={isZipLoading}
                      className="px-6 py-3 bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-secondary-foreground rounded-2xl text-sm font-bold flex items-center space-x-2 transition-all shadow-sm"
                    >
                      <DownloadCloud className="w-4 h-4" />
                      <span>{isZipLoading ? 'Zipping...' : 'Download All (ZIP)'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="max-h-[700px] overflow-y-auto pr-2">
                  <PreviewGrid images={convertedImages} />
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] lg:min-h-[600px] bg-card/30 rounded-3xl border-2 border-border border-dashed flex flex-col items-center justify-center text-muted-foreground space-y-5 p-8 text-center">
                <div className="w-24 h-24 bg-card rounded-[2rem] shadow-sm border border-border flex items-center justify-center">
                  <FileImage className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">No images yet</h3>
                  <p className="text-sm mt-2 max-w-sm text-muted-foreground font-medium">Upload a PDF and click convert to see your high-quality JPG previews here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
