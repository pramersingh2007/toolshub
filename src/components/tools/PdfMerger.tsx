"use client";

import React from "react";
import { Layers } from "lucide-react";
import { usePdfMerger } from "@/app/tools/pdf-merger/hooks/usePdfMerger";
import { PdfUploader } from "@/app/tools/pdf-merger/components/PdfUploader";
import { PageGrid } from "@/app/tools/pdf-merger/components/PageGrid";
import { MergeSettings } from "@/app/tools/pdf-merger/components/MergeSettings";
import { PreviewZoomModal } from "@/app/tools/pdf-merger/components/PreviewZoomModal";
import { Progress } from "@/components/ui/progress";

export function PdfMerger() {
  const {
    files,
    pages,
    addFiles,
    removePage,
    clearAll,
    reorderPages,
    rotatePage,
    isProcessing,
    isMerging,
    progress,
    mergeMode,
    setMergeMode,
    applyInterleave,
    applySequential,
    filename,
    setFilename,
    mergePdfs,
    previewPage,
    setPreviewPage
  } = usePdfMerger();

  return (
    <div className="flex flex-col gap-8">
      {/* Header Info (Optional, can be used if not wrapped in [slug]/page.tsx) */}
      {/* 
      <div className="flex flex-col space-y-2 mb-4">
        <h1 className="text-3xl font-bold flex items-center">
          <Layers className="w-8 h-8 mr-3 text-primary" />
          Pro PDF Merger
        </h1>
        <p className="text-muted-foreground">
          Merge, rotate, reorder individual pages, and interleave PDFs directly in your browser.
        </p>
      </div> 
      */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Upload & Arrange */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-[2.5rem] border border-border p-6 shadow-sm relative overflow-hidden">
            {isProcessing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">Extracting Pages...</h3>
                <p className="text-sm text-muted-foreground mb-4">Processing {files.length} files. This happens locally in your browser.</p>
                <Progress value={progress} className="w-64 h-2" />
              </div>
            )}
            
            <h2 className="text-lg font-bold mb-4">1. Upload PDFs</h2>
            <PdfUploader onUpload={addFiles} />
            
            {pages.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-bold">
                      2. Arrange Pages ({pages.length})
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Drag to reorder, click to rotate, or remove unwanted pages.
                    </p>
                  </div>
                </div>
                
                <PageGrid 
                  pages={pages} 
                  setPages={reorderPages} 
                  onRemove={removePage} 
                  onRotate={rotatePage}
                  onPreview={setPreviewPage}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Settings & Export */}
        <div className="space-y-6">
          <div className="bg-card rounded-[2.5rem] border border-border p-6 shadow-sm sticky top-8">
            <h2 className="text-lg font-bold mb-6">3. Merge & Export</h2>
            
            <MergeSettings 
              files={files}
              mergeMode={mergeMode}
              setMergeMode={setMergeMode as any}
              applySequential={applySequential}
              applyInterleave={applyInterleave}
              filename={filename}
              setFilename={setFilename}
              isMerging={isMerging}
              progress={progress}
              onMerge={mergePdfs}
              onClear={clearAll}
              hasPages={pages.length > 0}
            />
          </div>
        </div>
        
      </div>

      <PreviewZoomModal 
        page={previewPage} 
        onClose={() => setPreviewPage(null)} 
      />
    </div>
  );
}
