import { Navbar } from "@/components/Navbar";
import { SearchBox } from "@/components/SearchBox";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { Categories } from "@/components/Categories";
import { PopularTools } from "@/components/PopularTools";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  UserPlus,
  Hammer,
  ArrowRight,
  Star
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Fast Processing",
    description: "Lightning-fast execution in your browser. No queues, no waiting.",
    icon: Zap,
    color: "text-amber-500 bg-amber-500/10"
  },
  {
    title: "Privacy-Focused",
    description: "Auto-delete files and military-grade encryption. Your data never stays on our servers.",
    icon: ShieldCheck,
    color: "text-emerald-500 bg-emerald-500/10"
  },
  {
    title: "No Signup Required",
    description: "Start using tools instantly without creating an account or providing an email.",
    icon: UserPlus,
    color: "text-indigo-500 bg-indigo-500/10"
  },
  {
    title: "Mobile-Friendly",
    description: "Fully responsive design ensures our tools work perfectly on any device or screen size.",
    icon: Smartphone,
    color: "text-pink-500 bg-pink-500/10"
  },
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Digital Marketer",
    content: "This site has saved me countless hours. The image compression and PDF tools are incredibly fast and easy to use.",
    avatar: "SJ"
  },
  {
    name: "David Chen",
    role: "Software Developer",
    content: "The developer utilities are my go-to. Having JSON formatting and Base64 encoding in one place without signing up is amazing.",
    avatar: "DC"
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    content: "I use the word counter and case converter every day for my assignments. It's so clean and never has annoying popups.",
    avatar: "ER"
  }
];

export const metadata = {
  title: "All-in-One Free Online Tools | ToolForge",
  description: "Fast, Secure & 100% Free Tools for Everyday Use. Explore PDF tools, image tools, calculators, text tools, and developer utilities.",
};

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Fixed Header */}
      <Navbar />

      {/* Expanded Scrollable Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl -z-10 h-full pointer-events-none">
               <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
               <div className="absolute bottom-[20%] left-[-5%] w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
                All-in-One <br className="md:hidden" />
                <span className="text-primary">Free Online Tools</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                Fast, Secure & 100% Free Tools for Everyday Use.
              </p>
              
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <SearchBox />
              </div>

              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <Button size="lg" className="rounded-xl px-10 h-14 text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95 group">
                  Explore Tools
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </section>

          {/* Banner Ad Below Hero */}
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <AdPlaceholder variant="banner" className="h-32" />
          </div>

          {/* Main Content & Sidebar Layout */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-12 pb-24">
            
            <div className="flex-1 space-y-24 w-full">
              {/* Categories Section */}
              <section id="categories">
                <Categories />
              </section>

              {/* In-content Ad */}
              <AdPlaceholder variant="content" className="h-40" />

              {/* Popular Tools */}
              <section id="popular">
                <PopularTools />
              </section>

              {/* In-content Ad */}
              <AdPlaceholder variant="content" className="h-40" />

              {/* Why Choose Us */}
              <section id="features" className="scroll-mt-24">
                <div className="text-center md:text-left mb-12">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Why Choose Us</h2>
                  <p className="text-muted-foreground text-lg">Designed for speed, built for privacy.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {features.map((feat, idx) => (
                    <div key={idx} className="p-8 rounded-3xl bg-card border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6", feat.color)}>
                        <feat.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              <section className="bg-secondary/30 rounded-[3rem] p-8 md:p-12 border">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
                    <Star className="h-4 w-4 fill-primary" />
                    Trusted by 1M+ users
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Loved by People Like You</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, idx) => (
                    <div key={idx} className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic mb-6 flex-1 text-sm leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar Ad */}
            <aside className="w-full lg:w-[320px] shrink-0">
              <div className="sticky top-8">
                <AdPlaceholder variant="sidebar" className="h-[600px] w-full" />
              </div>
            </aside>
          </div>

          <footer className="bg-card pt-20 pb-10 border-t">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="lg:col-span-1">
                  <Link href="/" className="flex items-center gap-3 mb-6 group">
                    <div className="bg-primary p-2 rounded-xl text-primary-foreground">
                      <Hammer className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight">ToolForge</span>
                  </Link>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Your reliable platform for fast, secure, and 100% free online tools. No installation required.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-foreground mb-6">Tools</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><Link href="/categories/pdf-tools" className="hover:text-primary transition-colors">PDF Tools</Link></li>
                    <li><Link href="/categories/image-tools" className="hover:text-primary transition-colors">Image Tools</Link></li>
                    <li><Link href="/categories/text-tools" className="hover:text-primary transition-colors">Text Tools</Link></li>
                    <li><Link href="/categories/calculators" className="hover:text-primary transition-colors">Calculators</Link></li>
                    <li><Link href="/categories/developer-tools" className="hover:text-primary transition-colors">Developer Tools</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-6">Company</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-6">Legal</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-8 border-t text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} ToolForge. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
