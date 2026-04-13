import { FileText, Image as ImageIcon, Type, Calculator, Code, Hash, FileCode, QrCode, UserCircle, FileUser, PenTool, LayoutTemplate, Layers } from "lucide-react";

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  icon: any;
  keywords: string[];
  componentName: string;
};

export type Category = {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
  color: string;
  tools: string[];
};

export const ALL_TOOLS: Tool[] = [
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    description: "Reduce PDF file sizes directly in your browser securely.",
    category: "pdf-tools",
    link: "/tools/pdf-compressor",
    icon: Layers,
    keywords: ["pdf", "compress", "reduce", "size", "document"],
    componentName: "PdfCompressor"
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG Converter",
    description: "Convert PDF documents to high-quality JPG images directly in your browser.",
    category: "pdf-tools",
    link: "/tools/pdf-to-jpg",
    icon: ImageIcon,
    keywords: ["pdf", "jpg", "image", "convert", "extract"],
    componentName: "PdfToJpg"
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    description: "Convert multiple JPG, JPEG, or PNG images to a single PDF document.",
    category: "pdf-tools",
    link: "/tools/jpg-to-pdf",
    icon: ImageIcon,
    keywords: ["jpg", "pdf", "image", "convert", "combine", "merge"],
    componentName: "JpgToPdf"
  },
  {
    id: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDF files into a single document easily and securely.",
    category: "pdf-tools",
    link: "/tools/pdf-merger",
    icon: Layers,
    keywords: ["pdf", "merge", "combine", "join", "document"],
    componentName: "PdfMerger"
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Analyze text length, reading time, and character density instantly.",
    category: "text-tools",
    link: "/tools/word-counter",
    icon: Hash,
    keywords: ["count", "text", "essay", "characters"],
    componentName: "WordCounter"
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Transform text between UPPERCASE, lowercase, Title Case, and more.",
    category: "text-tools",
    link: "/tools/case-converter",
    icon: Type,
    keywords: ["upper", "lower", "sentence", "transform"],
    componentName: "CaseConverter"
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Prettify, validate, and minify your JSON data for better readability.",
    category: "developer-tools",
    link: "/tools/json-formatter",
    icon: FileCode,
    keywords: ["code", "pretty", "minify", "developer"],
    componentName: "JsonFormatter"
  },
  {
    id: "passport-photo-maker",
    name: "Passport Photo Maker",
    description: "Professional passport size photo maker with interactive editing, name/date overlay, and A4 sheet generation.",
    category: "image-tools",
    link: "/tools/passport-photo-maker",
    icon: UserCircle,
    keywords: ["photo", "passport", "id", "visa", "editor"],
    componentName: "PassportPhotoMaker"
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Professional image resize tool with manual cropping, compression, and bulk zip processing.",
    category: "image-tools",
    link: "/tools/image-resizer",
    icon: ImageIcon,
    keywords: ["resize", "crop", "scale", "image"],
    componentName: "ImageResizer"
  },
  {
    id: "add-white-bg",
    name: "Add White Background",
    description: "Easily add custom colored backgrounds and padding to your transparent images. Optionally remove the original background first using AI.",
    category: "image-tools",
    link: "/tools/add-white-bg",
    icon: ImageIcon,
    keywords: ["background", "white", "remove", "transparent", "image"],
    componentName: "AddWhiteBg"
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file size directly in your browser using smart canvas compression.",
    category: "image-tools",
    link: "/tools/image-compressor",
    icon: ImageIcon,
    keywords: ["resize", "small", "optimize", "photo"],
    componentName: "ImageCompressor"
  },
  {
    id: "image-merge",
    name: "Image Merge Tool",
    description: "Combine multiple images into one with custom layouts, grids, and high-quality export.",
    category: "image-tools",
    link: "/tools/image-merge",
    icon: ImageIcon,
    keywords: ["merge", "join", "combine", "image", "grid"],
    componentName: "ImageMerge"
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Create high-quality, scannable QR codes for URLs, text, or contact info.",
    category: "developer-tools",
    link: "/tools/qr-code-generator",
    icon: QrCode,
    keywords: ["link", "url", "scan", "code"],
    componentName: "QrGenerator"
  },
  {
    id: "bio-data-maker",
    name: "Bio Data Maker",
    description: "Create professional resumes and matrimonial bio-data with real-time preview and custom templates.",
    category: "cv-maker",
    link: "/tools/bio-data-maker",
    icon: LayoutTemplate,
    keywords: ["cv", "resume", "biodata", "maker", "matrimonial"],
    componentName: "BioDataMaker"
  },
  {
    id: "resume-builder",
    name: "Resume Builder",
    description: "Create professional ATS-friendly resumes in minutes with our drag-and-drop editor.",
    category: "cv-maker",
    link: "/tools/resume-builder",
    icon: FileUser,
    keywords: ["cv", "resume", "jobs", "career"],
    componentName: "ResumeBuilder"
  },
  {
    id: "cover-letter-gen",
    name: "Cover Letter Gen",
    description: "Generate tailored cover letters based on job descriptions instantly.",
    category: "cv-maker",
    link: "/tools/cover-letter-generator",
    icon: PenTool,
    keywords: ["letter", "application", "jobs", "writing"],
    componentName: "CoverLetterGenerator"
  }
];

export const CATEGORIES: Category[] = [
  {
    id: "pdf-tools",
    title: "PDF Suite",
    description: "Professional tools to merge, split, and edit PDF files effortlessly.",
    icon: FileText,
    link: "/categories/pdf-tools",
    color: "bg-red-500",
    tools: ["pdf-merger", "pdf-compressor", "pdf-to-word", "pdf-to-jpg", "jpg-to-pdf"]
  },
  {
    id: "image-tools",
    title: "Image Lab",
    description: "Advanced image optimization and editing directly in your browser.",
    icon: ImageIcon,
    link: "/categories/image-tools",
    color: "bg-blue-500",
    tools: ["image-compressor", "passport-photo-maker", "image-resizer", "image-merge"]
  },
  {
    id: "text-tools",
    title: "Text Utils",
    description: "Essential tools for data formatting, analysis, and generation.",
    icon: Type,
    link: "/categories/text-tools",
    color: "bg-amber-500",
    tools: ["word-counter", "case-converter"]
  },
  {
    id: "developer-tools",
    title: "Dev Hub",
    description: "Tools for developers to format, encode, and debug code snippets.",
    icon: Code,
    link: "/categories/developer-tools",
    color: "bg-indigo-500",
    tools: ["json-formatter", "qr-code-generator"]
  },
  {
    id: "cv-maker",
    title: "CV & Career",
    description: "Professional resume builders and career optimization utilities.",
    icon: UserCircle,
    link: "/categories/cv-maker",
    color: "bg-fuchsia-500",
    tools: ["bio-data-maker", "resume-builder", "cover-letter-gen"]
  }
];