"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Copy, 
  Check, 
  Braces, 
  Minimize2, 
  Maximize2,
  FileJson,
  Download,
  Upload,
  AlertCircle,
  Type
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Mode = "format" | "text-to-json";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<number | null>(2);
  const [mode, setMode] = useState<Mode>("format");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processInput = (val: string, currentMode: Mode, spaces: number | null) => {
    if (!val.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    
    if (currentMode === "text-to-json") {
      // In text-to-json mode, we treat the raw input as a string and stringify it
      // This escapes quotes, newlines, etc.
      // We don't need pretty printing for a single string, but we pass spaces just in case
      try {
        setOutput(spaces === null ? JSON.stringify(val) : JSON.stringify(val, null, spaces));
        setError(null);
      } catch (e: any) {
        setError("Failed to convert text to JSON string.");
      }
    } else {
      // Standard JSON parsing mode
      try {
        const obj = JSON.parse(val);
        setOutput(spaces === null ? JSON.stringify(obj) : JSON.stringify(obj, null, spaces));
        setError(null);
      } catch (e: any) {
        setError(e.message || "Invalid JSON format");
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    processInput(value, mode, indent);
  };

  const handleFormatChange = (spaces: number | null) => {
    setIndent(spaces);
    processInput(input, mode, spaces);
    if (input.trim() && error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error
      });
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    processInput(input, newMode, indent);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard."
    });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      processInput(content, mode, indent);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Premium Mode Toggle & Toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl backdrop-blur-xl shadow-sm">
        
        {/* Mode Selector */}
        <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
          <div className="flex bg-white dark:bg-zinc-950 p-1 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <Button
              variant={mode === "format" ? "default" : "ghost"}
              onClick={() => handleModeChange("format")}
              className={cn("rounded-lg h-9 px-4 font-bold text-xs gap-2 transition-all", mode !== "format" && "hover:bg-zinc-100 dark:hover:bg-zinc-900")}
            >
              <Braces className="h-3.5 w-3.5" /> JSON Formatter
            </Button>
            <Button
              variant={mode === "text-to-json" ? "default" : "ghost"}
              onClick={() => handleModeChange("text-to-json")}
              className={cn("rounded-lg h-9 px-4 font-bold text-xs gap-2 transition-all", mode !== "text-to-json" && "hover:bg-zinc-100 dark:hover:bg-zinc-900")}
            >
              <Type className="h-3.5 w-3.5" /> Text to JSON
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept=".json,application/json,.txt" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl h-9 px-4 text-xs font-bold border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-primary/5 hover:text-primary"
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload File
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleClear}
              className="rounded-xl h-9 w-9 p-0 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
              title="Clear all"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button 
            onClick={() => handleFormatChange(2)} 
            className="rounded-xl h-10 px-5 font-bold gap-2 shadow-sm"
            variant={indent === 2 ? "default" : "secondary"}
          >
            <Braces className="h-4 w-4" /> 2 Spaces
          </Button>
          <Button 
            onClick={() => handleFormatChange(4)} 
            variant={indent === 4 ? "default" : "secondary"}
            className="rounded-xl h-10 px-5 font-bold gap-2 shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <Maximize2 className="h-4 w-4" /> 4 Spaces
          </Button>
          <Button 
            onClick={() => handleFormatChange(null)} 
            variant={indent === null ? "default" : "secondary"}
            className="rounded-xl h-10 px-5 font-bold gap-2 shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <Minimize2 className="h-4 w-4" /> Minify
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && mode === "format" && (
        <div className="flex items-center gap-3 p-4 text-sm font-semibold text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Editor Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              {mode === "format" ? <FileJson className="h-4 w-4" /> : <Type className="h-4 w-4" />}
              {mode === "format" ? "Input JSON" : "Input Raw Text"}
            </span>
          </div>
          <Textarea 
            placeholder={mode === "format" ? 'Paste your raw JSON string here...' : 'Paste any text here to escape and convert to JSON...'}
            className={cn(
              "min-h-[500px] lg:min-h-[600px] p-6 text-sm font-mono rounded-[1.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/30 resize-none leading-relaxed shadow-sm transition-all placeholder:text-zinc-400/50",
              error && mode === "format" && "border-red-500/50 focus-visible:ring-red-500/20"
            )}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col gap-3 relative">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Braces className="h-4 w-4" /> Output
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                className="h-8 px-3 text-xs font-bold rounded-lg hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleDownload}
                disabled={!output}
                className="h-8 px-3 text-xs font-bold rounded-lg hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
            </div>
          </div>
          <Textarea 
            readOnly
            placeholder='Formatted JSON will appear here...'
            className="min-h-[500px] lg:min-h-[600px] p-6 text-sm font-mono rounded-[1.5rem] bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 focus-visible:ring-0 resize-none leading-relaxed shadow-inner placeholder:text-zinc-400/30"
            value={output}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
