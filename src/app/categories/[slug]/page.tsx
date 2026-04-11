import { Navbar } from "@/components/Navbar";
import { CATEGORIES, ALL_TOOLS } from "@/lib/tools-registry";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORIES.find(c => c.id === slug);
  
  if (!category) {
    notFound();
  }

  const categoryTools = ALL_TOOLS.filter(t => t.category === category.id);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto pt-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-12 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Command Center
          </Link>

          <div className="mb-20">
            <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-black/10", category.color + "/10")}>
              <category.icon className={cn("h-10 w-10", category.color.replace('bg-', 'text-'))} />
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">{category.title}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryTools.map((tool) => (
              <Link key={tool.id} href={tool.link} className="group">
                <Card className="h-full rounded-[3rem] border-2 border-transparent hover:border-primary/20 hover:shadow-2xl transition-all duration-500 bg-card/40 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <tool.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-black mb-4">{tool.name}</h3>
                    <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-black group-hover:gap-4 transition-all">
                      Open Tool <ArrowRight className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
