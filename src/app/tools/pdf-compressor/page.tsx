'use client';

import React from 'react';
import { usePDFCompressor } from './hooks/usePDFCompressor';
import { PDFUploader } from './components/PDFUploader';
import { CompressionSettings } from './components/CompressionSettings';
import { StatsPanel } from './components/StatsPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { ActionButtons } from './components/ActionButtons';
import { FileArchive } from 'lucide-react';

export default function PDFCompressorTool() {
  const {
    pdfFile,
    settings,
    setSettings,
    isCompressing,
    progress,
    resultBlob,
    stats,
    handleUpload,
    clearFile,
    download,
  } = usePDFCompressor();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4 text-indigo-600">
            <FileArchive className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">PDF Compressor Tool</h1>
          <p className="text-lg text-slate-600 font-medium">
            Reduce the file size of your PDF documents instantly in your browser. 100% secure, no data sent to servers.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* Left Column: Settings */}
            <div className="lg:col-span-8 p-8 md:p-10 space-y-10 bg-white">
              
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">1. Upload PDF Document</h2>
                <PDFUploader pdfFile={pdfFile} onUpload={handleUpload} />
              </section>

              {pdfFile && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-800">2. Select Compression Level</h2>
                    <CompressionSettings 
                      settings={settings} 
                      setSettings={setSettings} 
                      disabled={false} 
                      originalSize={pdfFile.size}
                      resultBlob={resultBlob}
                      isCompressing={isCompressing}
                    />
                  </section>
                  
                  <ActionButtons 
                    hasFile={!!pdfFile}
                    hasResult={!!resultBlob}
                    isCompressing={isCompressing}
                    progress={progress}
                    onDownload={download}
                    onClear={clearFile}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-4 bg-slate-50 p-8 md:p-10 flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Document Preview</h2>
              {pdfFile ? (
                <PreviewPanel fileUrl={pdfFile.url} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-white/50">
                  <FileArchive className="w-12 h-12 mb-3 text-slate-300 opacity-50" />
                  <p className="font-medium">Upload a PDF to see preview</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Features / How to use */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-lg">Local Processing</h4>
            <p className="text-slate-600 text-sm">All compression happens directly inside your browser. Your files are never uploaded to any server, ensuring complete privacy.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-lg">Structural Optimization</h4>
            <p className="text-slate-600 text-sm">We use advanced object streams and metadata cleanup to heavily compress the PDF dictionary and internal tables natively.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-lg">Lossless Quality</h4>
            <p className="text-slate-600 text-sm">Select presets like eBook or Print to maintain optimal quality while achieving the best possible file size reduction.</p>
          </div>
        </div>

      </div>
    </div>
  );
}