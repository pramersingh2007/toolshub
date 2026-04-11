"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Check } from "lucide-react";

export function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = {
    words: text.trim() === "" ? 0 : text.trim().split(/\s+/).length,
    characters: text.length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    readingTime: Math.ceil((text.trim() === "" ? 0 : text.trim().split(/\s+/).length) / 200)
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.characters },
          { label: "Sentences", value: stats.sentences },
          { label: "Read Time", value: `${stats.readingTime}m` }
        ].map((stat, i) => (
          <Card key={i} className="rounded-3xl border shadow-sm bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Textarea 
          placeholder="Paste or type your text here..."
          className="min-h-[400px] p-8 text-lg rounded-[2.5rem] bg-card/30 backdrop-blur-sm border-2 focus-visible:ring-primary/20 resize-none font-medium leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute top-6 right-6 flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-2xl h-12 w-12 glass hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
            onClick={() => setText("")}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-2xl h-12 w-12 glass"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
