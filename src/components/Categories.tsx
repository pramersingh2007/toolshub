"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image as ImageIcon, Type, Calculator, Code, ChevronRight, UserCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "PDF Tools",
    description: "Merge, split, compress, and edit PDF files effortlessly.",
    icon: FileText,
    link: "/categories/pdf-tools",
    color: "bg-red-500 text-red-500",
    tools: ["Merge", "Split", "Compress"]
  },
  {
    title: "Image Tools",
    description: "Resize, compress, convert and optimize images easily.",
    icon: ImageIcon,
    link: "/categories/image-tools",
    color: "bg-blue-500 text-blue-500",
    tools: ["Resize", "Compress", "Convert"]
  },
  {
    title: "CV & Career",
    description: "Build ATS-friendly resumes and tailored cover letters.",
    icon: UserCircle,
    link: "/categories/cv-maker",
    color: "bg-fuchsia-500 text-fuchsia-500",
    tools: ["Resume", "Cover Letter", "Optimization"]
  },
  {
    title: "Text Tools",
    description: "Word counter, case converter, and text manipulation utilities.",
    icon: Type,
    link: "/categories/text-tools",
    color: "bg-amber-500 text-amber-500",
    tools: ["Word Counter", "Case Converter"]
  },
  {
    title: "Calculators",
    description: "Age, EMI, percentage, and other daily calculators.",
    icon: Calculator,
    link: "/categories/calculators",
    color: "bg-emerald-500 text-emerald-500",
    tools: ["Age", "EMI", "Percentage"]
  },
  {
    title: "Developer Tools",
    description: "JSON formatter, Base64 encoder/decoder, Regex tester.",
    icon: Code,
    link: "/categories/developer-tools",
    color: "bg-indigo-500 text-indigo-500",
    tools: ["JSON Formatter", "Base64", "Regex"]
  },
];

export function Categories() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">
            Find exactly what you need from our organized collection of utilities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <Link key={idx} href={cat.link} className="group outline-none">
            <Card className="h-full border border-border/50 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden bg-card">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", cat.color.replace('text-', 'bg-').split(' ')[1] + '/10')}>
                    <cat.icon className={cn("h-6 w-6", cat.color.split(' ')[1])} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{cat.title}</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 h-10">
                  {cat.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {cat.tools.map((tool, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 rounded-full bg-secondary text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-sm font-bold text-primary group-hover:gap-2 transition-all">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
