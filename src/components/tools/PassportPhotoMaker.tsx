"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Upload, 
  RefreshCcw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Grid, 
  User, 
  Calendar as CalendarIcon,
  Trash2,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 450;
const ASPECT_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT;
const EXPORT_SCALE = 3;

interface Position {
  x: number;
  y: number;
}

export function PassportPhotoMaker() {
  const { toast } = useToast();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [isA4ModalOpen, setIsA4ModalOpen] = useState<boolean>(false);
  const [a4PhotoCount, setA4PhotoCount] = useState<number>(12);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  
  // A4 Preview States
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [a4Orientation, setA4Orientation] = useState<"portrait" | "landscape">("portrait");
  const [a4Margin, setA4Margin] = useState<number>(80);
  const [a4Gap, setA4Gap] = useState<number>(20);
  const [a4PhotoScale, setA4PhotoScale] = useState<number>(1);
  const [isA4Configured, setIsA4Configured] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const lastTouchPos = useRef<Position | null>(null);
  const lastPinchDist = useRef<number | null>(null);

  // Initialize and update canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (image) {
      ctx.save();
      
      // Draw image with current position and scale
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      
      // Center image initially or use position
      const x = position.x;
      const y = position.y;
      
      ctx.drawImage(image, x, y, drawWidth, drawHeight);
      ctx.restore();
    } else {
      // Draw placeholder
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);
      
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.font = "14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload photo to begin", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    // Draw Face Alignment Guide
    if (showGuide && !isDragging.current) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // Oval for face
      ctx.beginPath();
      ctx.ellipse(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.45, 80, 110, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Eye line
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2 - 40, CANVAS_HEIGHT * 0.4);
      ctx.lineTo(CANVAS_WIDTH / 2 + 40, CANVAS_HEIGHT * 0.4);
      ctx.stroke();

      // Chin line
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2 - 20, CANVAS_HEIGHT * 0.7);
      ctx.lineTo(CANVAS_WIDTH / 2 + 20, CANVAS_HEIGHT * 0.7);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

    // Draw Identity Overlay
    if (showOverlay) {
      const barHeight = 80;
      ctx.fillStyle = "black";
      ctx.fillRect(0, CANVAS_HEIGHT - barHeight, CANVAS_WIDTH, barHeight);
      
      ctx.fillStyle = "white";
      ctx.font = "bold 16px Inter, sans-serif";
      ctx.textAlign = "center";
      
      const formattedDate = date.split("-").reverse().join("-");
      
      ctx.fillText(name.toUpperCase() || "YOUR NAME", CANVAS_WIDTH / 2, CANVAS_HEIGHT - barHeight + 35);
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText(`DOB/Date: ${formattedDate}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - barHeight + 60);
    }

    // Draw border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [image, position, scale, name, date, showOverlay, showGuide]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      drawCanvas();
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [drawCanvas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | null = null;
    
    if ("dataTransfer" in e) {
      // It's a DragEvent
      e.preventDefault();
      file = e.dataTransfer.files?.[0] || null;
    } else if (e.target instanceof HTMLInputElement) {
      // It's a ChangeEvent
      file = e.target.files?.[0] || null;
    }

    if (file) {
      if (!file.type.match("image/png") && !file.type.match("image/jpeg")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG or JPG image.",
          variant: "destructive"
        });
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          // Initial fit
          const initialScale = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
          setScale(initialScale);
          setPosition({
            x: (CANVAS_WIDTH - img.width * initialScale) / 2,
            y: (CANVAS_HEIGHT - img.height * initialScale) / 2
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetTransform = () => {
    if (!image) return;
    const initialScale = Math.max(CANVAS_WIDTH / image.width, CANVAS_HEIGHT / image.height);
    setScale(initialScale);
    setPosition({
      x: (CANVAS_WIDTH - image.width * initialScale) / 2,
      y: (CANVAS_HEIGHT - image.height * initialScale) / 2
    });
  };

  const clampPosition = (pos: Position, currentScale: number) => {
    if (!image) return pos;
    const imgWidth = image.width * currentScale;
    const imgHeight = image.height * currentScale;
    
    // Bounds check: don't let image leave canvas empty
    let newX = pos.x;
    let newY = pos.y;

    if (imgWidth >= CANVAS_WIDTH) {
      newX = Math.min(0, Math.max(CANVAS_WIDTH - imgWidth, pos.x));
    } else {
      newX = (CANVAS_WIDTH - imgWidth) / 2;
    }

    if (imgHeight >= CANVAS_HEIGHT) {
      newY = Math.min(0, Math.max(CANVAS_HEIGHT - imgHeight, pos.y));
    } else {
      newY = (CANVAS_HEIGHT - imgHeight) / 2;
    }

    return { x: newX, y: newY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !image) return;
    
    const newPos = {
      x: position.x + e.movementX,
      y: position.y + e.movementY
    };
    setPosition(clampPosition(newPos, scale));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!image) return;
    e.preventDefault();
    const zoomSpeed = 0.001;
    const delta = -e.deltaY;
    const newScale = Math.max(
      Math.max(CANVAS_WIDTH / image.width, CANVAS_HEIGHT / image.height),
      Math.min(5, scale + delta * zoomSpeed)
    );
    
    // Adjust position to zoom into center
    const scaleFactor = newScale / scale;
    const newPos = {
      x: CANVAS_WIDTH / 2 - (CANVAS_WIDTH / 2 - position.x) * scaleFactor,
      y: CANVAS_HEIGHT / 2 - (CANVAS_HEIGHT / 2 - position.y) * scaleFactor
    };
    
    setScale(newScale);
    setPosition(clampPosition(newPos, newScale));
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastPinchDist.current = dist;
    }
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!image || !isDragging.current) return;
    
    if (e.touches.length === 1 && lastTouchPos.current) {
      const movementX = e.touches[0].clientX - lastTouchPos.current.x;
      const movementY = e.touches[0].clientY - lastTouchPos.current.y;
      
      const newPos = {
        x: position.x + movementX,
        y: position.y + movementY
      };
      setPosition(clampPosition(newPos, scale));
      lastTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastPinchDist.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = dist / lastPinchDist.current;
      const newScale = Math.max(
        Math.max(CANVAS_WIDTH / image.width, CANVAS_HEIGHT / image.height),
        Math.min(5, scale * scaleFactor)
      );
      
      const actualFactor = newScale / scale;
      const newPos = {
        x: CANVAS_WIDTH / 2 - (CANVAS_WIDTH / 2 - position.x) * actualFactor,
        y: CANVAS_HEIGHT / 2 - (CANVAS_HEIGHT / 2 - position.y) * actualFactor
      };
      
      setScale(newScale);
      setPosition(clampPosition(newPos, newScale));
      lastPinchDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    lastTouchPos.current = null;
    lastPinchDist.current = null;
  };

  const downloadImage = (dataUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSingle = () => {
    if (!image) return;
    
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = CANVAS_WIDTH * EXPORT_SCALE;
    exportCanvas.height = CANVAS_HEIGHT * EXPORT_SCALE;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Scale context
    ctx.save();
    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

    // Draw image
    ctx.drawImage(image, position.x, position.y, image.width * scale, image.height * scale);

    // Draw Overlay
    if (showOverlay) {
      const barHeight = 80;
      ctx.fillStyle = "black";
      ctx.fillRect(0, CANVAS_HEIGHT - barHeight, CANVAS_WIDTH, barHeight);
      
      ctx.fillStyle = "white";
      ctx.font = "bold 16px Inter, sans-serif";
      ctx.textAlign = "center";
      
      const formattedDate = date.split("-").reverse().join("-");
      ctx.fillText(name.toUpperCase() || "YOUR NAME", CANVAS_WIDTH / 2, CANVAS_HEIGHT - barHeight + 35);
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText(`DOB/Date: ${formattedDate}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - barHeight + 60);
    }
    
    ctx.restore();

    downloadImage(exportCanvas.toDataURL("image/png", 1.0), `passport-photo-${Date.now()}.png`);
    toast({ title: "Success", description: "HD Passport photo exported!" });
  };

  const getA4Canvas = useCallback(() => {
    if (!image) return null;

    const A4_W = a4Orientation === "portrait" ? 2480 : 3508;
    const A4_H = a4Orientation === "portrait" ? 3508 : 2480;
    
    const a4Canvas = document.createElement("canvas");
    a4Canvas.width = A4_W;
    a4Canvas.height = A4_H;
    const ctx = a4Canvas.getContext("2d");
    if (!ctx) return null;

    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, A4_W, A4_H);

    // Single photo dimensions
    const photoWidth = Math.round(35 * 11.811 * a4PhotoScale);
    const photoHeight = Math.round(45 * 11.811 * a4PhotoScale);
    
    const cols = Math.floor((A4_W - 2 * a4Margin) / (photoWidth + a4Gap));
    
    // Create a temporary canvas for the single photo
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = CANVAS_WIDTH * EXPORT_SCALE;
    tempCanvas.height = CANVAS_HEIGHT * EXPORT_SCALE;
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.scale(EXPORT_SCALE, EXPORT_SCALE);
      tempCtx.drawImage(image, position.x, position.y, image.width * scale, image.height * scale);
      if (showOverlay) {
        const barHeight = 80;
        tempCtx.fillStyle = "black";
        tempCtx.fillRect(0, CANVAS_HEIGHT - barHeight, CANVAS_WIDTH, barHeight);
        tempCtx.fillStyle = "white";
        tempCtx.font = "bold 16px Inter, sans-serif";
        tempCtx.textAlign = "center";
        const formattedDate = date.split("-").reverse().join("-");
        tempCtx.fillText(name.toUpperCase() || "YOUR NAME", CANVAS_WIDTH / 2, CANVAS_HEIGHT - barHeight + 35);
        tempCtx.font = "14px Inter, sans-serif";
        tempCtx.fillText(`DOB/Date: ${formattedDate}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - barHeight + 60);
      }
    }

    // Grid layout
    for (let i = 0; i < a4PhotoCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = a4Margin + col * (photoWidth + a4Gap);
      const y = a4Margin + row * (photoHeight + a4Gap);
      
      if (y + photoHeight > A4_H - a4Margin) break;

      ctx.drawImage(tempCanvas, x, y, photoWidth, photoHeight);
      ctx.strokeStyle = "#eee";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, photoWidth, photoHeight);
    }

    return a4Canvas;
  }, [image, a4Orientation, a4Margin, a4Gap, a4PhotoScale, a4PhotoCount, position, scale, name, date, showOverlay]);

  const drawA4Preview = useCallback(() => {
    if (!isPreviewMode || !previewCanvasRef.current) return;
    const previewCanvas = previewCanvasRef.current;
    const ctx = previewCanvas.getContext("2d");
    if (!ctx) return;

    const sourceCanvas = getA4Canvas();
    if (!sourceCanvas) return;

    previewCanvas.width = sourceCanvas.width;
    previewCanvas.height = sourceCanvas.height;
    ctx.drawImage(sourceCanvas, 0, 0);
  }, [getA4Canvas, isPreviewMode]);

  useEffect(() => {
    if (isPreviewMode) {
      drawA4Preview();
    }
  }, [drawA4Preview, isPreviewMode]);

  const downloadA4Sheet = () => {
    const finalCanvas = getA4Canvas();
    if (!finalCanvas) return;
    downloadImage(finalCanvas.toDataURL("image/png", 1.0), `passport-a4-sheet-${Date.now()}.png`);
    toast({ title: "Success", description: "A4 Printable Sheet downloaded!" });
    setIsA4Configured(false); // Reset after download
  };

  const finalizeA4 = () => {
    setIsA4Configured(true);
    setIsA4ModalOpen(false);
    setIsPreviewMode(false);
    toast({ title: "A4 Sheet Ready", description: "You can now download the configured sheet from the sidebar." });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        
        {/* Editor Area */}
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden border-2 border-dashed bg-muted/30 relative min-h-[500px] flex items-center justify-center group">
            {!image ? (
              <div 
                className="flex flex-col items-center gap-4 p-12 text-center cursor-pointer w-full h-full"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileUpload}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Upload your photo</h3>
                  <p className="text-muted-foreground font-medium">Drag and drop or click to browse</p>
                </div>
                <div className="flex gap-2 text-xs font-bold text-muted-foreground bg-background px-4 py-2 rounded-full border">
                  <span>PNG</span>
                  <span className="opacity-30">•</span>
                  <span>JPG</span>
                  <span className="opacity-30">•</span>
                  <span>Max 10MB</span>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
              </div>
            ) : (
              <div className="relative flex flex-col items-center gap-6 py-8">
                {/* Canvas Container */}
                <div 
                  ref={containerRef}
                  className="relative shadow-2xl rounded-sm overflow-hidden bg-white cursor-move touch-none"
                  style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <canvas 
                    ref={canvasRef} 
                    width={CANVAS_WIDTH} 
                    height={CANVAS_HEIGHT}
                    className="block"
                  />
                </div>

                {/* Floating Controls */}
                <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-md border rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
                  <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(5, s + 0.1))} className="rounded-xl">
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                  <div className="w-32 px-2">
                    <Slider 
                      value={[scale]} 
                      min={0.1} 
                      max={5} 
                      step={0.01} 
                      onValueChange={([v]) => setScale(v)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="rounded-xl">
                    <ZoomOut className="h-5 w-5" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-1" />
                  <Button variant="ghost" size="icon" onClick={resetTransform} className="rounded-xl text-primary" title="Reset Layout">
                    <RefreshCcw className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowGuide(!showGuide)} 
                    className={cn("rounded-xl", showGuide && "text-primary bg-primary/10")}
                    title="Toggle Face Guide"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {image && (
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-4 right-4 rounded-full h-10 w-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setImage(null);
                  setFileName("");
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </Card>

          {/* Guidelines */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Check className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <h4 className="font-black mb-1 text-primary">High Quality Export</h4>
                <p className="text-muted-foreground">Photos are exported at 3x resolution for crisp, professional printing.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Grid className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <h4 className="font-black mb-1 text-blue-500">Auto Layout</h4>
                <p className="text-muted-foreground">Easily generate full A4 sheets with up to 35 photos correctly spaced.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="flex flex-col gap-6">
          <Card className="rounded-[2.5rem] border-2">
            <CardContent className="p-6 space-y-8">
              {/* Identity Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Identity Overlay
                  </h3>
                  <Switch 
                    checked={showOverlay}
                    onCheckedChange={setShowOverlay}
                  />
                </div>
                
                <div className={cn("space-y-4 transition-all duration-300", !showOverlay && "opacity-40 pointer-events-none grayscale")}>
                  <div className="space-y-2">
                    <Label htmlFor="user-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                    <div className="relative">
                      <Input 
                        id="user-name" 
                        placeholder="John Doe" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl pl-10"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo-date" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Photograph Date</Label>
                    <div className="relative">
                      <Input 
                        id="photo-date" 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="rounded-xl pl-10"
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Actions Section */}
              <div className="space-y-4">
                <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4">Export Options</h3>
                
                {isA4Configured ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                    <Button 
                      className="w-full h-16 rounded-2xl font-black text-lg gap-3 shadow-xl bg-green-600 hover:bg-green-700 text-white border-b-4 border-green-800" 
                      onClick={downloadA4Sheet}
                    >
                      <Download className="h-6 w-6" />
                      Download A4 Sheet
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full h-10 rounded-xl font-bold text-sm glass" 
                      onClick={() => setIsA4ModalOpen(true)}
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Adjust Layout Again
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20" 
                      disabled={!image}
                      onClick={exportSingle}
                    >
                      <Download className="h-6 w-6" />
                      Download Single PNG
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full h-14 rounded-2xl font-black text-lg gap-3 glass" 
                      disabled={!image}
                      onClick={() => setIsA4ModalOpen(true)}
                    >
                      <Grid className="h-6 w-6" />
                      Generate A4 Sheet
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions Summary */}
          {!image && (
            <div className="p-6 rounded-[2.5rem] bg-secondary/30 border border-dashed text-sm">
              <h4 className="font-black mb-4 uppercase tracking-wider text-xs">Quick Guide</h4>
              <ul className="space-y-3 font-medium text-muted-foreground">
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                  <span>Upload a clear portrait photo.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                  <span>Use face guide to align perfectly.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                  <span>Optional: Add name & date overlay.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">4</div>
                  <span>Export as single HD or A4 sheet.</span>
                </li>
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* A4 Sheet Modal */}
      <Dialog open={isA4ModalOpen} onOpenChange={(open) => {
        setIsA4ModalOpen(open);
        if (!open) setIsPreviewMode(false);
      }}>
        <DialogContent className={cn(
          "rounded-[2.5rem] transition-all duration-500",
          isPreviewMode ? "sm:max-w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden" : "sm:max-w-[425px]"
        )}>
          {!isPreviewMode ? (
            <>
              <DialogHeader className="p-6">
                <DialogTitle className="text-2xl font-black">Configure A4 Sheet</DialogTitle>
                <DialogDescription className="font-medium">
                  Choose how many photos you want on your printable A4 sheet.
                </DialogDescription>
              </DialogHeader>
              
              <div className="px-6 py-4 space-y-8">
                <div className="flex items-center justify-center gap-6">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-xl"
                    onClick={() => setA4PhotoCount(Math.max(1, a4PhotoCount - 1))}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <div className="text-center">
                    <div className="text-5xl font-black text-primary">{a4PhotoCount}</div>
                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">Photos</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-xl"
                    onClick={() => setA4PhotoCount(Math.min(30, a4PhotoCount + 1))}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
                
                <Slider 
                  value={[a4PhotoCount]} 
                  min={1} 
                  max={30} 
                  step={1} 
                  onValueChange={([v]) => setA4PhotoCount(v)}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  {[8, 12, 16, 24, 30].map((num) => (
                    <Button 
                      key={num} 
                      variant="secondary" 
                      className={cn("h-12 rounded-xl font-bold", a4PhotoCount === num && "ring-2 ring-primary bg-primary/10")}
                      onClick={() => setA4PhotoCount(num)}
                    >
                      {num} Pack
                    </Button>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="p-6">
                <Button className="w-full h-14 rounded-2xl font-black text-lg" onClick={() => setIsPreviewMode(true)}>
                  Preview A4 Sheet
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col h-full bg-secondary/20">
              <div className="p-4 bg-background border-b flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Print Preview</h2>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">A4 Sheet - {a4Orientation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="font-bold" onClick={() => setIsPreviewMode(false)}>Back</Button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Preview Area */}
                <div className="flex-1 p-8 overflow-auto flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                  <div className="shadow-[0_0_50px_rgba(0,0,0,0.1)] bg-white origin-center transform scale-[0.2] sm:scale-[0.25] md:scale-[0.3] lg:scale-[0.35] xl:scale-[0.4]">
                    <canvas ref={previewCanvasRef} className="block" />
                  </div>
                </div>
                
                {/* Control Sidebar */}
                <div className="w-full lg:w-80 bg-background border-l p-6 overflow-y-auto space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Page Orientation</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={a4Orientation === "portrait" ? "default" : "outline"} 
                        className="rounded-xl font-bold"
                        onClick={() => setA4Orientation("portrait")}
                      >
                        Portrait
                      </Button>
                      <Button 
                        variant={a4Orientation === "landscape" ? "default" : "outline"} 
                        className="rounded-xl font-bold"
                        onClick={() => setA4Orientation("landscape")}
                      >
                        Landscape
                      </Button>
                    </div>
                    <Button className="w-full h-12 font-black gap-2 rounded-xl bg-primary text-primary-foreground shadow-lg mt-2" onClick={finalizeA4}>
                      <Check className="h-4 w-4" />
                      Confirm & Finalize
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Photo Size</Label>
                      <span className="text-xs font-bold text-primary">{Math.round(a4PhotoScale * 100)}%</span>
                    </div>
                    <Slider 
                      value={[a4PhotoScale]} 
                      min={0.5} 
                      max={1.5} 
                      step={0.05} 
                      onValueChange={([v]) => setA4PhotoScale(v)}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 rounded-lg" onClick={() => setA4PhotoScale(s => Math.max(0.5, s - 0.05))}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-lg" onClick={() => setA4PhotoScale(s => Math.min(1.5, s + 0.05))}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Margins</Label>
                      <span className="text-xs font-bold text-primary">{a4Margin}px</span>
                    </div>
                    <Slider 
                      value={[a4Margin]} 
                      min={0} 
                      max={200} 
                      step={10} 
                      onValueChange={([v]) => setA4Margin(v)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Gap spacing</Label>
                      <span className="text-xs font-bold text-primary">{a4Gap}px</span>
                    </div>
                    <Slider 
                      value={[a4Gap]} 
                      min={0} 
                      max={100} 
                      step={5} 
                      onValueChange={([v]) => setA4Gap(v)}
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                      Changes here update the sheet in real-time. Use the sliders to adjust photo size, margins and spacing for your printer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
