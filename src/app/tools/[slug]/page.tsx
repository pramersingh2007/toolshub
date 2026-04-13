import { Navbar } from "@/components/Navbar";
import { ALL_TOOLS } from "@/lib/tools-registry";
import { notFound } from "next/navigation";
import { ChevronLeft, Share2, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WordCounter } from "@/components/tools/WordCounter";
import { CaseConverter } from "@/components/tools/CaseConverter";
import { JsonFormatter } from "@/components/tools/JsonFormatter";
import { ImageCompressor } from "@/components/tools/ImageCompressor";
import { QrGenerator } from "@/components/tools/QrGenerator";
import { BioDataMaker } from "@/components/tools/BioDataMaker";
import { PassportPhotoMaker } from "@/components/tools/PassportPhotoMaker";
import { ImageResizer } from "@/components/tools/ImageResizer";
import { PdfMerger } from "@/components/tools/PdfMerger";
import PdfToJpg from "@/components/tools/PdfToJpgWrapper";
import { AdPlaceholder } from "@/components/AdPlaceholder";

const TOOL_COMPONENTS: Record<string, any> = {
  WordCounter,
  CaseConverter,
  JsonFormatter,
  ImageCompressor,
  QrGenerator,
  BioDataMaker,
  PassportPhotoMaker,
  ImageResizer,
  PdfMerger,
  PdfToJpg,
};

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = ALL_TOOLS.find(t => t.link === `/tools/${slug}`);
  
  if (!tool) {
    notFound();
  }

  const ToolComponent = TOOL_COMPONENTS[tool.componentName] || (() => (
    <div className="p-20 text-center glass rounded-[3rem] border-2 border-dashed">
      <h3 className="text-2xl font-black mb-4">Under Development</h3>
      <p className="text-muted-foreground font-medium">This tool is coming soon. Check back later!</p>
    </div>
  ));

  if (tool.componentName === 'BioDataMaker') {
    return (
      <div className="min-h-screen flex flex-col bg-background print:bg-white print:min-h-0 print:h-auto">
        <div className="print:hidden"><Navbar /></div>
        <main className="flex-1 pt-[104px] md:pt-[120px] flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible print:pt-0 print:block">
          <ToolComponent />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto pt-[104px] md:pt-[120px] pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Tool Area */}
            <div className="flex-1">
              <Link 
                href={`/categories/${tool.category}`} 
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-12 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Suite
              </Link>

              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/20">
                      <tool.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{tool.name}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">
                        Free Online Utility
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14 glass">
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                  {tool.description}
                </p>
              </div>

              <div className="relative">
                <ToolComponent />
              </div>

              {/* Instructions Section */}
              <div className="mt-24 p-12 rounded-[3rem] bg-secondary/30 border">
                <div className="flex items-center gap-3 mb-8">
                  <Info className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-black">How to use this tool</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-muted-foreground font-medium">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">1</div>
                    <p>Paste or upload your content into the workspace above.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">2</div>
                    <p>Use the action buttons and sliders to customize your output.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">3</div>
                    <p>Download your results or copy them to your clipboard instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar for Ads */}
            <aside className="w-full lg:w-80 space-y-8">
              <AdPlaceholder variant="sidebar" className="glass rounded-[3rem] border shadow-sm" />
              <div className="p-8 rounded-[2.5rem] bg-card border">
                <h4 className="font-black text-sm uppercase tracking-widest text-primary mb-6">Related Tools</h4>
                <div className="space-y-4">
                  {ALL_TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).map(t => (
                    <Link key={t.id} href={t.link} className="block group">
                      <div className="p-4 rounded-2xl hover:bg-muted transition-all border border-transparent hover:border-border">
                        <div className="font-black text-sm mb-1 group-hover:text-primary transition-colors">{t.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{t.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}
