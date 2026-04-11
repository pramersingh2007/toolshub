"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Trash2, Download, ArrowUp, ArrowDown, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export function PdfMerger() {
  const { toast } = useToast();
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let newFiles: File[] = [];

    if ("dataTransfer" in e) {
      e.preventDefault();
      newFiles = Array.from(e.dataTransfer.files);
    } else if (e.target instanceof HTMLInputElement && e.target.files) {
      newFiles = Array.from(e.target.files);
    }

    const validPdfs = newFiles.filter(f => f.type === "application/pdf");

    if (validPdfs.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are supported.",
        variant: "destructive"
      });
    }

    if (validPdfs.length > 0) {
      const addedFiles = validPdfs.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: file.size,
      }));
      setFiles(prev => [...prev, ...addedFiles]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please select at least 2 PDF files to merge.",
        variant: "destructive"
      });
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfObj of files) {
        const arrayBuffer = await pdfObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success!",
        description: "PDF files merged successfully.",
      });
    } catch (error) {
      console.error("Merge error:", error);
      toast({
        title: "Merge failed",
        description: "There was an error while merging the PDFs.",
        variant: "destructive"
      });
    } finally {
      setIsMerging(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        
        {/* Editor Area */}
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden border-2 border-dashed bg-muted/30 relative min-h-[300px] flex items-center justify-center group">
            <div 
              className="flex flex-col items-center gap-4 p-12 text-center cursor-pointer w-full h-full"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-black">Upload PDF Files</h3>
                <p className="text-muted-foreground font-medium">Drag and drop or click to browse</p>
              </div>
              <div className="flex gap-2 text-xs font-bold text-muted-foreground bg-background px-4 py-2 rounded-full border">
                <span>PDF format only</span>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="application/pdf" 
                multiple
                onChange={handleFileUpload} 
              />
            </div>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Files to Merge ({files.length})
                </h3>
                <Button variant="ghost" className="text-destructive text-sm font-bold" onClick={() => setFiles([])}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 rounded-2xl bg-card border shadow-sm group">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate text-sm">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{formatSize(file.size)}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg" 
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg" 
                        onClick={() => moveDown(index)}
                        disabled={index === files.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-border mx-2" />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10" 
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <aside className="flex flex-col gap-6">
          <Card className="rounded-[2.5rem] border-2">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-black text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Merge Options
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Arrange your files in the correct order before merging.
                </p>
              </div>

              <div className="h-px bg-border" />

              <Button 
                className="w-full h-16 rounded-2xl font-black text-lg gap-3 shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground border-b-4 border-primary/50" 
                disabled={files.length < 2 || isMerging}
                onClick={mergePdfs}
              >
                {isMerging ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Merging PDFs...
                  </>
                ) : (
                  <>
                    <Download className="h-6 w-6" />
                    Merge & Download
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Instructions Summary */}
          {files.length === 0 && (
            <div className="p-6 rounded-[2.5rem] bg-secondary/30 border border-dashed text-sm">
              <h4 className="font-black mb-4 uppercase tracking-wider text-xs">Quick Guide</h4>
              <ul className="space-y-3 font-medium text-muted-foreground">
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                  <span>Upload two or more PDF files.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                  <span>Use the arrows to reorder them.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                  <span>Click Merge & Download to get the final PDF.</span>
                </li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
