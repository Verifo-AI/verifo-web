import { Layout } from "@/components/layout";
import { NodeNetwork } from "@/components/node-network";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Server, Shield, HardDrive, Cpu, MessageSquare, Code, Image as ImageIcon, Video, Search, Globe, Mic, Settings, Bot, Terminal, ChevronRight, ChevronLeft, Lock, Zap, Users, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";

const HERO_CARDS = [
  {
    image: "/hero-card-1.jpg",
    label: "AI Inference",
    desc: "Run any AI model on community-owned GPUs with verified outputs",
    href: "/platform/how-it-works",
  },
  {
    image: "/hero-card-2.jpg",
    label: "Cryptographic Proofs",
    desc: "Every response backed by tamper-proof cryptographic verification",
    href: "/platform/security",
  },
  {
    image: "/hero-card-3.jpg",
    label: "Global Node Network",
    desc: "Thousands of contributor nodes spanning every continent",
    href: "/contributors/compute",
  },
  {
    image: "/hero-card-4.jpg",
    label: "On-Chain Anchoring",
    desc: "Proofs anchored permanently to the Solana blockchain",
    href: "/ecosystem/vrf-token",
  },
  {
    image: "/hero-card-5.jpg",
    label: "Open Access AI",
    desc: "Permissionless AI for anyone, anywhere, at any scale",
    href: "/dashboard",
  },
];

