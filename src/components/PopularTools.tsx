"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const popularTools = [
  {
    name: "Resume Builder",
    description: "Create professional ATS-friendly resumes with modern templates.",
    link: "/tools/resume-builder",
    trend: "Professional"
  },
  {
    name: "Image Compressor",
    description: "Reduce file size of JPG, PNG and SVG while keeping perfect quality.",
    link: "/tools/image-compressor",
    trend: "98% Save"
  },
  {
    name: "PDF to Word Converter",
    description: "Convert PDFs into editable Word documents with high accuracy.",
    link: "/tools/pdf-to-word-converter",
    trend: "Top Rated"
  },
  {
    name: "Word Counter",
    description: "Real-time character, word and sentence counting with analysis.",
    link: "/tools/word-counter",
    trend: "Free"
  },
  {
    name: "QR Code Generator",
    description: "Create custom scanable QR codes for your links and social media.",
    link: "/tools/qr-code-generator",
    trend: "Customizable"
  },
];

export function PopularTools() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-3">
            <Star className="h-3 w-3 fill-accent" />
            Trending
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Popular Tools</h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-lg">
            The most used utilities by our community.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {popularTools.map((tool, idx) => (
          <Card key={idx} className="group border bg-card hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-8 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{tool.name}</h3>
                <span className="text-[10px] font-extrabold bg-muted px-2 py-1 rounded-full text-muted-foreground tracking-wider uppercase">{tool.trend}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl font-bold border-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                <Link href={tool.link} className="flex items-center justify-center gap-2">
                  Use Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
