import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTools, 
  faSearch, 
  faChevronDown, 
  faLaptopCode, 
  faFilePdf, 
  faMagic,
  faBars,
  faBolt,
  faHome,
  faBriefcase,
  faTag,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo & Main Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <FontAwesomeIcon icon={faTools} className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              ToolForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground outline-none">
                Tools
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[400px] p-2 grid grid-cols-2 gap-1 rounded-xl shadow-xl">
                <div className="col-span-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Popular Categories
                </div>
                <DropdownMenuItem asChild className="rounded-lg p-2 cursor-pointer">
                  <Link href="/categories/pdf-tools" className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-500">
                      <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">PDF Tools</p>
                      <p className="text-xs text-muted-foreground leading-snug">Merge, split, and compress PDFs.</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg p-2 cursor-pointer">
                  <Link href="/categories/image-tools" className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-500">
                      <FontAwesomeIcon icon={faMagic} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">Image Tools</p>
                      <p className="text-xs text-muted-foreground leading-snug">Resize, convert, and optimize.</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg p-2 cursor-pointer">
                  <Link href="/categories/developer-tools" className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                      <FontAwesomeIcon icon={faLaptopCode} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">Developer</p>
                      <p className="text-xs text-muted-foreground leading-snug">JSON formatters & encoders.</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg p-2 cursor-pointer">
                  <Link href="/tools/add-white-bg" className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-yellow-500/10 text-yellow-500">
                      <FontAwesomeIcon icon={faBolt} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">Magic BG</p>
                      <p className="text-xs text-muted-foreground leading-snug">Remove backgrounds instantly.</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="col-span-2 my-1" />
                <DropdownMenuItem asChild className="col-span-2 rounded-lg p-2 cursor-pointer justify-center text-primary">
                  <Link href="/" className="text-sm font-medium">
                    View All Tools &rarr;
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Enterprise
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Support
            </Link>
          </nav>
        </div>

        {/* Right: Search, Theme, Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Subtle Search Button (Command Palette Style) */}
          <button className="hidden md:flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:w-64">
            <FontAwesomeIcon icon={faSearch} className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search tools...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            
            <div className="hidden sm:block h-4 w-px bg-border mx-1" />

            <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-muted-foreground hover:text-foreground font-medium">
              <Link href="/admin">Sign In</Link>
            </Button>
            
            <Button size="sm" className="hidden sm:flex rounded-full font-medium shadow-sm transition-transform active:scale-95">
              Get Started
            </Button>

            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0 border-l border-white/10 bg-white/95 backdrop-blur-3xl dark:bg-zinc-950/95 flex flex-col h-full shadow-2xl">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <SheetHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 bg-muted/20">
                    <SheetTitle className="flex items-center gap-3 text-left">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-400 rounded-lg blur opacity-25"></div>
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm border border-white/20">
                          <FontAwesomeIcon icon={faTools} className="h-4 w-4" />
                        </div>
                      </div>
                      <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
                        ToolForge
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  {/* Mobile Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Search Bar */}
                    <div className="relative group">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search tools..." 
                        className="w-full rounded-2xl border-none bg-zinc-100/70 dark:bg-zinc-900/70 pl-10 pr-4 py-2.5 text-sm font-medium transition-all focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </div>
                    
                    {/* Tools Section */}
                    <div className="space-y-3">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Popular Tools</div>
                      <div className="grid gap-1.5">
                        <Link href="/categories/pdf-tools" className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-sm text-foreground">PDF Suite</span>
                        </Link>
                        <Link href="/categories/image-tools" className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faMagic} className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-sm text-foreground">Design Suite</span>
                        </Link>
                        <Link href="/categories/developer-tools" className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faLaptopCode} className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-sm text-foreground">Dev Core</span>
                        </Link>
                        <Link href="/tools/add-white-bg" className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faBolt} className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-sm text-foreground">Magic BG</span>
                        </Link>
                      </div>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800/50" />

                    {/* Links Section */}
                    <div className="space-y-3">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Company</div>
                      <nav className="flex flex-col gap-1">
                        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                          <FontAwesomeIcon icon={faHome} className="h-4 w-4 w-5" /> Home
                        </Link>
                        <Link href="/about" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                          <FontAwesomeIcon icon={faBriefcase} className="h-4 w-4 w-5" /> Enterprise
                        </Link>
                        <Link href="/pricing" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                          <FontAwesomeIcon icon={faTag} className="h-4 w-4 w-5" /> Pricing
                        </Link>
                        <Link href="/contact" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                          <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 w-5" /> Support
                        </Link>
                      </nav>
                    </div>
                  </div>
                  
                  {/* Mobile Footer Actions */}
                  <div className="p-6 border-t border-zinc-100 dark:border-zinc-800/50 bg-muted/20 space-y-3">
                    <Button variant="outline" className="w-full justify-center h-11 rounded-2xl font-bold border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-background" asChild>
                      <Link href="/admin">Sign In</Link>
                    </Button>
                    <Button className="w-full justify-center h-11 rounded-2xl font-black bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                      Get Started Free
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
