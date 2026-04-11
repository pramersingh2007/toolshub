"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download, ImageIcon, RefreshCw, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageCompressor() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        compress(event.target?.result as string, quality);
      };
      reader.readAsDataURL(file);
    }
  };

  const compress = (dataUrl: string, q: number) => {
    setIsCompressing(true);
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", q / 100);
      const sizeInBytes = Math.round((compressedDataUrl.length * 3) / 4);
      setCompressedSize(sizeInBytes);
      setIsCompressing(false);
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "toolforge-compressed.jpg";
    link.href = canvas.toDataURL("image/jpeg", quality / 100);
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savingPercent = originalSize > 0 
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100) 
    : 0;

  return (
    <div className="space-y-10">
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer p-20 border-4 border-dashed border-primary/20 rounded-[4rem] bg-card/40 backdrop-blur-sm flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-500"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
            <Upload className="h-10 w-10" />
          </div>
          <h3 className="text-3xl font-black mb-4 italic">Drop your image here</h3>
          <p className="text-muted-foreground font-medium text-lg max-w-sm">
            Supported formats: JPG, PNG, WEBP. <br/>All processing happens in your browser.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="relative rounded-[3rem] overflow-hidden border-2 bg-black/5 aspect-square flex items-center justify-center">
              <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
              <div className="absolute top-6 left-6 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest">
                Preview
              </div>
            </div>
            
            <div className="p-8 rounded-[3rem] bg-secondary/30 border space-y-8">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xl italic">Compression Quality</h4>
                <span className="text-primary font-black text-2xl">{quality}%</span>
              </div>
              <Slider 
                value={[quality]} 
                onValueChange={(val) => {
                  setQuality(val[0]);
                  compress(image, val[0]);
                }} 
                max={100} 
                min={1} 
                step={1} 
                className="py-4"
              />
              <div className="flex items-center justify-between text-sm font-bold text-muted-foreground">
                <span>Maximum Savings</span>
                <span>Maximum Quality</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <Card className="rounded-[2.5rem] border bg-card/50 shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">Original</div>
                  <div className="text-2xl font-black">{formatSize(originalSize)}</div>
                </CardContent>
              </Card>
              <Card className="rounded-[2.5rem] border bg-card/50 shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Compressed</div>
                  <div className="text-2xl font-black">{formatSize(compressedSize)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="p-10 rounded-[3rem] bg-primary/10 border-2 border-primary/20 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-45 transition-transform duration-700">
                <RefreshCw className="h-40 w-40" />
               </div>
               <div className="relative z-10">
                <div className="text-5xl font-black text-primary mb-2 italic">-{savingPercent}%</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Total Space Saved</div>
               </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                size="lg" 
                onClick={handleDownload}
                className="h-20 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 group"
              >
                <Download className="mr-3 h-6 w-6 group-hover:-translate-y-1 transition-transform" />
                Download Compressed Image
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setImage(null);
                  setOriginalSize(0);
                  setCompressedSize(0);
                }}
                className="h-16 rounded-[2rem] font-bold glass"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Another Image
              </Button>
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
