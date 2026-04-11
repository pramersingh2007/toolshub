"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Download, Copy, Check, Sparkles } from "lucide-react";

export function QrGenerator() {
  const [text, setText] = useState("https://toolforge.io");
  const [copied, setCopied] = useState(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;

  const handleDownload = async () => {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "toolforge-qr.png";
    link.click();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-12 items-start">
      <div className="lg:col-span-3 space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-4">Target URL or Text</label>
          <Input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter URL or text here..."
            className="h-20 px-8 text-xl font-bold rounded-[2rem] border-2 focus-visible:ring-primary/20 glass"
          />
        </div>

        <div className="p-10 rounded-[3rem] bg-secondary/30 border space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
             </div>
             <h3 className="text-xl font-black italic">Instant Generation</h3>
          </div>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Your QR code updates instantly as you type. This tool uses a high-performance vector rendering engine for perfect scannability.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={handleDownload} className="h-16 flex-1 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
            <Download className="mr-2 h-5 w-5" /> Download PNG
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => {
              navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }} 
            className="h-16 flex-1 rounded-2xl font-black text-lg glass"
          >
            {copied ? <Check className="mr-2 h-5 w-5 text-emerald-500" /> : <Copy className="mr-2 h-5 w-5" />}
            Copy Content
          </Button>
        </div>
      </div>

      <div className="lg:col-span-2">
        <Card className="rounded-[3rem] border-2 border-primary/20 bg-card overflow-hidden shadow-2xl">
          <CardContent className="p-10">
            <div className="aspect-square rounded-3xl bg-white p-6 flex items-center justify-center border-4 border-black/5">
              <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
            </div>
            <div className="mt-8 text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Live Preview</div>
              <p className="text-sm font-medium line-clamp-1 text-muted-foreground/60">{text}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
