"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Download, Printer, Palette, Type, LayoutTemplate, RefreshCcw, 
  Settings, Plus, Trash2, Image as ImageIcon, User, Briefcase, 
  GraduationCap, Code, Languages, Heart, GripVertical, FileText,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// --- GLOBAL PRINT STYLES ---
const PrintStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @media print {
      html, body {
        background: white !important;
        height: auto !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #resume-preview {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  `}} />
);

// --- TYPES ---
export type Profile = { name: string; role: string; summary: string; photoUrl: string; };
export type Contact = { phone: string; email: string; location: string; website: string; linkedin: string; github: string; };
export type Matrimonial = { show: boolean; dob: string; gender: string; maritalStatus: string; nationality: string; height: string; weight: string; };
export type Skill = { id: string; name: string; level: number; };
export type Experience = { id: string; title: string; company: string; startDate: string; endDate: string; present: boolean; description: string; };
export type Education = { id: string; degree: string; school: string; startYear: string; endYear: string; ongoing: boolean; description: string; };
export type Project = { id: string; name: string; link: string; tech: string; description: string; };
export type Language = { id: string; name: string; fluency: string; };
export type Hobby = { id: string; name: string; };
export type Theme = { accentColor: string; fontFamily: string; layout: string; previewDarkMode: boolean; };

export type ResumeData = {
  profile: Profile;
  contact: Contact;
  matrimonial: Matrimonial;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  languages: Language[];
  hobbies: Hobby[];
  theme: Theme;
};

// --- INITIAL DATA ---
const INITIAL_DATA: ResumeData = {
  profile: { name: "", role: "", summary: "", photoUrl: "" },
  contact: { phone: "", email: "", location: "", website: "", linkedin: "", github: "" },
  matrimonial: { show: false, dob: "", gender: "", maritalStatus: "", nationality: "", height: "", weight: "" },
  skills: [], experience: [], education: [], projects: [], languages: [], hobbies: [],
  theme: { accentColor: "#3b82f6", fontFamily: "font-sans", layout: "modern", previewDarkMode: false }
};

const SAMPLE_DATA: ResumeData = {
  profile: { name: "Alex Jenkins", role: "Senior Software Engineer", summary: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Strong focus on modern JavaScript frameworks, cloud architecture, and user-centric design.", photoUrl: "" },
  contact: { phone: "+1 (555) 123-4567", email: "alex.jenkins@example.com", location: "San Francisco, CA", website: "alexjenkins.dev", linkedin: "linkedin.com/in/alexjenkins", github: "github.com/alexj" },
  matrimonial: { show: true, dob: "1995-08-14", gender: "Male", maritalStatus: "Single", nationality: "American", height: "5'11\"", weight: "165 lbs" },
  skills: [
    { id: "1", name: "React / Next.js", level: 90 }, { id: "2", name: "TypeScript", level: 85 }, 
    { id: "3", name: "Node.js", level: 80 }, { id: "4", name: "AWS / Cloud", level: 70 }
  ],
  experience: [
    { id: "1", title: "Senior Developer", company: "TechNova Inc.", startDate: "2021", endDate: "", present: true, description: "Lead a team of 4 developers to rebuild the core SaaS platform. Improved performance by 40% and reduced cloud costs." },
    { id: "2", title: "Web Developer", company: "Creative Solutions", startDate: "2018", endDate: "2021", present: false, description: "Developed responsive client websites using React and headless CMS." }
  ],
  education: [
    { id: "1", degree: "B.S. Computer Science", school: "University of California", startYear: "2014", endYear: "2018", ongoing: false, description: "Graduated with Honors. President of the Coding Club." }
  ],
  projects: [
    { id: "1", name: "E-commerce Dash", link: "ecommerce-dash.app", tech: "Next.js, Tailwind, Stripe", description: "Open-source dashboard for managing online store inventory and sales." }
  ],
  languages: [
    { id: "1", name: "English", fluency: "Native" }, { id: "2", name: "Spanish", fluency: "Conversational" }
  ],
  hobbies: [
    { id: "1", name: "Photography" }, { id: "2", name: "Hiking" }, { id: "3", name: "Open Source" }
  ],
  theme: { accentColor: "#0ea5e9", fontFamily: "font-sans", layout: "modern", previewDarkMode: false }
};

export function BioDataMaker() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("biodatamaker_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("biodatamaker_data", JSON.stringify(data));
    }
  }, [data, mounted]);

  const updateProfile = (field: keyof Profile, value: string) => setData(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  const updateContact = (field: keyof Contact, value: string) => setData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  const updateMatrimonial = (field: keyof Matrimonial, value: any) => setData(prev => ({ ...prev, matrimonial: { ...prev.matrimonial, [field]: value } }));
  const updateTheme = (field: keyof Theme, value: any) => setData(prev => ({ ...prev, theme: { ...prev.theme, [field]: value } }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { updateProfile("photoUrl", reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => { window.print(); };
  
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsDownloading(true);
    try {
      const element = resumeRef.current;
      const isDark = data.theme.previewDarkMode;
      
      // Use higher scale for crisp, professional text rendering
      const canvas = await html2canvas(element, {
        scale: 4, 
        useCORS: true,
        logging: false,
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
      });
      
      // Use JPEG with quality 1.0 for better performance and smaller file size vs PNG
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const imgCanvasHeight = (imgHeight * pdfWidth) / imgWidth;
      
      let imgHeightLeft = imgCanvasHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgCanvasHeight, undefined, 'FAST');
      imgHeightLeft -= pdfHeight;

      // Add subsequent pages if content overflows A4
      while (imgHeightLeft > 0) {
        position = imgHeightLeft - imgCanvasHeight;
        pdf.addPage();
        
        if (isDark) {
          pdf.setFillColor(15, 23, 42);
          pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        }
        
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgCanvasHeight, undefined, 'FAST');
        imgHeightLeft -= pdfHeight;
      }

      pdf.save(`${data.profile.name ? data.profile.name.replace(/\s+/g, '_') : "Professional"}_BioData.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const loadSample = () => { setData(SAMPLE_DATA); };
  const resetData = () => { if(window.confirm("Are you sure you want to clear all data?")) setData(INITIAL_DATA); };

  if (!mounted) return null;

  return (
    <div className="flex h-full w-full bg-muted/20 print:bg-white overflow-hidden print:overflow-visible print:h-auto print:block">
      <PrintStyles />
      {/* LEFT PANEL - CONTROLS */}
      <div className="w-[450px] flex-shrink-0 bg-card border-r flex flex-col z-10 print:hidden shadow-xl">
        <div className="p-4 border-b flex items-center justify-between bg-card">
          <h2 className="font-black text-xl flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Builder</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadSample} className="h-8 px-2 text-xs"><RefreshCcw className="h-3 w-3 mr-1" /> Sample</Button>
            <Button variant="destructive" size="sm" onClick={resetData} className="h-8 px-2 text-xs"><Trash2 className="h-3 w-3" /></Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-4">
            <TabsContent value="content" className="m-0 space-y-4 pb-20">
              <Accordion type="single" collapsible className="w-full space-y-2">
                
                {/* IDENTITY */}
                <AccordionItem value="identity" className="bg-card border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline font-bold"><div className="flex items-center gap-2"><User className="h-4 w-4" /> Identity</div></AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={data.profile.name} onChange={e => updateProfile("name", e.target.value)} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Headline / Role</Label>
                      <Input value={data.profile.role} onChange={e => updateProfile("role", e.target.value)} placeholder="Software Engineer" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><Label>Professional Summary</Label><span className="text-xs text-muted-foreground">{data.profile.summary.length}/300</span></div>
                      <Textarea value={data.profile.summary} onChange={e => updateProfile("summary", e.target.value)} placeholder="A brief summary about yourself..." rows={4} maxLength={300} />
                    </div>
                    <div className="space-y-2">
                      <Label>Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        {data.profile.photoUrl ? (
                          <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                            <img src={data.profile.photoUrl} alt="Profile" className="object-cover w-full h-full" />
                            <button onClick={() => updateProfile("photoUrl", "")} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-full border-2 border-dashed flex items-center justify-center bg-muted/50">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="flex-1" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* CONTACT */}
                <AccordionItem value="contact" className="bg-card border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline font-bold"><div className="flex items-center gap-2"><Settings className="h-4 w-4" /> Contact Info</div></AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2 sm:col-span-1"><Label>Email</Label><Input value={data.contact.email} onChange={e => updateContact("email", e.target.value)} /></div>
                    <div className="space-y-2 col-span-2 sm:col-span-1"><Label>Phone</Label><Input value={data.contact.phone} onChange={e => updateContact("phone", e.target.value)} /></div>
                    <div className="space-y-2 col-span-2"><Label>Location</Label><Input value={data.contact.location} onChange={e => updateContact("location", e.target.value)} /></div>
                    <div className="space-y-2 col-span-2"><Label>Website URL</Label><Input value={data.contact.website} onChange={e => updateContact("website", e.target.value)} /></div>
                    <div className="space-y-2 col-span-2 sm:col-span-1"><Label>LinkedIn</Label><Input value={data.contact.linkedin} onChange={e => updateContact("linkedin", e.target.value)} /></div>
                    <div className="space-y-2 col-span-2 sm:col-span-1"><Label>GitHub</Label><Input value={data.contact.github} onChange={e => updateContact("github", e.target.value)} /></div>
                  </AccordionContent>
                </AccordionItem>

                {/* DYNAMIC LISTS COMPONENTS */}
                <DynamicListSection title="Experience" icon={<Briefcase className="h-4 w-4" />} items={data.experience} setItems={(items) => setData(p => ({...p, experience: items}))} emptyItem={{title:'', company:'', startDate:'', endDate:'', present:false, description:''}} renderItem={(item, update) => (
                  <>
                    <Input placeholder="Job Title" value={item.title} onChange={e => update("title", e.target.value)} className="mb-2 font-bold" />
                    <Input placeholder="Company" value={item.company} onChange={e => update("company", e.target.value)} className="mb-2" />
                    <div className="flex gap-2 mb-2">
                      <Input placeholder="Start Date" value={item.startDate} onChange={e => update("startDate", e.target.value)} />
                      <Input placeholder="End Date" value={item.endDate} onChange={e => update("endDate", e.target.value)} disabled={item.present} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Switch checked={item.present} onCheckedChange={c => { update("present", c); if(c) update("endDate", ""); }} /> <Label className="text-xs">Present / Current</Label>
                    </div>
                    <Textarea placeholder="Description..." value={item.description} onChange={e => update("description", e.target.value)} rows={3} />
                  </>
                )} />

                <DynamicListSection title="Education" icon={<GraduationCap className="h-4 w-4" />} items={data.education} setItems={(items) => setData(p => ({...p, education: items}))} emptyItem={{degree:'', school:'', startYear:'', endYear:'', ongoing:false, description:''}} renderItem={(item, update) => (
                  <>
                    <Input placeholder="Degree / Course" value={item.degree} onChange={e => update("degree", e.target.value)} className="mb-2 font-bold" />
                    <Input placeholder="School / University" value={item.school} onChange={e => update("school", e.target.value)} className="mb-2" />
                    <div className="flex gap-2 mb-2">
                      <Input placeholder="Start Year" value={item.startYear} onChange={e => update("startYear", e.target.value)} />
                      <Input placeholder="End Year" value={item.endYear} onChange={e => update("endYear", e.target.value)} disabled={item.ongoing} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Switch checked={item.ongoing} onCheckedChange={c => { update("ongoing", c); if(c) update("endYear", ""); }} /> <Label className="text-xs">Ongoing</Label>
                    </div>
                    <Textarea placeholder="Additional Details..." value={item.description} onChange={e => update("description", e.target.value)} rows={2} />
                  </>
                )} />

                <DynamicListSection title="Skills" icon={<Settings className="h-4 w-4" />} items={data.skills} setItems={(items) => setData(p => ({...p, skills: items}))} emptyItem={{name:'', level:50}} renderItem={(item, update) => (
                  <div className="flex flex-col gap-2">
                    <Input placeholder="Skill Name" value={item.name} onChange={e => update("name", e.target.value)} className="font-bold" />
                    <div className="flex items-center gap-4 px-2">
                      <span className="text-xs font-bold w-8">{item.level}%</span>
                      <Slider value={[item.level]} onValueChange={v => update("level", v[0])} max={100} step={5} className="flex-1" />
                    </div>
                  </div>
                )} />

                <DynamicListSection title="Projects" icon={<Code className="h-4 w-4" />} items={data.projects} setItems={(items) => setData(p => ({...p, projects: items}))} emptyItem={{name:'', link:'', tech:'', description:''}} renderItem={(item, update) => (
                  <>
                    <Input placeholder="Project Name" value={item.name} onChange={e => update("name", e.target.value)} className="mb-2 font-bold" />
                    <Input placeholder="Live Link / Repo URL" value={item.link} onChange={e => update("link", e.target.value)} className="mb-2 text-xs" />
                    <Input placeholder="Technologies Used (e.g., React, Node)" value={item.tech} onChange={e => update("tech", e.target.value)} className="mb-2 text-xs text-primary" />
                    <Textarea placeholder="Project Description..." value={item.description} onChange={e => update("description", e.target.value)} rows={2} />
                  </>
                )} />

                <DynamicListSection title="Languages" icon={<Languages className="h-4 w-4" />} items={data.languages} setItems={(items) => setData(p => ({...p, languages: items}))} emptyItem={{name:'', fluency:'Beginner'}} renderItem={(item, update) => (
                  <div className="flex gap-2">
                    <Input placeholder="Language" value={item.name} onChange={e => update("name", e.target.value)} className="flex-1 font-bold" />
                    <Input placeholder="Fluency (e.g. Native)" value={item.fluency} onChange={e => update("fluency", e.target.value)} className="w-1/2" />
                  </div>
                )} />

                {/* PERSONAL / MATRIMONIAL */}
                <AccordionItem value="matrimonial" className="bg-card border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline font-bold">
                    <div className="flex items-center gap-2"><Heart className="h-4 w-4" /> Personal / Bio Data</div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
                      <Label className="font-bold">Include Personal Details</Label>
                      <Switch checked={data.matrimonial.show} onCheckedChange={c => updateMatrimonial("show", c)} />
                    </div>
                    {data.matrimonial.show && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={data.matrimonial.dob} onChange={e => updateMatrimonial("dob", e.target.value)} /></div>
                        <div className="space-y-2"><Label>Gender</Label><Input value={data.matrimonial.gender} onChange={e => updateMatrimonial("gender", e.target.value)} /></div>
                        <div className="space-y-2"><Label>Marital Status</Label><Input value={data.matrimonial.maritalStatus} onChange={e => updateMatrimonial("maritalStatus", e.target.value)} /></div>
                        <div className="space-y-2"><Label>Nationality</Label><Input value={data.matrimonial.nationality} onChange={e => updateMatrimonial("nationality", e.target.value)} /></div>
                        <div className="space-y-2"><Label>Height</Label><Input value={data.matrimonial.height} placeholder="e.g. 5'11&quot;" onChange={e => updateMatrimonial("height", e.target.value)} /></div>
                        <div className="space-y-2"><Label>Weight</Label><Input value={data.matrimonial.weight} placeholder="e.g. 70kg" onChange={e => updateMatrimonial("weight", e.target.value)} /></div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </TabsContent>

            <TabsContent value="design" className="m-0 space-y-6 pb-20">
              <div className="space-y-3 bg-card border p-4 rounded-xl">
                <Label className="flex items-center gap-2 font-bold"><Palette className="h-4 w-4" /> Accent Color</Label>
                <div className="flex items-center gap-3">
                  <Input type="color" value={data.theme.accentColor} onChange={e => updateTheme("accentColor", e.target.value)} className="w-14 h-14 p-1 cursor-pointer rounded-xl" />
                  <div className="flex-1 text-sm font-mono text-muted-foreground">{data.theme.accentColor}</div>
                </div>
              </div>

              <div className="space-y-3 bg-card border p-4 rounded-xl">
                <Label className="flex items-center gap-2 font-bold"><Type className="h-4 w-4" /> Typography</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['font-sans', 'font-serif', 'font-mono'].map(font => (
                    <Button key={font} variant={data.theme.fontFamily === font ? "default" : "outline"} onClick={() => updateTheme("fontFamily", font)} className={cn("h-10", font)}>
                      {font.replace('font-', '')}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 bg-card border p-4 rounded-xl">
                <Label className="flex items-center gap-2 font-bold"><LayoutTemplate className="h-4 w-4" /> Layout Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={data.theme.layout === 'modern' ? "default" : "outline"} onClick={() => updateTheme("layout", "modern")} className="justify-start text-xs">Modern</Button>
                  <Button variant={data.theme.layout === 'classic' ? "default" : "outline"} onClick={() => updateTheme("layout", "classic")} className="justify-start text-xs">Classic</Button>
                  <Button variant={data.theme.layout === 'minimal' ? "default" : "outline"} onClick={() => updateTheme("layout", "minimal")} className="justify-start text-xs">Minimalist</Button>
                  <Button variant={data.theme.layout === 'professional' ? "default" : "outline"} onClick={() => updateTheme("layout", "professional")} className="justify-start text-xs">Professional</Button>
                  <Button variant={data.theme.layout === 'creative' ? "default" : "outline"} onClick={() => updateTheme("layout", "creative")} className="justify-start text-xs">Creative</Button>
                  <Button variant={data.theme.layout === 'elegant' ? "default" : "outline"} onClick={() => updateTheme("layout", "elegant")} className="justify-start text-xs">Elegant</Button>
                  <Button variant={data.theme.layout === 'executive' ? "default" : "outline"} onClick={() => updateTheme("layout", "executive")} className="justify-start text-xs">Executive</Button>
                  <Button variant={data.theme.layout === 'compact' ? "default" : "outline"} onClick={() => updateTheme("layout", "compact")} className="justify-start text-xs">Compact</Button>
                  <Button variant={data.theme.layout === 'tech' ? "default" : "outline"} onClick={() => updateTheme("layout", "tech")} className="justify-start text-xs">Developer</Button>
                  <Button variant={data.theme.layout === 'timeline' ? "default" : "outline"} onClick={() => updateTheme("layout", "timeline")} className="justify-start text-xs">Timeline</Button>
                </div>
              </div>

              <div className="space-y-3 bg-card border p-4 rounded-xl flex items-center justify-between">
                <Label className="flex items-center gap-2 font-bold">Dark Mode Preview</Label>
                <Switch checked={data.theme.previewDarkMode} onCheckedChange={c => updateTheme("previewDarkMode", c)} />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* RIGHT PANEL - PREVIEW */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-start items-start lg:justify-center bg-muted/30 relative print:p-0 print:bg-transparent print:overflow-visible print:block print:h-auto">
        
        {/* Action Buttons */}
        <div className="fixed md:absolute top-6 right-8 flex gap-3 z-50 print:hidden">
          <Button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="rounded-full shadow-lg h-12 px-6 font-bold" 
            style={{ backgroundColor: data.theme.accentColor }}
          >
            {isDownloading ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Download className="h-5 w-5 mr-2" />
            )}
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" className="rounded-full shadow-lg h-12 px-6 font-bold bg-card">
            <Printer className="h-5 w-5 mr-2" /> Print
          </Button>
        </div>

        {/* A4 Container Wrapper to isolate shadow from html2canvas */}
        <div className={cn("shadow-2xl transition-all duration-300 print:shadow-none print:m-0 flex-shrink-0 mx-auto", isDownloading && "shadow-none")}>
          <div 
            ref={resumeRef}
            id="resume-preview"
            className={cn(
              "w-[210mm] min-h-[297mm] print:w-full print:min-h-full print:m-0 relative",
              data.theme.fontFamily,
              data.theme.previewDarkMode ? "bg-slate-950 text-slate-200" : "bg-white text-slate-800"
            )}
            style={{ '--accent': data.theme.accentColor } as React.CSSProperties}
          >
            <ResumeTemplate data={data} />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function DynamicListSection<T extends {id: string}>({ title, icon, items, setItems, emptyItem, renderItem }: { title: string, icon: React.ReactNode, items: T[], setItems: (items: T[]) => void, emptyItem: Omit<T, 'id'>, renderItem: (item: T, update: (field: keyof T, val: any) => void) => React.ReactNode }) {
  const addItem = () => setItems([...items, { ...emptyItem, id: Math.random().toString(36).substr(2, 9) } as T]);
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: string, field: keyof T, val: any) => setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i));

  return (
    <AccordionItem value={title.toLowerCase()} className="bg-card border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline font-bold">
        <div className="flex items-center gap-2">{icon} {title} <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{items.length}</span></div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-2">
        {items.map((item, idx) => (
          <div key={item.id} className="relative p-4 border rounded-xl bg-muted/10 group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button onClick={() => removeItem(item.id)} className="p-1.5 bg-destructive/10 text-destructive rounded-md hover:bg-destructive hover:text-white transition-colors"><Trash2 className="h-3 w-3" /></button>
            </div>
            <div className="pr-8">{renderItem(item, (f, v) => updateItem(item.id, f, v))}</div>
          </div>
        ))}
        <Button onClick={addItem} variant="outline" className="w-full border-dashed"><Plus className="h-4 w-4 mr-2" /> Add {title}</Button>
      </AccordionContent>
    </AccordionItem>
  );
}

// --- TEMPLATE COMPONENTS ---

function ResumeTemplate({ data }: { data: ResumeData }) {
  const isDark = data.theme.previewDarkMode;
  const accent = data.theme.accentColor;
  
  switch(data.theme.layout) {
    case 'minimal': return <MinimalLayout data={data} isDark={isDark} accent={accent} />;
    case 'classic': return <ClassicLayout data={data} isDark={isDark} accent={accent} />;
    case 'professional': return <ProfessionalLayout data={data} isDark={isDark} accent={accent} />;
    case 'creative': return <CreativeLayout data={data} isDark={isDark} accent={accent} />;
    case 'elegant': return <ElegantLayout data={data} isDark={isDark} accent={accent} />;
    case 'executive': return <ExecutiveLayout data={data} isDark={isDark} accent={accent} />;
    case 'compact': return <CompactLayout data={data} isDark={isDark} accent={accent} />;
    case 'tech': return <TechLayout data={data} isDark={isDark} accent={accent} />;
    case 'timeline': return <TimelineLayout data={data} isDark={isDark} accent={accent} />;
    case 'modern':
    default: return <ModernLayout data={data} isDark={isDark} accent={accent} />;
  }
}

// Layout 1: Modern Split
function ModernLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="flex h-full min-h-[297mm]">
      {/* Left Sidebar */}
      <div className="w-[35%] p-8 flex flex-col gap-8 print:break-inside-avoid" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
        
        {data.profile.photoUrl && (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 mx-auto mb-4" style={{ borderColor: accent }}>
            <img src={data.profile.photoUrl} className="w-full h-full object-cover" alt="Profile" />
          </div>
        )}
        
        {/* Contact Info */}
        <div className="space-y-4 text-sm break-all">
          <h3 className="font-bold uppercase tracking-widest text-xs border-b pb-2" style={{ borderColor: accent, color: accent }}>Contact</h3>
          {data.contact.phone && <div><div className="font-bold text-xs opacity-50">PHONE</div>{data.contact.phone}</div>}
          {data.contact.email && <div><div className="font-bold text-xs opacity-50">EMAIL</div>{data.contact.email}</div>}
          {data.contact.location && <div><div className="font-bold text-xs opacity-50">LOCATION</div>{data.contact.location}</div>}
          {data.contact.website && <div><div className="font-bold text-xs opacity-50">WEBSITE</div>{data.contact.website}</div>}
          {data.contact.linkedin && <div><div className="font-bold text-xs opacity-50">LINKEDIN</div>{data.contact.linkedin}</div>}
          {data.contact.github && <div><div className="font-bold text-xs opacity-50">GITHUB</div>{data.contact.github}</div>}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="space-y-4 print:break-inside-avoid">
            <h3 className="font-bold uppercase tracking-widest text-xs border-b pb-2" style={{ borderColor: accent, color: accent }}>Skills</h3>
            <div className="space-y-3">
              {data.skills.map(s => (
                <div key={s.id} className="text-sm">
                  <div className="flex justify-between mb-1"><span>{s.name}</span></div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.level}%`, backgroundColor: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="space-y-3 text-sm print:break-inside-avoid">
            <h3 className="font-bold uppercase tracking-widest text-xs border-b pb-2" style={{ borderColor: accent, color: accent }}>Languages</h3>
            {data.languages.map(l => (
              <div key={l.id} className="flex justify-between">
                <span className="font-bold">{l.name}</span>
                <span className="opacity-70">{l.fluency}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Right Main Content */}
      <div className="w-[65%] p-10 flex flex-col gap-8">
        
        {/* Header */}
        <div className="pb-6 border-b-2" style={{ borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
          <h1 className="text-5xl font-black mb-2 tracking-tight uppercase" style={{ color: accent }}>{data.profile.name || 'YOUR NAME'}</h1>
          <h2 className="text-xl font-medium tracking-widest uppercase opacity-80">{data.profile.role || 'PROFESSIONAL TITLE'}</h2>
          {data.profile.summary && <p className="mt-4 text-sm leading-relaxed opacity-90">{data.profile.summary}</p>}
        </div>

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="space-y-5 print:break-inside-avoid">
             <h3 className="font-bold uppercase tracking-widest text-lg flex items-center gap-3">
               <Briefcase size={20} style={{ color: accent }} /> Experience
             </h3>
             <div className="space-y-6 border-l-2 pl-4 ml-2" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
               {data.experience.map(e => (
                 <div key={e.id} className="relative">
                   <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                   <div className="flex justify-between items-baseline mb-1">
                     <h4 className="font-bold text-lg">{e.title}</h4>
                     <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: accent + '20', color: accent }}>
                       {e.startDate} - {e.present ? 'Present' : e.endDate}
                     </span>
                   </div>
                   <div className="text-sm font-medium mb-2 opacity-80">{e.company}</div>
                   <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">{e.description}</p>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="space-y-5 print:break-inside-avoid">
             <h3 className="font-bold uppercase tracking-widest text-lg flex items-center gap-3">
               <GraduationCap size={20} style={{ color: accent }} /> Education
             </h3>
             <div className="space-y-5 border-l-2 pl-4 ml-2" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
               {data.education.map(e => (
                 <div key={e.id} className="relative">
                   <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                   <div className="flex justify-between items-baseline mb-1">
                     <h4 className="font-bold">{e.degree}</h4>
                     <span className="text-xs opacity-70">{e.startYear} - {e.ongoing ? 'Ongoing' : e.endYear}</span>
                   </div>
                   <div className="text-sm opacity-80 mb-1">{e.school}</div>
                   {e.description && <p className="text-xs leading-relaxed opacity-70">{e.description}</p>}
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="space-y-4 print:break-inside-avoid">
             <h3 className="font-bold uppercase tracking-widest text-lg flex items-center gap-3">
               <Code size={20} style={{ color: accent }} /> Projects
             </h3>
             <div className="grid grid-cols-1 gap-4">
               {data.projects.map(p => (
                 <div key={p.id} className="p-4 rounded-xl border" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                   <div className="flex justify-between items-baseline mb-2">
                     <h4 className="font-bold">{p.name}</h4>
                     <span className="text-xs opacity-60">{p.link}</span>
                   </div>
                   <div className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: accent }}>{p.tech}</div>
                   <p className="text-sm leading-relaxed opacity-80">{p.description}</p>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Matrimonial Info */}
        {data.matrimonial.show && (
          <div className="space-y-4 mt-auto print:break-inside-avoid">
             <h3 className="font-bold uppercase tracking-widest text-lg flex items-center gap-3">
               <User size={20} style={{ color: accent }} /> Personal Details
             </h3>
             <div className="grid grid-cols-2 gap-y-3 text-sm p-4 rounded-xl" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
               {data.matrimonial.dob && <div><span className="font-bold opacity-60 block text-xs">Date of Birth</span>{data.matrimonial.dob}</div>}
               {data.matrimonial.gender && <div><span className="font-bold opacity-60 block text-xs">Gender</span>{data.matrimonial.gender}</div>}
               {data.matrimonial.maritalStatus && <div><span className="font-bold opacity-60 block text-xs">Marital Status</span>{data.matrimonial.maritalStatus}</div>}
               {data.matrimonial.nationality && <div><span className="font-bold opacity-60 block text-xs">Nationality</span>{data.matrimonial.nationality}</div>}
               {data.matrimonial.height && <div><span className="font-bold opacity-60 block text-xs">Height</span>{data.matrimonial.height}</div>}
               {data.matrimonial.weight && <div><span className="font-bold opacity-60 block text-xs">Weight</span>{data.matrimonial.weight}</div>}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}


// Layout 2: Classic Centered
function ClassicLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="p-12 flex flex-col gap-8 h-full min-h-[297mm]">
      
      {/* Header */}
      <div className="text-center border-b-4 pb-8" style={{ borderColor: accent }}>
        {data.profile.photoUrl && (
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2" style={{ borderColor: accent }}>
            <img src={data.profile.photoUrl} className="w-full h-full object-cover" alt="Profile" />
          </div>
        )}
        <h1 className="text-4xl font-serif font-black mb-2 uppercase tracking-wider">{data.profile.name || 'YOUR NAME'}</h1>
        <h2 className="text-lg uppercase tracking-widest font-medium" style={{ color: accent }}>{data.profile.role || 'Professional Title'}</h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs font-bold opacity-80">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>• {data.contact.phone}</span>}
          {data.contact.location && <span>• {data.contact.location}</span>}
          {data.contact.linkedin && <span>• {data.contact.linkedin}</span>}
        </div>
      </div>

      {data.profile.summary && (
        <div className="text-center max-w-4xl mx-auto italic text-sm leading-relaxed opacity-90">
          "{data.profile.summary}"
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="space-y-4 print:break-inside-avoid">
           <h3 className="font-serif font-black uppercase text-xl text-center border-b pb-2 mb-4">Experience</h3>
           <div className="space-y-6">
             {data.experience.map(e => (
               <div key={e.id}>
                 <div className="flex justify-between items-baseline mb-1">
                   <h4 className="font-bold text-lg">{e.title} <span className="font-normal italic opacity-80">at {e.company}</span></h4>
                   <span className="text-sm font-bold" style={{ color: accent }}>
                     {e.startDate} - {e.present ? 'Present' : e.endDate}
                   </span>
                 </div>
                 <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">{e.description}</p>
               </div>
             ))}
           </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-8">
          {/* Education */}
          {data.education.length > 0 && (
            <div className="space-y-4 print:break-inside-avoid">
               <h3 className="font-serif font-black uppercase text-xl border-b pb-2">Education</h3>
               <div className="space-y-4">
                 {data.education.map(e => (
                   <div key={e.id}>
                     <h4 className="font-bold">{e.degree}</h4>
                     <div className="text-sm italic opacity-80 mb-1">{e.school}</div>
                     <div className="text-xs font-bold" style={{ color: accent }}>{e.startYear} - {e.ongoing ? 'Ongoing' : e.endYear}</div>
                     {e.description && <p className="text-xs mt-1 leading-relaxed opacity-70">{e.description}</p>}
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
        
        <div className="space-y-8">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="space-y-4 print:break-inside-avoid">
              <h3 className="font-serif font-black uppercase text-xl border-b pb-2">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(s => (
                  <div key={s.id} className="px-3 py-1 text-sm font-bold rounded-sm" style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderLeft: `3px solid ${accent}` }}>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div className="space-y-4 print:break-inside-avoid">
              <h3 className="font-serif font-black uppercase text-xl border-b pb-2">Languages</h3>
              <div className="space-y-2 text-sm">
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between border-b border-dashed pb-1 opacity-80">
                    <span className="font-bold">{l.name}</span>
                    <span>{l.fluency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

       {/* Matrimonial Info */}
       {data.matrimonial.show && (
          <div className="space-y-4 mt-auto border-t pt-6 print:break-inside-avoid">
             <h3 className="font-serif font-black uppercase text-xl text-center pb-2">Personal Details</h3>
             <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm">
               {data.matrimonial.dob && <div><span className="font-bold uppercase text-xs opacity-60 mr-2">DOB:</span>{data.matrimonial.dob}</div>}
               {data.matrimonial.gender && <div><span className="font-bold uppercase text-xs opacity-60 mr-2">Gender:</span>{data.matrimonial.gender}</div>}
               {data.matrimonial.maritalStatus && <div><span className="font-bold uppercase text-xs opacity-60 mr-2">Status:</span>{data.matrimonial.maritalStatus}</div>}
               {data.matrimonial.nationality && <div><span className="font-bold uppercase text-xs opacity-60 mr-2">Nationality:</span>{data.matrimonial.nationality}</div>}
               {data.matrimonial.height && <div><span className="font-bold uppercase text-xs opacity-60 mr-2">Height:</span>{data.matrimonial.height}</div>}
               {data.matrimonial.weight && <div><span className="font-bold uppercase text-xs opacity-60 mr-2">Weight:</span>{data.matrimonial.weight}</div>}
             </div>
          </div>
        )}

    </div>
  );
}


// Layout 3: Minimalist
function MinimalLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="p-10 flex flex-col gap-6 h-full min-h-[297mm]">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 pb-4" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-4xl font-black mb-1 tracking-tight">{data.profile.name || 'YOUR NAME'}</h1>
          <h2 className="text-lg font-bold opacity-70">{data.profile.role || 'Role / Headline'}</h2>
        </div>
        <div className="text-right text-xs space-y-1 opacity-80">
          {data.contact.email && <div>{data.contact.email}</div>}
          {data.contact.phone && <div>{data.contact.phone}</div>}
          {data.contact.location && <div>{data.contact.location}</div>}
        </div>
      </div>

      {data.profile.summary && (
        <p className="text-sm leading-relaxed opacity-90 max-w-3xl font-medium">
          {data.profile.summary}
        </p>
      )}

      <div className="grid grid-cols-3 gap-8 mt-4">
        {/* Left Col */}
        <div className="col-span-2 space-y-8">
          
          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="space-y-4 print:break-inside-avoid">
               <h3 className="font-black uppercase tracking-wider text-sm" style={{ color: accent }}>Experience</h3>
               <div className="space-y-5">
                 {data.experience.map(e => (
                   <div key={e.id}>
                     <h4 className="font-bold text-base">{e.title}</h4>
                     <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-bold opacity-80">{e.company}</span>
                        <span className="text-xs font-mono opacity-60 bg-muted px-1 rounded">
                          {e.startDate} - {e.present ? 'Present' : e.endDate}
                        </span>
                     </div>
                     <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">{e.description}</p>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="space-y-4 print:break-inside-avoid">
               <h3 className="font-black uppercase tracking-wider text-sm" style={{ color: accent }}>Projects</h3>
               <div className="space-y-4">
                 {data.projects.map(p => (
                   <div key={p.id}>
                     <div className="flex gap-2 items-baseline mb-1">
                       <h4 className="font-bold">{p.name}</h4>
                       <span className="text-xs font-mono opacity-50">{p.link}</span>
                     </div>
                     <p className="text-sm leading-relaxed opacity-80 mb-1">{p.description}</p>
                     <div className="text-xs font-bold opacity-70">Tech: {p.tech}</div>
                   </div>
                 ))}
               </div>
            </div>
          )}

        </div>

        {/* Right Col */}
        <div className="col-span-1 space-y-8">
          
           {data.profile.photoUrl && (
            <img src={data.profile.photoUrl} className="w-full aspect-square object-cover rounded-xl" alt="Profile" />
           )}

           {/* Education */}
           {data.education.length > 0 && (
            <div className="space-y-4 print:break-inside-avoid">
               <h3 className="font-black uppercase tracking-wider text-sm" style={{ color: accent }}>Education</h3>
               <div className="space-y-4">
                 {data.education.map(e => (
                   <div key={e.id}>
                     <h4 className="font-bold text-sm leading-tight mb-1">{e.degree}</h4>
                     <div className="text-xs opacity-80 mb-1">{e.school}</div>
                     <div className="text-xs font-mono opacity-60">
                       {e.startYear} - {e.ongoing ? 'Ongoing' : e.endYear}
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="space-y-4 print:break-inside-avoid">
              <h3 className="font-black uppercase tracking-wider text-sm" style={{ color: accent }}>Skills</h3>
              <ul className="list-disc list-inside text-sm space-y-1 opacity-90 marker:text-primary">
                {data.skills.map(s => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>
          )}

           {/* Matrimonial Info */}
           {data.matrimonial.show && (
            <div className="space-y-4 print:break-inside-avoid">
              <h3 className="font-black uppercase tracking-wider text-sm" style={{ color: accent }}>Personal Details</h3>
              <div className="space-y-2 text-xs">
                {data.matrimonial.dob && <div className="flex justify-between"><span className="font-bold opacity-60">DOB</span><span className="font-medium text-right">{data.matrimonial.dob}</span></div>}
                {data.matrimonial.gender && <div className="flex justify-between"><span className="font-bold opacity-60">Gender</span><span className="font-medium text-right">{data.matrimonial.gender}</span></div>}
                {data.matrimonial.maritalStatus && <div className="flex justify-between"><span className="font-bold opacity-60">Status</span><span className="font-medium text-right">{data.matrimonial.maritalStatus}</span></div>}
                {data.matrimonial.nationality && <div className="flex justify-between"><span className="font-bold opacity-60">Nationality</span><span className="font-medium text-right">{data.matrimonial.nationality}</span></div>}
                {data.matrimonial.height && <div className="flex justify-between"><span className="font-bold opacity-60">Height</span><span className="font-medium text-right">{data.matrimonial.height}</span></div>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Layout 4: Professional
function ProfessionalLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="flex flex-col h-full min-h-[297mm]">
      <div className="p-10 text-white text-center" style={{ backgroundColor: accent }}>
        <h1 className="text-4xl font-black mb-2 uppercase tracking-widest">{data.profile.name || 'YOUR NAME'}</h1>
        <h2 className="text-lg font-bold opacity-90">{data.profile.role || 'Professional Title'}</h2>
        <div className="flex justify-center gap-4 mt-4 text-xs font-medium opacity-80">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>| {data.contact.phone}</span>}
          {data.contact.location && <span>| {data.contact.location}</span>}
        </div>
      </div>
      <div className="p-10 flex gap-10">
        <div className="w-2/3 space-y-8">
          {data.profile.summary && (
            <div className="text-sm leading-relaxed opacity-90 font-medium">
              {data.profile.summary}
            </div>
          )}
          {data.experience.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b-2 pb-1" style={{ borderColor: accent, color: accent }}>EXPERIENCE</h3>
              {data.experience.map(e => (
                <div key={e.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{e.title}</h4>
                    <span className="text-xs font-bold opacity-70">{e.startDate} - {e.present ? 'Present' : e.endDate}</span>
                  </div>
                  <div className="text-sm opacity-80 mb-2">{e.company}</div>
                  <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">{e.description}</p>
                </div>
              ))}
            </div>
          )}
          {data.projects.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b-2 pb-1" style={{ borderColor: accent, color: accent }}>PROJECTS</h3>
              {data.projects.map(p => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{p.name}</h4>
                    <span className="text-xs font-bold opacity-70">{p.tech}</span>
                  </div>
                  <p className="text-sm leading-relaxed opacity-80">{p.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-1/3 space-y-8">
          {data.profile.photoUrl && <img src={data.profile.photoUrl} className="w-full aspect-square object-cover rounded-md" alt="Profile" />}
          {data.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg border-b-2 pb-1" style={{ borderColor: accent, color: accent }}>SKILLS</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(s => <span key={s.id} className="px-2 py-1 bg-muted text-xs font-bold rounded">{s.name}</span>)}
              </div>
            </div>
          )}
          {data.education.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b-2 pb-1" style={{ borderColor: accent, color: accent }}>EDUCATION</h3>
              {data.education.map(e => (
                <div key={e.id}>
                  <h4 className="font-bold text-sm">{e.degree}</h4>
                  <div className="text-xs opacity-80 mb-1">{e.school}</div>
                  <div className="text-xs font-bold opacity-60">{e.startYear} - {e.ongoing ? 'Ongoing' : e.endYear}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Layout 5: Creative
function CreativeLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="flex h-full min-h-[297mm]">
      <div className="w-1/3 p-8 text-white space-y-8" style={{ backgroundColor: accent }}>
        {data.profile.photoUrl && <img src={data.profile.photoUrl} className="w-32 h-32 rounded-full object-cover border-4 border-white/20 mx-auto" alt="Profile" />}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black uppercase">{data.profile.name}</h1>
          <h2 className="text-sm font-medium opacity-80">{data.profile.role}</h2>
        </div>
        <div className="space-y-4 text-xs font-medium opacity-90 border-t border-white/20 pt-8">
          {data.contact.email && <div>{data.contact.email}</div>}
          {data.contact.phone && <div>{data.contact.phone}</div>}
          {data.contact.location && <div>{data.contact.location}</div>}
          {data.contact.linkedin && <div>{data.contact.linkedin}</div>}
        </div>
        {data.skills.length > 0 && (
          <div className="space-y-3 pt-8 border-t border-white/20">
            <h3 className="font-black tracking-widest uppercase text-sm">Skills</h3>
            {data.skills.map(s => (
              <div key={s.id} className="text-xs font-bold opacity-90">{s.name}</div>
            ))}
          </div>
        )}
      </div>
      <div className="w-2/3 p-10 space-y-8">
        {data.profile.summary && <p className="text-sm leading-relaxed font-medium italic opacity-80 border-l-4 pl-4" style={{ borderColor: accent }}>"{data.profile.summary}"</p>}
        {data.experience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-black text-2xl uppercase tracking-wider" style={{ color: accent }}>Experience</h3>
            <div className="space-y-6">
              {data.experience.map(e => (
                <div key={e.id}>
                  <h4 className="font-bold text-lg">{e.title}</h4>
                  <div className="text-sm font-bold opacity-60 mb-2">{e.company} • {e.startDate} - {e.present ? 'Present' : e.endDate}</div>
                  <p className="text-sm leading-relaxed opacity-80">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-black text-2xl uppercase tracking-wider" style={{ color: accent }}>Education</h3>
            <div className="space-y-4">
              {data.education.map(e => (
                <div key={e.id}>
                  <h4 className="font-bold text-base">{e.degree}</h4>
                  <div className="text-sm font-bold opacity-60 mb-1">{e.school} • {e.startYear} - {e.ongoing ? 'Ongoing' : e.endYear}</div>
                  <p className="text-sm leading-relaxed opacity-80">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Layout 6: Elegant
function ElegantLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="p-12 font-serif h-full min-h-[297mm] flex flex-col items-center">
      <div className="w-full border-b border-t py-6 mb-8 text-center" style={{ borderColor: accent }}>
        <h1 className="text-5xl font-normal tracking-widest uppercase mb-3" style={{ color: accent }}>{data.profile.name}</h1>
        <h2 className="text-sm tracking-[0.3em] uppercase opacity-60">{data.profile.role}</h2>
      </div>
      <div className="w-full flex justify-center gap-6 text-xs tracking-wider opacity-70 mb-10">
        {data.contact.email && <span>{data.contact.email}</span>}
        {data.contact.phone && <span>{data.contact.phone}</span>}
        {data.contact.location && <span>{data.contact.location}</span>}
      </div>
      <div className="w-full max-w-3xl space-y-10">
        {data.profile.summary && <p className="text-center text-sm leading-loose opacity-80">{data.profile.summary}</p>}
        {data.experience.length > 0 && (
          <div>
            <h3 className="text-center font-normal tracking-[0.2em] text-lg uppercase mb-6" style={{ color: accent }}>Experience</h3>
            <div className="space-y-6">
              {data.experience.map(e => (
                <div key={e.id} className="text-center">
                  <h4 className="font-bold text-base">{e.title}</h4>
                  <div className="text-xs italic opacity-70 mb-2">{e.company}, {e.startDate} - {e.present ? 'Present' : e.endDate}</div>
                  <p className="text-sm leading-relaxed opacity-80">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h3 className="text-center font-normal tracking-[0.2em] text-lg uppercase mb-6" style={{ color: accent }}>Education</h3>
            <div className="space-y-4">
              {data.education.map(e => (
                <div key={e.id} className="text-center">
                  <h4 className="font-bold text-base">{e.degree}</h4>
                  <div className="text-xs italic opacity-70 mb-1">{e.school}</div>
                  <div className="text-xs opacity-60">{e.startYear} - {e.ongoing ? 'Ongoing' : e.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Layout 7: Executive
function ExecutiveLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="p-10 h-full min-h-[297mm]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase">{data.profile.name}</h1>
          <h2 className="text-xl opacity-80">{data.profile.role}</h2>
        </div>
        <div className="text-right text-sm opacity-70 space-y-1">
          {data.contact.email && <div>{data.contact.email}</div>}
          {data.contact.phone && <div>{data.contact.phone}</div>}
          {data.contact.location && <div>{data.contact.location}</div>}
        </div>
      </div>
      <div className="w-full h-2 mb-8" style={{ backgroundColor: accent }} />
      <div className="space-y-8">
        {data.profile.summary && (
          <div className="space-y-2">
            <h3 className="font-black uppercase tracking-wider text-sm" style={{ color: accent }}>Executive Summary</h3>
            <p className="text-sm leading-relaxed opacity-90">{data.profile.summary}</p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-black uppercase tracking-wider text-sm border-b pb-1" style={{ color: accent, borderColor: accent }}>Professional Experience</h3>
            <div className="space-y-4">
              {data.experience.map(e => (
                <div key={e.id}>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-base">{e.title}</h4>
                    <span className="text-sm font-bold opacity-80">{e.startDate} - {e.present ? 'Present' : e.endDate}</span>
                  </div>
                  <div className="text-sm font-bold opacity-70 mb-1">{e.company}</div>
                  <p className="text-sm leading-relaxed opacity-80">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-black uppercase tracking-wider text-sm border-b pb-1" style={{ color: accent, borderColor: accent }}>Education</h3>
            {data.education.map(e => (
              <div key={e.id} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{e.degree}</h4>
                  <div className="text-sm opacity-80">{e.school}</div>
                </div>
                <div className="text-sm font-bold opacity-80">{e.startYear} - {e.ongoing ? 'Ongoing' : e.endYear}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Layout 8: Compact
function CompactLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="p-8 text-sm h-full min-h-[297mm]">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black uppercase" style={{ color: accent }}>{data.profile.name}</h1>
        <div className="font-bold opacity-80">{data.profile.role}</div>
        <div className="flex justify-center gap-4 text-xs opacity-70 mt-1">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          {data.profile.summary && (
            <div>
              <h3 className="font-black uppercase border-b mb-2 pb-1" style={{ borderColor: accent }}>Profile</h3>
              <p className="text-xs leading-relaxed opacity-90">{data.profile.summary}</p>
            </div>
          )}
          {data.experience.length > 0 && (
            <div>
              <h3 className="font-black uppercase border-b mb-2 pb-1" style={{ borderColor: accent }}>Experience</h3>
              <div className="space-y-3">
                {data.experience.map(e => (
                  <div key={e.id}>
                    <div className="flex justify-between"><strong className="text-xs">{e.title}</strong><span className="text-[10px] opacity-70">{e.startDate}-{e.present?'Now':e.endDate}</span></div>
                    <div className="text-xs opacity-80">{e.company}</div>
                    <p className="text-[11px] leading-snug opacity-80 mt-1">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          {data.skills.length > 0 && (
            <div>
              <h3 className="font-black uppercase border-b mb-2 pb-1" style={{ borderColor: accent }}>Skills</h3>
              <div className="text-xs opacity-90">{data.skills.map(s => s.name).join(' • ')}</div>
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <h3 className="font-black uppercase border-b mb-2 pb-1" style={{ borderColor: accent }}>Education</h3>
              <div className="space-y-2">
                {data.education.map(e => (
                  <div key={e.id}>
                    <strong className="text-xs">{e.degree}</strong>
                    <div className="flex justify-between text-xs opacity-80"><span>{e.school}</span><span>{e.startYear}-{e.endYear}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.projects.length > 0 && (
            <div>
              <h3 className="font-black uppercase border-b mb-2 pb-1" style={{ borderColor: accent }}>Projects</h3>
              <div className="space-y-2">
                {data.projects.map(p => (
                  <div key={p.id}>
                    <strong className="text-xs">{p.name}</strong> <span className="text-[10px] opacity-70">({p.tech})</span>
                    <p className="text-[11px] leading-snug opacity-80">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Layout 9: Tech
function TechLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="p-10 font-mono h-full min-h-[297mm]" style={{ backgroundColor: isDark ? '#000' : '#f4f4f5' }}>
      <div className="border-2 p-6 mb-8" style={{ borderColor: accent }}>
        <h1 className="text-4xl font-black uppercase mb-2" style={{ color: accent }}>&gt; {data.profile.name}_</h1>
        <h2 className="text-lg opacity-80">/* {data.profile.role} */</h2>
        <div className="text-xs opacity-60 mt-4 space-y-1">
          {data.contact.email && <div>email: "{data.contact.email}"</div>}
          {data.contact.phone && <div>phone: "{data.contact.phone}"</div>}
          {data.contact.github && <div>github: "{data.contact.github}"</div>}
        </div>
      </div>
      <div className="space-y-8 text-sm">
        {data.profile.summary && (
          <div>
            <h3 className="font-bold opacity-60 mb-2">// SUMMARY</h3>
            <p className="leading-relaxed opacity-90">{data.profile.summary}</p>
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h3 className="font-bold opacity-60 mb-2">// SKILLS</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(s => <span key={s.id} className="border px-2 py-0.5 text-xs font-bold" style={{ borderColor: accent, color: accent }}>{s.name}</span>)}
            </div>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <h3 className="font-bold opacity-60 mb-4">// EXPERIENCE</h3>
            <div className="space-y-6 pl-4 border-l-2" style={{ borderColor: accent }}>
              {data.experience.map(e => (
                <div key={e.id}>
                  <div className="font-bold">{e.title} @ {e.company}</div>
                  <div className="text-xs opacity-60 mb-2">[{e.startDate} - {e.present ? 'HEAD' : e.endDate}]</div>
                  <p className="text-xs leading-relaxed opacity-80">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Layout 10: Timeline
function TimelineLayout({ data, isDark, accent }: { data: ResumeData, isDark: boolean, accent: string }) {
  return (
    <div className="p-10 h-full min-h-[297mm] flex gap-10">
      <div className="w-1/3 text-right border-r-2 pr-6 space-y-6" style={{ borderColor: accent }}>
        <h1 className="text-3xl font-black uppercase">{data.profile.name}</h1>
        <h2 className="text-sm font-bold opacity-70">{data.profile.role}</h2>
        <div className="text-xs opacity-60 space-y-1">
          {data.contact.email && <div>{data.contact.email}</div>}
          {data.contact.phone && <div>{data.contact.phone}</div>}
          {data.contact.location && <div>{data.contact.location}</div>}
        </div>
        {data.skills.length > 0 && (
          <div className="pt-6">
            <h3 className="font-black uppercase text-xs mb-2" style={{ color: accent }}>Skills</h3>
            <div className="space-y-1 text-xs opacity-80">
              {data.skills.map(s => <div key={s.id}>{s.name}</div>)}
            </div>
          </div>
        )}
      </div>
      <div className="w-2/3 space-y-10 pl-2">
        {data.profile.summary && (
          <div className="text-sm leading-relaxed opacity-90">{data.profile.summary}</div>
        )}
        {data.experience.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-black uppercase text-xl" style={{ color: accent }}>Experience</h3>
            <div className="space-y-6 relative border-l-2 pl-6 ml-2" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
              {data.experience.map(e => (
                <div key={e.id} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: accent }} />
                  <h4 className="font-bold text-base">{e.title}</h4>
                  <div className="text-xs font-bold opacity-60 mb-2">{e.company} | {e.startDate} - {e.present ? 'Present' : e.endDate}</div>
                  <p className="text-sm leading-relaxed opacity-80">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-black uppercase text-xl" style={{ color: accent }}>Education</h3>
            <div className="space-y-6 relative border-l-2 pl-6 ml-2" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
              {data.education.map(e => (
                <div key={e.id} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: accent }} />
                  <h4 className="font-bold text-base">{e.degree}</h4>
                  <div className="text-xs font-bold opacity-60 mb-1">{e.school} | {e.startYear} - {e.ongoing ? 'Ongoing' : e.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