function HeroCarousel({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(2);
  const [, navigate] = useLocation();
  const cardH = compact ? 180 : 260;
  const carouselH = compact ? 320 : 380;
  const cardW = compact ? "w-44" : "w-64 md:w-96";
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const n = HERO_CARDS.length;
  const prev = useCallback(() => setActive(a => (a - 1 + n) % n), [n]);
  const next = useCallback(() => setActive(a => (a + 1) % n), [n]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 8) isDragging.current = true;
  };
  const onPointerUp = (e: React.PointerEvent, idx: number) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (isDragging.current) {
      if (diff < -40) next();
      else if (diff > 40) prev();
    } else {
      if (idx === active) navigate(HERO_CARDS[idx].href);
      else setActive(idx);
    }
    dragStartX.current = null;
    isDragging.current = false;
  };

  return (
    <div className="relative w-full flex items-center justify-center select-none" style={{ height: carouselH }}>
      <button
        onClick={prev}
        className="absolute left-2 md:left-8 z-30 w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors backdrop-blur"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="relative w-full flex items-center justify-center" style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}>
        {HERO_CARDS.map((card, idx) => {
          let offset = idx - active;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const absOffset = Math.abs(offset);
          if (absOffset > 2) return null;

          const rotateY = compact ? offset * 28 : offset * 18;
          const translateX = compact ? offset * 48 : offset * 62;
          const scale = 1 - absOffset * (compact ? 0.13 : 0.1);
          const opacity = 1 - absOffset * (compact ? 0.3 : 0.25);
          const zIndex = 10 - absOffset;
          const brightness = absOffset === 0 ? 1 : 0.65;

          return (
            <motion.div
              key={card.image}
              animate={{
                rotateY,
                x: `${translateX}%`,
                scale,
                opacity,
                filter: `brightness(${brightness})`,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => onPointerUp(e, idx)}
              style={{
                position: "absolute",
                zIndex,
                transformStyle: "preserve-3d",
                cursor: absOffset === 0 ? "pointer" : "pointer",
                willChange: "transform",
              }}
              className={cn(cardW, "rounded-3xl overflow-hidden shadow-2xl border border-white/10")}
            >
              <img
                src={card.image}
                alt={card.label}
                className="w-full object-cover"
                style={{ height: cardH, display: "block" }}
                draggable={false}
              />
              <div
                className="px-3 py-2.5"
                style={{ background: "hsl(28 45% 10% / 0.95)", backdropFilter: "blur(8px)" }}
              >
                <p className="font-bold text-white text-sm leading-tight">{card.label}</p>
                <p className="text-white/60 text-xs mt-0.5 leading-snug line-clamp-2">{card.desc}</p>
                {absOffset === 0 && (
                  <div className="mt-2 flex items-center gap-1 text-primary text-xs font-semibold">
                    <span>Learn more</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={next}
        className="absolute right-2 md:right-8 z-30 w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors backdrop-blur"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center gap-1.5">
        {HERO_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full transition-all duration-200",
              i === active ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/25"
            )}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function Home() {
  return (
    <Layout hideNavOnTop>
      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center justify-start overflow-hidden px-4 md:px-12 pt-16 md:pt-24 pb-0 min-h-screen">
        <NodeNetwork />

        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, hsl(90 52% 36% / 0.10) 0%, transparent 70%)"
        }} />

        {/* Social links — hero top-left, desktop only */}
        <div className="absolute top-6 left-8 z-20 hidden md:flex items-center gap-2">
          <a
            href="https://github.com/Verifo-AI"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/8 hover:bg-foreground/14 border border-foreground/12 hover:border-foreground/28 transition-all duration-200 backdrop-blur-sm"
          >
            <Github className="w-[18px] h-[18px] text-foreground/60 hover:text-foreground/90" />
          </a>
          <a
            href="https://x.com/verifo_ai"
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter)"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/8 hover:bg-foreground/14 border border-foreground/12 hover:border-foreground/28 transition-all duration-200 backdrop-blur-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-foreground/60"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a
            href="https://pump.fun"
            target="_blank"
            rel="noreferrer"
            aria-label="PumpFun"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/8 hover:bg-foreground/14 border border-foreground/12 hover:border-foreground/28 transition-all duration-200 backdrop-blur-sm overflow-hidden"
          >
            <img src="/pumpfun-logo.webp" alt="PumpFun" className="w-6 h-6 object-contain" />
          </a>
        </div>

        {/* Text + CTA — centered */}
        <motion.div
          className="z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.08]">
            Open intelligence powered by{" "}
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: "linear-gradient(135deg, hsl(90 52% 32%), hsl(75 55% 42%), hsl(48 65% 48%))"
            }}>community-owned compute</span>
            .
          </h1>

          <p className="text-sm md:text-base text-muted-foreground mb-5 max-w-xl leading-relaxed">
            Build the world's largest decentralized AI network where anyone can use AI, anyone can contribute compute, and every AI task is cryptographically verifiable on-chain.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" className="h-11 px-7 text-sm shadow-md" asChild>
              <Link href="/sign-in">Start Using AI</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-7 text-sm bg-background/60 backdrop-blur" asChild>
              <Link href="/contributors/compute">Become a Contributor</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-7 text-sm bg-background/60 backdrop-blur" asChild>
              <Link href="/guide">Read the Guide</Link>
            </Button>
          </div>
        </motion.div>

        {/* Carousel — full width below */}
        <motion.div
          className="z-10 w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="block md:hidden"><HeroCarousel compact /></div>
          <div className="hidden md:block"><HeroCarousel /></div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ─── Protocol Overview ─── */}
      <section className="py-24 px-6 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The Verifiable AI Pipeline</h2>
            <p className="text-lg text-muted-foreground">
              Verifo breaks the monopoly of centralized AI providers by connecting users directly to a global network of compute providers, with math ensuring no one can cheat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative">
            <div className="hidden lg:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-border -z-10 -translate-y-1/2">
              <div className="absolute inset-0 bg-primary/40 w-full animate-pulse opacity-60" />
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/12 text-primary flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. AI Users</h3>
              <p className="text-muted-foreground">
                Submit prompts and tasks via the web dashboard or developer API. Pay in USDC or credits.
              </p>
            </div>
            
            <div className="bg-card border-2 border-primary p-8 rounded-2xl shadow-md flex flex-col items-center text-center relative z-10 scale-105">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Verifo Protocol</h3>
              <p className="text-muted-foreground">
                Routes requests to the optimal node, handles payment escrow, and anchors cryptographic proofs to Solana.
              </p>
            </div>
            
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-6">
                <Server className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Contributors</h3>
              <p className="text-muted-foreground">
                Community-owned GPUs run the inference, verifiers check the math, and storage nodes hold the artifacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contributor Types ─── */}
      <section className="py-24 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Contribute and Earn</h2>
              <p className="text-lg text-muted-foreground">
                Monetize your idle hardware. No matter your system specs, there is a role for you in the Verifo network.
              </p>
            </div>
            <Link href="/contributors/rewards-reputation" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Learn about rewards <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Compute Contributors",
                icon: Server,
                role: "Run AI inference models and generate outputs for user requests.",
                hardware: "GPUs, Apple Silicon (M1+), High-end CPUs",
                rewards: "Highest yield, paid per completed inference task.",
                href: "/contributors/compute"
              },
              {
                title: "Verification Contributors",
                icon: Shield,
                role: "Validate outputs, check hashes, and sign cryptographic proofs.",
                hardware: "Any modern CPU, stable internet connection",
                rewards: "Consistent yield, paid per verification consensus.",
                href: "/contributors/verification"
              },
              {
                title: "Storage Contributors",
                icon: HardDrive,
                role: "Store encrypted model outputs, proofs, and network state.",
                hardware: "100GB+ SSD/HDD, high uptime",
                rewards: "Passive yield, paid per GB/month stored.",
                href: "/contributors/storage"
              }
            ].map((node) => (
              <Link key={node.title} href={node.href} className="group block">
                <div className="h-full border border-border bg-card hover:border-primary/60 transition-colors p-8 rounded-2xl">
                  <node.icon className="w-10 h-10 text-primary mb-6" />
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{node.title}</h3>
                  <p className="text-muted-foreground mb-6 h-12">{node.role}</p>
                  
                  <div className="space-y-3 pt-6 border-t border-border">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Hardware</span>
                      <span className="text-sm font-medium">{node.hardware}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Rewards</span>
                      <span className="text-sm font-medium">{node.rewards}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Capabilities ─── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Uncapped Capabilities</h2>
            <p className="text-lg text-muted-foreground">
              A single unified API and interface for the world's best open-source models, all running on decentralized infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Chat", icon: MessageSquare, desc: "Conversational AI for writing, analysis, and reasoning." },
              { title: "Coding", icon: Code, desc: "Code generation, debugging, and documentation." },
              { title: "Image Generation", icon: ImageIcon, desc: "High-fidelity text-to-image with diverse styles." },
              { title: "Video Generation", icon: Video, desc: "Short generative video clips from text prompts." },
              { title: "Research", icon: Search, desc: "Deep web research with verified cited sources." },
              { title: "Translation", icon: Globe, desc: "High-accuracy translation across 100+ languages." },
              { title: "Voice AI", icon: Mic, desc: "Text-to-speech and advanced speech recognition." },
              { title: "AI Agents", icon: Bot, desc: "Autonomous agents completing multi-step tasks." },
              { title: "Developer API", icon: Terminal, desc: "Full programmatic access for your own applications." },
            ].map((cap) => (
              <div key={cap.title} className="p-6 rounded-xl border border-border bg-card/70 flex items-start gap-4 hover:border-primary/40 transition-colors">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0">
                  <cap.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-foreground">{cap.title}</h4>
                  <p className="text-sm text-muted-foreground">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── On-Chain Proof ─── */}
      <section className="py-24 px-6 bg-card border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Cryptographic Certainty</h2>
            <p className="text-lg text-muted-foreground mb-6">
              When you rely on a centralized provider, you trust their black box. With Verifo, every single task generates a cryptographic proof anchored on the Solana blockchain.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Lock className="w-3 h-3" />
                </div>
                <span className="text-foreground"><strong>Tamper-evident:</strong> If the model output is altered by even one byte, the proof fails verification.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Globe className="w-3 h-3" />
                </div>
                <span className="text-foreground"><strong>Immutable History:</strong> Your entire AI interaction history is anchored permanently.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Shield className="w-3 h-3" />
                </div>
                <span className="text-foreground"><strong>Privacy First:</strong> By default, only hashes are anchored on-chain. Your raw prompts remain private.</span>
              </li>
            </ul>
            <Button asChild variant="outline">
              <Link href="/platform/on-chain-proof">Read the Proof Spec</Link>
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-primary rounded-2xl blur opacity-15" />
            <div className="relative border border-border/30 rounded-2xl p-6 font-mono text-sm shadow-2xl overflow-x-auto"
              style={{ backgroundColor: "hsl(28 40% 9%)" }}>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <span className="ml-2 text-white/40">proof_record.json</span>
              </div>
              <pre className="text-white/75 leading-relaxed">
<span className="text-amber-300">"proof_id"</span>: <span className="text-green-400">"prf_8xj92nf73ks290d"</span>,<br/>
<span className="text-amber-300">"timestamp"</span>: <span className="text-orange-300">1715429811</span>,<br/>
<span className="text-amber-300">"model_identifier"</span>: <span className="text-green-400">"meta-llama/Llama-3-70b-instruct"</span>,<br/>
<span className="text-amber-300">"hashes"</span>: {'{'}<br/>
&nbsp;&nbsp;<span className="text-amber-300">"prompt_hash_sha256"</span>: <span className="text-green-400">"e3b0c44298fc1c149afbf4c8996fb..."</span>,<br/>
&nbsp;&nbsp;<span className="text-amber-300">"output_hash_sha256"</span>: <span className="text-green-400">"8f434346648f6b96df89dda901c51..."</span><br/>
{'}'},<br/>
<span className="text-amber-300">"attestation"</span>: {'{'}<br/>
&nbsp;&nbsp;<span className="text-amber-300">"compute_node_wallet"</span>: <span className="text-green-400">"7Z1...9Xp"</span>,<br/>
&nbsp;&nbsp;<span className="text-amber-300">"node_signature"</span>: <span className="text-green-400">"sig_39fjd82..."</span>,<br/>
&nbsp;&nbsp;<span className="text-amber-300">"verification_consensus"</span>: <span className="text-lime-400">true</span><br/>
{'}'},<br/>
<span className="text-amber-300">"solana_transaction_id"</span>: <span className="text-green-400">"5xJ..."</span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Roadmap Preview ─── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Protocol Roadmap</h2>
            <p className="text-lg text-muted-foreground">Building the foundation for open artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { phase: "Phase 1", title: "Compute Launch", status: "Active", active: true },
              { phase: "Phase 2", title: "Verifiers & API", status: "In Progress", active: false },
              { phase: "Phase 3", title: "Storage & Agents", status: "Upcoming", active: false },
              { phase: "Phase 4", title: "Full Decentralization", status: "Planned", active: false },
            ].map((p) => (
              <div key={p.phase} className={cn("p-6 rounded-xl border", p.active ? "border-primary bg-primary/8" : "border-border bg-card")}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold tracking-wider uppercase text-muted-foreground">{p.phase}</span>
                  {p.active && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground uppercase tracking-widest">Active</span>}
                </div>
                <h3 className={cn("text-lg font-bold mb-2", p.active ? "text-primary" : "text-foreground")}>{p.title}</h3>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", p.active ? "bg-primary w-1/2" : "w-0")} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/ecosystem/roadmap" className="text-primary hover:underline font-medium inline-flex items-center gap-1">View full roadmap <ChevronRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
          <div className="p-12 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border bg-card">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Build the Future</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Start using verifiable AI models today via our web dashboard or API. No vendor lock-in.
            </p>
            <div>
              <Button size="lg" className="h-12 px-8 shadow-md" asChild>
                <Link href="/sign-up">Start using AI today</Link>
              </Button>
            </div>
          </div>
          
          <div className="p-12 md:p-24 flex flex-col justify-center bg-muted/40">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Power the Network</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Provide compute, verification, or storage to the network. Earn USDC directly to your Solana wallet.
            </p>
            <div>
              <Button size="lg" variant="outline" className="h-12 px-8 bg-background" asChild>
                <Link href="/contributors/compute">Run a node, earn rewards</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
}
