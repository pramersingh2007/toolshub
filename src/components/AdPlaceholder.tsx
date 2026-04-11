
"use client";

import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  className?: string;
  variant?: "banner" | "sidebar" | "content";
}

export function AdPlaceholder({ className, variant = "banner" }: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg overflow-hidden",
        variant === "banner" && "w-full min-h-[120px] my-8",
        variant === "sidebar" && "w-full min-h-[600px] sticky top-24",
        variant === "content" && "w-full min-h-[250px] my-12",
        className
      )}
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Advertisement</span>
      <div className="text-muted-foreground/40 text-sm font-medium">Space for AdSense</div>
    </div>
  );
}
