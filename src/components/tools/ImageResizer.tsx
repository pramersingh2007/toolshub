"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrop, faDownload, faTrash, faUpload, faFileZipper, faMagic, faRulerCombined, faPercent, faImage, faCompress, faPalette, faArrowsAlt, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import JSZip from "jszip";
import { cn } from "@/lib/utils";

type ImageItem = {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl: string | null;
  originalSize: number;
  processedSize: number | null;
  status: "pending" | "processing" | "done" | "error";
};

export function ImageResizer() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dimMode, setDimMode] = useState<"pixels" | "percentage">("pixels");
  const [width, setWidth] = useState<number>(1080);
  const [height, setHeight] = useState<number>(1080);
  const [scale, setScale] = useState<number>(100);
  const [fitMode, setFitMode] = useState<"stretch" | "contain" | "cover" | "pad">("contain");
  const [padColor, setPadColor] = useState<string>("#ffffff");
  const [limitSize, setLimitSize] = useState<boolean>(false);
  const [targetKb, setTargetKb] = useState<number>(500);
  const [format, setFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState<number>(80);
  
  const [cropImage, setCropImage] = useState<ImageItem | null>(null);
  const cropperRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 20 - images.length);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      originalSize: file.size,
      processedSize: null,
      status: "pending" as const
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const processImage = async (imgObj: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve({ ...imgObj, status: "error" });

        let targetW = width;
        let targetH = height;
        if (dimMode === "percentage") {
          targetW = Math.max(1, Math.round(img.width * (scale / 100)));
          targetH = Math.max(1, Math.round(img.height * (scale / 100)));
        }

        canvas.width = targetW;
        canvas.height = targetH;

        if (fitMode === "pad") {
          ctx.fillStyle = padColor;
          ctx.fillRect(0, 0, targetW, targetH);
          const imgRatio = img.width / img.height;
          const targetRatio = targetW / targetH;
          let drawW, drawH, drawX, drawY;
          if (imgRatio > targetRatio) {
             drawW = targetW; drawH = targetW / imgRatio;
             drawX = 0; drawY = (targetH - drawH) / 2;
          } else {
             drawH = targetH; drawW = targetH * imgRatio;
             drawY = 0; drawX = (targetW - drawW) / 2;
          }
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        } else if (fitMode === "contain") {
          ctx.clearRect(0, 0, targetW, targetH);
          const imgRatio = img.width / img.height;
          const targetRatio = targetW / targetH;
          let drawW, drawH, drawX, drawY;
          if (imgRatio > targetRatio) {
             drawW = targetW; drawH = targetW / imgRatio;
             drawX = 0; drawY = (targetH - drawH) / 2;
          } else {
             drawH = targetH; drawW = targetH * imgRatio;
             drawY = 0; drawX = (targetW - drawW) / 2;
          }
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        } else if (fitMode === "cover") {
          const imgRatio = img.width / img.height;
          const targetRatio = targetW / targetH;
          let sx, sy, sWidth, sHeight;
          if (imgRatio > targetRatio) {
             sHeight = img.height; sWidth = sHeight * targetRatio;
             sy = 0; sx = (img.width - sWidth) / 2;
          } else {
             sWidth = img.width; sHeight = sWidth / targetRatio;
             sx = 0; sy = (img.height - sHeight) / 2;
          }
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
        } else {
          ctx.drawImage(img, 0, 0, targetW, targetH);
        }

        let currentQ = quality / 100;
        let resDataUrl = canvas.toDataURL(format, currentQ);
        
        if (limitSize && targetKb > 0 && (format === "image/jpeg" || format === "image/webp")) {
           let currentKb = Math.round((resDataUrl.length * 3) / 4) / 1024;
           let low = 0.01, high = currentQ;
           let attempts = 0;
           while (currentKb > targetKb && attempts < 8) {
              high = currentQ;
              currentQ = (low + high) / 2;
              resDataUrl = canvas.toDataURL(format, currentQ);
              currentKb = Math.round((resDataUrl.length * 3) / 4) / 1024;
              attempts++;
           }
           
           if (currentKb < targetKb && format === "image/jpeg") {
              const base64Data = resDataUrl.split(',')[1];
              const binary = atob(base64Data);
              const diffBytes = Math.floor((targetKb - currentKb) * 1024);
              if (diffBytes > 4) {
                 let remainingBytes = diffBytes;
                 let markers = [];
                 while (remainingBytes > 4) {
                   let padSize = Math.min(65535, remainingBytes) - 2;
                   let marker = [0xFF, 0xFE, (padSize + 2) >> 8, (padSize + 2) & 0xFF];
                   for (let i = 0; i < padSize; i++) marker.push(0);
                   markers.push(new Uint8Array(marker));
                   remainingBytes -= (padSize + 4);
                 }
                 const originalBytes = new Uint8Array(binary.length);
                 for (let i=0; i<binary.length; i++) originalBytes[i] = binary.charCodeAt(i);
                 let totalLength = originalBytes.length;
                 for (let m of markers) totalLength += m.length;
                 const padded = new Uint8Array(totalLength);
                 padded.set(originalBytes.subarray(0, 2), 0);
                 let offset = 2;
                 for (let m of markers) { padded.set(m, offset); offset += m.length; }
                 padded.set(originalBytes.subarray(2), offset);
                 let b64 = "";
                 const chunkSize = 8192;
                 for (let i = 0; i < padded.length; i += chunkSize) {
                     b64 += String.fromCharCode.apply(null, Array.from(padded.subarray(i, i + chunkSize)));
                 }
                 resDataUrl = 'data:image/jpeg;base64,' + btoa(b64);
              }
           }
        }

        const finalSize = Math.round((resDataUrl.length * 3) / 4);
        resolve({ ...imgObj, processedUrl: resDataUrl, processedSize: finalSize, status: "done" });
      };
      img.onerror = () => resolve({ ...imgObj, status: "error" });
      img.src = imgObj.originalUrl;
    });
  };

  const applyToAll = async () => {
    setImages(prev => prev.map(img => ({ ...img, status: "processing" })));
    const processed = await Promise.all(images.map(img => processImage(img)));
    setImages(processed);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    images.forEach((img, idx) => {
      if (img.processedUrl && img.status === "done") {
        const data = img.processedUrl.split(',')[1];
        const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
        zip.file(`resized_${idx + 1}.${ext}`, data, { base64: true });
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "resized_images.zip";
    link.click();
  };

  const handleCropSave = () => {
    if (cropperRef.current && cropImage) {
      const cropper = cropperRef.current.cropper;
      const croppedUrl = cropper.getCroppedCanvas().toDataURL();
      setImages(prev => prev.map(img => img.id === cropImage.id ? { ...img, originalUrl: croppedUrl, status: "pending" } : img));
      setCropImage(null);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[800px]">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-96 space-y-6 flex-shrink-0">
        <div className="p-6 rounded-3xl bg-card border shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <FontAwesomeIcon icon={faRulerCombined} className="text-primary text-xl" />
            <h3 className="font-black text-xl">Dimensions</h3>
          </div>
          
          <Tabs value={dimMode} onValueChange={(v: any) => setDimMode(v)}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pixels"><FontAwesomeIcon icon={faRulerCombined} className="mr-2"/>Pixels</TabsTrigger>
              <TabsTrigger value="percentage"><FontAwesomeIcon icon={faPercent} className="mr-2"/>Percentage</TabsTrigger>
            </TabsList>
            <TabsContent value="pixels" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Width (px)</Label>
                  <Input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Height (px)</Label>
                  <Input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Presets (ID, Web, Social)</Label>
                <Select onValueChange={(v) => {
                  const [w, h] = v.split('x').map(Number);
                  setWidth(w); setHeight(h);
                }}>
                  <SelectTrigger><SelectValue placeholder="Select preset" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="413x531">Indian Passport (35x45mm): 413x531</SelectItem>
                    <SelectItem value="250x354">PAN Card Photo: 250x354</SelectItem>
                    <SelectItem value="140x60">PAN Card Signature: 140x60</SelectItem>
                    <SelectItem value="400x150">Standard Signature: 400x150</SelectItem>
                    <SelectItem value="600x600">ID Card Photo (Square): 600x600</SelectItem>
                    <SelectItem value="1080x1080">Instagram Post (Square): 1080x1080</SelectItem>
                    <SelectItem value="1080x1350">Instagram Portrait: 1080x1350</SelectItem>
                    <SelectItem value="1080x1920">Instagram/TikTok Story: 1080x1920</SelectItem>
                    <SelectItem value="1200x628">Twitter/LinkedIn Post: 1200x628</SelectItem>
                    <SelectItem value="1920x1080">FHD 1080p (YouTube): 1920x1080</SelectItem>
                    <SelectItem value="1280x720">HD 720p: 1280x720</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="percentage" className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Scale</Label>
                  <span className="font-bold text-primary">{scale}%</span>
                </div>
                <Slider value={[scale]} min={1} max={200} step={1} onValueChange={v => setScale(v[0])} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon icon={faArrowsAlt} className="text-primary" />
              <Label className="font-bold">Fit Mode</Label>
            </div>
            <Select value={fitMode} onValueChange={(v: any) => setFitMode(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="stretch">Stretch</SelectItem>
                <SelectItem value="contain">Contain (Maintain AR)</SelectItem>
                <SelectItem value="cover">Cover (Crop)</SelectItem>
                <SelectItem value="pad">Pad (Add Background)</SelectItem>
              </SelectContent>
            </Select>
            {fitMode === "pad" && (
              <div className="flex items-center gap-4">
                <Label>Pad Color</Label>
                <input type="color" value={padColor} onChange={e => setPadColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <FontAwesomeIcon icon={faCompress} className="text-primary" />
                 <Label className="font-bold">Limit File Size</Label>
               </div>
               <Switch checked={limitSize} onCheckedChange={setLimitSize} />
             </div>
             {limitSize && (
               <div className="space-y-2">
                 <Label>Target Size (KB)</Label>
                 <Input type="number" value={targetKb} onChange={e => setTargetKb(Number(e.target.value))} />
               </div>
             )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon icon={faImage} className="text-primary" />
              <Label className="font-bold">Output Format</Label>
            </div>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="image/jpeg">JPG</SelectItem>
                <SelectItem value="image/png">PNG</SelectItem>
                <SelectItem value="image/webp">WebP</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between">
                <Label>Quality</Label>
                <span className="font-bold text-primary">{quality}%</span>
              </div>
              <Slider value={[quality]} min={1} max={100} step={1} onValueChange={v => setQuality(v[0])} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Workspace */}
      <div className="flex-1 flex flex-col gap-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-primary/20 rounded-[3rem] bg-card/40 p-12 text-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all flex flex-col items-center justify-center min-h-[250px] group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            multiple 
            className="hidden" 
          />
          <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
            <FontAwesomeIcon icon={faUpload} className="text-3xl" />
          </div>
          <h3 className="text-2xl font-black mb-2 italic">Drag & Drop Images</h3>
          <p className="text-muted-foreground font-medium">Up to 20 images. Supported: JPG, PNG, WEBP.</p>
        </div>

        {images.length > 0 && (
          <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border">
            <Button onClick={applyToAll} className="flex-1 font-bold rounded-xl" size="lg">
              <FontAwesomeIcon icon={faMagic} className="mr-2" /> Apply Resize to All
            </Button>
            <Button onClick={downloadZip} variant="secondary" className="flex-1 font-bold rounded-xl" size="lg" disabled={!images.some(i => i.status === 'done')}>
              <FontAwesomeIcon icon={faFileZipper} className="mr-2" /> Download All as ZIP
            </Button>
            <Button onClick={() => setImages([])} variant="destructive" size="icon" className="rounded-xl h-11 w-11">
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        )}

        <div className="space-y-4 overflow-y-auto pr-2 max-h-[600px] custom-scrollbar">
          {images.map(img => (
            <div key={img.id} className="p-4 rounded-2xl bg-card border shadow-sm flex items-center gap-6 group hover:border-primary/30 transition-colors">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                <img src={img.processedUrl || img.originalUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md", 
                    img.status === 'done' ? 'bg-green-500/10 text-green-500' :
                    img.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-secondary text-muted-foreground'
                  )}>
                    {img.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs uppercase font-bold">Original</div>
                    <div className="font-black">{formatSize(img.originalSize)}</div>
                  </div>
                  {img.processedSize && (
                    <div>
                      <div className="text-primary text-xs uppercase font-bold">New Size</div>
                      <div className="font-black text-primary">{formatSize(img.processedSize)}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {img.status === 'done' && img.processedUrl && (
                  <Button 
                    variant="default" 
                    size="icon" 
                    className="rounded-xl h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = img.processedUrl!;
                      link.download = `resized_${img.file.name}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    title="Download Image"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                )}
                <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 glass" onClick={() => setCropImage(img)} title="Crop Image">
                  <FontAwesomeIcon icon={faCrop} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-destructive hover:bg-destructive/10" onClick={() => removeImage(img.id)} title="Remove Image">
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cropper Modal */}
      <Dialog open={!!cropImage} onOpenChange={(o) => !o && setCropImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[500px] bg-black/5 rounded-xl overflow-hidden">
            {cropImage && (
              <Cropper
                src={cropImage.originalUrl}
                style={{ height: "100%", width: "100%" }}
                initialAspectRatio={16 / 9}
                guides={true}
                ref={cropperRef}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropImage(null)}>Cancel</Button>
            <Button onClick={handleCropSave}>Apply Crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
