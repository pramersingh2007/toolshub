"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Check, Type } from "lucide-react";

export function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    let result = text;
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title':
        result = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        break;
    }
    setText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => convert('upper')} className="rounded-2xl h-14 px-8 font-black text-sm uppercase">UPPERCASE</Button>
        <Button onClick={() => convert('lower')} variant="secondary" className="rounded-2xl h-14 px-8 font-black text-sm lowercase">lowercase</Button>
        <Button onClick={() => convert('title')} variant="outline" className="rounded-2xl h-14 px-8 font-black text-sm border-2">Title Case</Button>
        <Button onClick={() => convert('sentence')} variant="outline" className="rounded-2xl h-14 px-8 font-black text-sm border-2">Sentence case</Button>
      </div>

      <div className="relative">
        <Textarea 
          placeholder="Paste your text to transform..."
          className="min-h-[400px] p-8 text-lg rounded-[2.5rem] bg-card/30 backdrop-blur-sm border-2 focus-visible:ring-primary/20 resize-none font-medium leading-relaxed"
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
