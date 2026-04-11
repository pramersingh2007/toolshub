"use client";

import * as React from "react";
import { Search, ArrowRight, Wrench, LayoutGrid, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ALL_TOOLS = [
  {
    name: "Image Compressor",
    type: "tool",
    description: "Lossless compression for images.",
    link: "/tools/image-compressor",
    keywords: ["resize", "small", "optimize", "photo"]
  },
  {
    name: "PDF to Word",
    type: "tool",
    description: "Convert PDFs to editable documents.",
    link: "/tools/pdf-to-word-converter",
    keywords: ["doc", "docx", "office"]
  },
  {
    name: "Word Counter",
    type: "tool",
    description: "Precise text analytics and count.",
    link: "/tools/word-counter",
    keywords: ["text", "essay", "blog"]
  },
  {
    name: "Remove Background",
    type: "tool",
    description: "AI-powered image background removal.",
    link: "/tools/remove-background",
    keywords: ["bg", "transparent", "cutout"]
  },
  {
    name: "QR Code Generator",
    type: "tool",
    description: "Custom codes for links and text.",
    link: "/tools/qr-code-generator",
    keywords: ["link", "url", "scan"]
  },
  {
    name: "PDF Tools",
    type: "category",
    description: "Merge, split, and edit PDF files.",
    link: "/categories/pdf-tools",
    keywords: ["combine", "page"]
  },
  {
    name: "Dev Utilities",
    type: "category",
    description: "JSON, Base64 and Regex tools.",
    link: "/categories/developer-tools",
    keywords: ["code", "format", "debug"]
  }
];

export function SearchBox() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<typeof ALL_TOOLS>([]);
  const [focused, setFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = ALL_TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(searchLower) ||
      tool.keywords.some(k => k.includes(searchLower))
    ).slice(0, 5);

    setResults(filtered);
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto z-[110]">
      <div className={cn(
        "relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        focused ? "scale-[1.03] modern-shadow" : "scale-100"
      )}>
        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
          <Search className={cn(
            "h-7 w-7 transition-colors duration-300",
            focused ? "text-primary" : "text-muted-foreground/30"
          )} />
        </div>
        <Input
          type="text"
          placeholder="I need to... (e.g., 'compress photo', 'split PDF')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="pl-20 pr-20 h-24 text-2xl font-black rounded-[3rem] border-none glass focus-visible:ring-primary/40 transition-all placeholder:text-muted-foreground/30"
        />
        <div className="absolute inset-y-0 right-8 flex items-center gap-4">
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          )}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary text-sm font-black border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span>Instant</span>
          </div>
        </div>
      </div>

      {focused && query.trim() && (
        <div className="absolute top-[110%] left-0 right-0 glass rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 border p-4 modern-shadow">
          {results.length > 0 ? (
            <div className="space-y-2">
              <div className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b mb-2">
                Search Results
              </div>
              {results.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  onClick={() => setFocused(false)}
                  className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-primary/5 transition-all group"
                >
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-black/5">
                    {item.type === 'tool' ? <Wrench className="h-6 w-6" /> : <LayoutGrid className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-foreground text-xl group-hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-base text-muted-foreground font-medium">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-xs font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    Use Tool <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="inline-flex p-5 rounded-full bg-muted/30 mb-6">
                 <Search className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="text-xl font-black text-foreground">No matches found.</p>
              <p className="text-muted-foreground font-medium mt-2">Try searching for keywords like 'PDF', 'Word', or 'Image'</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}