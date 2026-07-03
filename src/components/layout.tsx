import { Link } from "wouter";
import { useTheme } from "./theme-provider";
import { Moon, Sun, Clock, Menu, X, ChevronDown, Zap, Shield, Eye, Lock, Cpu, Server, HardDrive, Award, Code, Map as MapIcon, Users, Info, Settings, History, CreditCard, Rocket, BoxSelect, CpuIcon, LayoutDashboard, UserPlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const MENU_ITEMS = [
  {
    title: "Platform",
    items: [
      { title: "How It Works", href: "/platform/how-it-works", description: "How the AI pipeline routes requests", icon: Zap },
      { title: "On-Chain Proof", href: "/platform/on-chain-proof", description: "Cryptographic verification on Solana", icon: Shield },
      { title: "Privacy Modes", href: "/platform/privacy-modes", description: "Public, Private, and Enterprise data", icon: Eye },
      { title: "Security", href: "/platform/security", description: "Signatures and tamper detection", icon: Lock },
    ]
  },
  {
    title: "For AI Users",
    items: [
      { title: "Getting Started", href: "/users/getting-started", description: "Step-by-step onboarding guide", icon: Rocket },
      { title: "AI Capabilities", href: "/users/ai-capabilities", description: "Range of AI models and tasks", icon: CpuIcon },
      { title: "Proof Explorer", href: "/users/proof-explorer", description: "Verify your AI task history", icon: History },
      { title: "Pricing & Credits", href: "/users/pricing", description: "Tiers, credits, and USDC payments", icon: CreditCard },
    ]
  },
  {
    title: "For Contributors",
    items: [
      { title: "Become a Contributor", href: "/contributors/register", description: "Register your node and start earning", icon: UserPlus },
      { title: "Compute Nodes", href: "/contributors/compute", description: "Run AI inference & earn rewards", icon: Server },
      { title: "Verification Nodes", href: "/contributors/verification", description: "Validate tasks & generate proofs", icon: Shield },
      { title: "Storage Nodes", href: "/contributors/storage", description: "Store encrypted AI artifacts", icon: HardDrive },
      { title: "Rewards & Reputation", href: "/contributors/rewards-reputation", description: "How earnings and reputation work", icon: Award },
    ]
  },
  {
    title: "Ecosystem",
    items: [
      { title: "Developer API", href: "/ecosystem/developer-api", description: "Integrate into your apps", icon: Code },
      { title: "Roadmap", href: "/ecosystem/roadmap", description: "Development phases", icon: MapIcon },
      { title: "Governance", href: "/ecosystem/governance", description: "Future DAO and community control", icon: Users },
      { title: "About Verifo", href: "/ecosystem/about", description: "Mission, vision, and values", icon: Info },
    ]
  }
];

export function Layout({ children, hideNavOnTop = false }: { children: React.ReactNode; hideNavOnTop?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hideNavOnTop) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideNavOnTop]);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveDesktopMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [window.location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/30">
      {/* Spacer for fixed header on non-hero pages */}
      {!hideNavOnTop && <div className="h-16 shrink-0" />}
      {/* ─── Header ─── */}
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-transform duration-300",
          hideNavOnTop && !scrolled ? "-translate-y-full" : "translate-y-0"
        )}
        style={{ backgroundColor: "hsl(28 45% 12%)" }}
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-0.5 group">
              <img src="/logo.webp" alt="Verifo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">Verifo</span>
            </Link>
            
            <nav ref={menuRef} className="hidden lg:flex items-center gap-1">
              {MENU_ITEMS.map((menu) => (
                <div 
                  key={menu.title}
                  className="relative"
                  onMouseEnter={() => setActiveDesktopMenu(menu.title)}
                  onMouseLeave={() => setActiveDesktopMenu(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      activeDesktopMenu === menu.title
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {menu.title}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", activeDesktopMenu === menu.title && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {activeDesktopMenu === menu.title && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 pt-2 w-[480px]"
                      >
                        <div className="bg-popover border border-border shadow-lg rounded-xl overflow-hidden p-3 grid grid-cols-2 gap-2">
                          {menu.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                            >
                              <div className="p-2 bg-muted rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground">
                                <item.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {item.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "auto" ? "light" : theme === "light" ? "dark" : "auto")}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label={theme === "auto" ? "Auto (time-based)" : theme === "light" ? "Light mode" : "Dark mode"}
              title={theme === "auto" ? "Auto: switches at 6am/6pm" : theme === "light" ? "Light mode" : "Dark mode"}
            >
              {theme === "auto" ? <Clock className="w-5 h-5" /> : theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="hidden lg:flex items-center gap-3">
              {!isSignedIn ? (
                <>
                  <Link href="/sign-in" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/sign-in">Get Started Free</Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="sm">
                  <Link href="/dashboard" className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                </Button>
              )}
            </div>

            <button
              className="lg:hidden p-2 -mr-2 text-white/70 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-border bg-background overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {MENU_ITEMS.map((menu) => {
                const isOpen = activeMobileSection === menu.title;
                return (
                  <div key={menu.title}>
                    <button
                      className="w-full flex items-center justify-between py-3 font-semibold text-foreground text-left"
                      onClick={() => setActiveMobileSection(isOpen ? null : menu.title)}
                    >
                      {menu.title}
                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-1 pl-4 border-l border-border pb-3">
                            {menu.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="text-muted-foreground hover:text-primary py-1.5 text-sm flex items-center gap-2"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <div className="pt-4 border-t border-border flex flex-col gap-3 mt-2">
                {!isSignedIn ? (
                  <>
                    <Button asChild variant="outline" className="w-full justify-center">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full justify-center">
                      <Link href="/sign-in">Get Started Free</Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full justify-center">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full flex flex-col relative">
        {children}
      </main>

      {/* ─── Footer: warm dark brown ─── */}
      <footer style={{ backgroundColor: "hsl(28 40% 11%)" }} className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-0.5 mb-4 group">
              <img src="/logo.webp" alt="Verifo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-xl tracking-tight text-white">Verifo</span>
            </Link>
            <p className="text-white/55 max-w-sm mb-6 text-sm leading-relaxed">
              Community-powered AI. Cryptographically verified. The decentralized infrastructure protocol for the next generation of artificial intelligence.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.371-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
            </div>
          </div>
          
          {MENU_ITEMS.map((menu) => (
            <div key={menu.title}>
              <h4 className="font-semibold text-white/80 mb-4 text-sm uppercase tracking-wider">{menu.title}</h4>
              <ul className="space-y-3">
                {menu.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-white/45 hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/35">
            © {new Date().getFullYear()} Verifo Protocol. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/35">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <button
              onClick={() => setTheme(theme === "auto" ? "light" : theme === "light" ? "dark" : "auto")}
              className="p-2 rounded-full hover:bg-white/10 text-white/35 hover:text-white transition-colors"
              aria-label="Toggle theme"
              title={theme === "auto" ? "Auto: switches at 6am/6pm" : theme === "light" ? "Light mode" : "Dark mode"}
            >
              {theme === "auto" ? <Clock className="w-4 h-4" /> : theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
