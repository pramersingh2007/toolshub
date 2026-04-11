
import { Navbar } from "@/components/Navbar";
import { ShieldCheck, Lock, EyeOff, ServerOff, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const points = [
    {
      title: "Client-Side Processing",
      description: "Unlike other tools, ToolForge processes your files (Images, PDFs, Text) directly in your browser. Your data never leaves your computer.",
      icon: ServerOff,
    },
    {
      title: "No Data Storage",
      description: "We do not have databases that store your uploaded content. Once you close the tab, the data is gone forever.",
      icon: Lock,
    },
    {
      title: "No Tracking Cookies",
      description: "We don't use invasive tracking pixels or third-party cookies to build a profile on you. Your identity remains yours.",
      icon: EyeOff,
    },
    {
      title: "Open & Transparent",
      description: "Our mission is to provide utility without the 'data tax'. We prioritize user trust over data collection.",
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-12 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Command Center
          </Link>

          <div className="mb-16">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">Privacy is not a <br/><span className="text-primary">Feature.</span> It's a Right.</h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              At ToolForge, we believe you shouldn't have to trade your personal data for a simple file conversion or calculation.
            </p>
          </div>

          <div className="grid gap-8 mb-20">
            {points.map((point, idx) => (
              <div key={idx} className="p-8 rounded-[2.5rem] bg-card border hover:border-primary/30 transition-all modern-shadow group">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <point.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-3">{point.title}</h3>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-12 rounded-[3rem] bg-secondary/30 border">
            <h2 className="text-2xl font-black mb-6">Detailed Policy</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground font-medium space-y-4">
              <p>
                ToolForge was built with a privacy-first architecture. This means that for tools like the Image Compressor, Word Counter, and JSON Formatter, all computations are performed locally on your device using the power of modern web browsers.
              </p>
              <p>
                We only use minimal analytics to understand aggregate traffic patterns, which helps us decide which new tools to build next. This data is anonymized and cannot be traced back to an individual user.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
