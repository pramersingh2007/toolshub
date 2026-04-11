"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Check, Braces, Minimize2, Maximize2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function JsonFormatter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number | null) => {
    try {
      const obj = JSON.parse(text);
      setText(spaces === null ? JSON.stringify(obj) : JSON.stringify(obj, null, spaces));
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: "Please check your JSON syntax and try again."
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => formatJson(2)} className="rounded-2xl h-14 px-8 font-black gap-2">
          <Braces className="h-5 w-5" /> Prettify
        </Button>
        <Button onClick={() => formatJson(null)} variant="secondary" className="rounded-2xl h-14 px-8 font-black gap-2">
          <Minimize2 className="h-5 w-5" /> Minify
        </Button>
      </div>

      <div className="relative">
        <Textarea 
          placeholder='{ "paste": "your json here" }'
          className="min-h-[500px] p-8 text-base font-mono rounded-[2.5rem] bg-card/30 backdrop-blur-sm border-2 focus-visible:ring-primary/20 resize-none leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute top-6 right-6 flex gap-3">
          <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 glass hover:bg-red-500/10 hover:text-red-500" onClick={() => setText("")}>
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 glass" onClick={handleCopy}>
            {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
