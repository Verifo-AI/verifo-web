import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  UserPlus,
  Wallet,
  Send,
  ShieldCheck,
  CreditCard,
  Eye,
  Lock,
  ServerCog,
  Smartphone,
  Laptop,
  Globe,
  Terminal,
  Cpu,
  Radio,
  KeyRound,
  PauseCircle,
  ShieldAlert,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Clock,
  Users,
  Gauge,
  ClipboardCheck,
  Coins,
} from "lucide-react";
import type { ReactNode } from "react";

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14">
      <span className="text-xs font-semibold tracking-wider text-primary uppercase">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">{title}</h2>
      <p className="text-muted-foreground text-base sm:text-lg">{subtitle}</p>
    </div>
  );
}

function PipelineDiagram({
  steps,
}: {
  steps: { icon: typeof Rocket; label: string; detail: string }[];
}) {
  return (
    <div className="not-prose flex flex-col lg:flex-row items-stretch justify-center gap-2 lg:gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-col lg:flex-row items-center">
          <div className="flex flex-col items-center text-center w-full lg:w-40 px-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <step.icon className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-semibold">{step.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{step.detail}</p>
          </div>
          {i < steps.length - 1 && (
            <div className="flex items-center justify-center py-2 lg:py-0 lg:px-1 shrink-0">
              <ArrowDown className="w-4 h-4 text-muted-foreground/50 lg:hidden" />
              <ArrowRight className="w-4 h-4 text-muted-foreground/50 hidden lg:block" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BrowserFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="not-prose rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <p className="text-xs text-muted-foreground ml-2 font-medium">{title}</p>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function NumberedStep({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center mt-0.5">
        {number}
      </div>
      <div className="flex-1 pb-8 border-l border-border pl-6 -ml-4">
        <p className="font-semibold mb-1.5">{title}</p>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function Callout({
  icon: Icon,
  tone,
  title,
  children,
}: {
  icon: typeof ShieldAlert;
  tone: "amber" | "destructive";
  title: string;
  children: ReactNode;
}) {
  const toneClasses =
    tone === "amber"
      ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
      : "bg-destructive/10 border-destructive/30 text-destructive";
  const iconTone = tone === "amber" ? "text-amber-600 dark:text-amber-400" : "text-destructive";
  return (
    <div className={`not-prose p-4 rounded-xl border flex gap-3 ${toneClasses}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconTone}`} />
      <div className="text-sm leading-relaxed">
        <span className="font-semibold">{title}. </span>
        {children}
      </div>
    </div>
  );
}

export default function Guide() {
  return (
    <Layout>
      <div className="min-h-screen pt-16">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Complete Guide
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-4 mb-5">
            How Verifo Works, Step by Step
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            One guide, two audiences. If you want to run AI tasks with cryptographic proof, read the
            first half. If you want to earn USDC by contributing your device, read the second half.
            Every step below, including fallback behavior, matches exactly what the product does.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button asChild size="lg">
              <a href="#for-ai-users">
                For AI Users <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#for-contributors">
                For Contributors <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
        </section>

        {/* ============ FOR AI USERS ============ */}
        <section id="for-ai-users" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <SectionHeader
            eyebrow="Part One"
            title="For AI Users"
            subtitle="Submit AI tasks to a decentralized network and get a signed, on-chain proof for every result."
          />

          <div className="mb-16">
            <PipelineDiagram
              steps={[
                { icon: UserPlus, label: "Create Account", detail: "Wallet or email, 100 free credits" },
                { icon: CreditCard, label: "Hold Credits", detail: "Top up with USDC anytime" },
                { icon: Send, label: "Submit a Task", detail: "Chat, code, image, or video" },
                { icon: ServerCog, label: "Network Executes", detail: "Routed to a live contributor node" },
                { icon: ShieldCheck, label: "Verified Result", detail: "Signed proof anchored on Solana" },
              ]}
            />
          </div>

          <div className="space-y-2 max-w-3xl mx-auto mb-16">
            <NumberedStep number={1} title="Create an account">
              <p>
                Sign up with a Solana wallet (Phantom, Solflare, Backpack) for instant on-chain identity,
                or with email and password, which automatically provisions a non-custodial wallet in the
                background so proofs can still be anchored on your behalf.
              </p>
              <p>Every new account receives 100 free inference credits, no card required.</p>
            </NumberedStep>

            <NumberedStep number={2} title="Choose a privacy mode">
              <p>
                Privacy is selected per task, not locked account-wide. This decides what gets written on
                chain.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <Lock className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold">Private (default)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only a SHA-256 hash of the prompt and output is anchored. Raw content stays off chain.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <Eye className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold">Public</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Prompt and output are stored in plaintext on chain, for open audits and research.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold">Enterprise</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Zero-knowledge execution inside a secure hardware enclave. Data is decrypted only
                    inside the enclave.
                  </p>
                </div>
              </div>
            </NumberedStep>

            <NumberedStep number={3} title="Submit a task from the dashboard">
              <p>
                Pick a task type (chat, coding, image generation, translation) and a model, then submit.
                The dashboard also accepts a keyboard shortcut to submit without leaving the input field.
              </p>
              <p>
                The task is routed to a live contributor node on the network. The response streams in
                with a status label that starts as processing, then flips to verified once the
                cryptographic proof is anchored.
              </p>
            </NumberedStep>

            <NumberedStep number={4} title="Check the proof for any task">
              <p>
                Every task appears in a chronological history with its type, timestamp, model, and proof
                status. Opening a task shows the raw proof data, the contributor node's wallet address,
                its digital signature, and a direct link to view the transaction on Solscan or SolanaFM.
              </p>
              <p>
                A public link can be generated for any task. In private mode, that link only exposes the
                hash unless the plaintext is explicitly revealed.
              </p>
            </NumberedStep>

            <NumberedStep number={5} title="Top up credits when needed">
              <p>Credits are model-agnostic and purchased with USDC on Solana.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {[
                  { name: "Starter", price: "$1", credits: "100 credits" },
                  { name: "Pro", price: "$4", credits: "500 credits" },
                  { name: "Builder", price: "$14", credits: "2,000 credits" },
                  { name: "Enterprise", price: "$60", credits: "10,000 credits" },
                ].map((p) => (
                  <div key={p.name} className="p-3 rounded-xl border border-border bg-card text-center">
                    <p className="text-xs font-semibold">{p.name}</p>
                    <p className="text-lg font-bold mt-1">{p.price}</p>
                    <p className="text-xs text-muted-foreground">{p.credits}</p>
                  </div>
                ))}
              </div>
            </NumberedStep>
          </div>

          {/* Mock dashboard visual */}
          <div className="max-w-3xl mx-auto mb-8">
            <BrowserFrame title="dashboard.verifo.app">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground">Credit balance</p>
                  <p className="text-2xl font-bold">1,248 credits</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                  + Top Up
                </div>
              </div>
              <div className="rounded-xl border border-border p-4 mb-3">
                <p className="text-xs text-muted-foreground mb-2">AI Playground, task type: Chat</p>
                <div className="h-9 rounded-lg bg-muted/60 border border-border" />
              </div>
              <div className="rounded-xl border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Last task, Llama 3 70B</p>
                  <p className="text-xs text-muted-foreground">3 credits used</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </div>
              </div>
            </BrowserFrame>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Illustrative diagram of the AI user dashboard layout.
            </p>
          </div>

          <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Ready to run your first task?</p>
              <p className="text-sm text-muted-foreground">Sign up and get 100 free credits instantly.</p>
            </div>
            <Button asChild>
              <Link href="/users/getting-started" className="gap-2">
                Start Using Verifo <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-border" />
        </div>

        {/* ============ FOR CONTRIBUTORS ============ */}
        <section id="for-contributors" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <SectionHeader
            eyebrow="Part Two"
            title="For Contributors"
            subtitle="Register your device once. The wizard detects your hardware, classifies it, and only asks you to choose how you contribute."
          />

          <div className="mb-16">
            <PipelineDiagram
              steps={[
                { icon: Gauge, label: "Detect Device", detail: "RAM, GPU, device type" },
                { icon: ClipboardCheck, label: "Classify Tier", detail: "Compute, Relay, or Witness" },
                { icon: Globe, label: "Choose Mode", detail: "Browser or CLI" },
                { icon: Wallet, label: "Add Wallet", detail: "Where rewards are paid" },
                { icon: Coins, label: "Start Earning", detail: "Automatic USDC payouts" },
              ]}
            />
          </div>

          {/* Step 0 detection */}
          <div className="max-w-4xl mx-auto mb-14">
            <h3 className="text-xl font-bold mb-2">Step 1, Device detection</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Nothing is self-reported. The wizard reads hardware signals directly from the device before
              anything else happens.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-5 rounded-xl border border-border bg-card">
                <Smartphone className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">Device type</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mobile versus desktop, detected from the browser's user agent and touch support.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <Gauge className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">RAM</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Read from the browser where available, capped at 8GB by the browser itself.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <Cpu className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">GPU</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Read from the WebGL renderer string. Software renderers are treated as no GPU.
                </p>
              </div>
            </div>
            <Callout icon={ShieldAlert} tone="amber" title="Fallback, RAM cannot be read">
              Safari, iOS, and Firefox do not expose exact device memory. The wizard falls back to a
              conservative estimate based on device type and CPU core count. This estimate is only used
              for the preview screen, it can never place a device into the top reward tier by guesswork.
            </Callout>
          </div>

          {/* Tiers */}
          <div className="max-w-4xl mx-auto mb-14">
            <h3 className="text-xl font-bold mb-2">Step 2, Tier classification</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              The same hardware always maps to the same tier, on both the client and the server, and the
              server has final say.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-5 rounded-xl border border-border bg-card">
                <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="font-semibold text-sm">Compute Node</p>
                <p className="text-xs text-muted-foreground mt-1">
                  More than 7GB RAM. Runs AI inference directly. Up to 8 USDC per day.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                <p className="font-semibold text-sm">Relay Node</p>
                <p className="text-xs text-muted-foreground mt-1">
                  3 to 7GB RAM. Forwards tasks without running inference. Up to 3 USDC per day.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <Eye className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                <p className="font-semibold text-sm">Witness Node</p>
                <p className="text-xs text-muted-foreground mt-1">
                  2GB RAM or less. Earns by proving honest uptime. Up to about 0.26 USDC per day.
                </p>
              </div>
            </div>
            <Callout icon={ShieldAlert} tone="amber" title="Fallback, RAM totally undetectable">
              If even the estimate cannot be produced, registration defaults the node to Relay, never
              Compute. A device that cannot be verified is never trusted with the top tier by default.
            </Callout>
          </div>

          {/* Browser vs CLI */}
          <div className="max-w-4xl mx-auto mb-14">
            <h3 className="text-xl font-bold mb-2">Step 3, Browser Mode or CLI Mode</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              This is the only real choice a contributor makes, and it branches by device.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-5 rounded-xl border border-border bg-card">
                <Smartphone className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="font-semibold text-sm mb-1">On mobile</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No choice is shown. The wizard auto-selects Browser Mode, since a phone cannot run the
                  desktop node client. A notice explains that the tab needs to stay open.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <Laptop className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="font-semibold text-sm mb-1">On desktop or laptop</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Both modes are shown side by side. If the device qualifies as Compute tier, CLI Mode is
                  labeled Recommended, with a note that Browser Mode reduces the reward rate.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/10">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <p className="font-semibold text-sm">Browser Mode</p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                  <li>No install, nothing to download.</li>
                  <li>Works on phones and low-end laptops.</li>
                  <li>Only earns while the tab is open and focused.</li>
                  <li>Reward multiplier is 0.4 times the CLI rate.</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-5 h-5 text-foreground" />
                  <p className="font-semibold text-sm">CLI Mode</p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                  <li>Runs a small client on your own machine.</li>
                  <li>Requires a desktop, laptop, or server.</li>
                  <li>Runs continuously, independent of any browser tab.</li>
                  <li>Full reward rate, with no multiplier.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Wallet + confirm */}
          <div className="max-w-4xl mx-auto mb-14 space-y-2">
            <h3 className="text-xl font-bold mb-4">Step 4, Wallet, confirmation, and registration</h3>
            <NumberedStep number={1} title="Add a wallet address">
              <p>
                A Solana wallet address is where rewards get paid. Nothing is sent on chain at this step,
                it is only stored against the node record.
              </p>
            </NumberedStep>
            <NumberedStep number={2} title="Review and confirm">
              <p>
                The summary shows the detected hardware, the assigned tier, the chosen mode, and the
                effective reward for that exact combination, before anything is submitted.
              </p>
            </NumberedStep>
            <NumberedStep number={3} title="What happens after confirming">
              <p>
                The node record is created as unverified and pending. From here, the two modes diverge.
              </p>
            </NumberedStep>
          </div>

          {/* Two diverging flows */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
            <div className="p-6 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/10">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <p className="font-semibold">Browser Mode, fully automatic</p>
              </div>
              <ol className="text-sm text-muted-foreground space-y-3 list-decimal pl-4">
                <li>A signing key is generated in the browser tab and stored locally on that device.</li>
                <li>The app links itself to the account automatically. The node becomes verified and active.</li>
                <li>A heartbeat is sent every 25 seconds, signed with that key, while the tab is open.</li>
              </ol>
              <div className="mt-4 space-y-3">
                <Callout icon={PauseCircle} tone="amber" title="Fallback, tab hidden or closed">
                  If the tab is backgrounded, the heartbeat pauses and the dashboard shows contribution
                  paused. It resumes the instant the tab is focused again. Closing the tab simply stops
                  the heartbeat, with no penalty beyond not earning while inactive.
                </Callout>
                <Callout icon={ShieldAlert} tone="destructive" title="Fallback, signing key missing">
                  If browser storage is cleared, or the dashboard is opened from a different browser, there
                  is no key to sign with. The dashboard shows a clear error instead of failing silently.
                </Callout>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-foreground" />
                <p className="font-semibold">CLI Mode, one manual step remains</p>
              </div>
              <ol className="text-sm text-muted-foreground space-y-3 list-decimal pl-4">
                <li>Download the node client for the chosen operating system from the dashboard.</li>
                <li>Generate a pairing code, a one-time token valid for 10 minutes.</li>
                <li>Run the link command with that code on your machine. This is the moment the node becomes verified and active, using real hardware numbers instead of a browser estimate.</li>
                <li>Run the start command to begin the client's own heartbeat and task loop.</li>
              </ol>
              <div className="mt-4">
                <Callout icon={KeyRound} tone="amber" title="Fallback, pairing code expired">
                  If the code is used after 10 minutes, the server rejects it and the dashboard lets the
                  user generate a fresh one. There is no need to register again from scratch.
                </Callout>
              </div>
            </div>
          </div>

          {/* Mock node dashboard visual */}
          <div className="max-w-3xl mx-auto mb-14">
            <BrowserFrame title="dashboard.verifo.app / contribute">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground">Node status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-lg font-bold">Online</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-muted text-xs font-semibold">Compute Tier</span>
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">CLI Mode</span>
                </div>
              </div>
              <div className="rounded-xl border border-border p-4 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Last heartbeat, 8 seconds ago
                </div>
                <span className="text-xs text-muted-foreground">Uptime 99.2 percent</span>
              </div>
              <div className="rounded-xl border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Today's earnings</p>
                  <p className="text-xs text-muted-foreground">Paid automatically in USDC</p>
                </div>
                <p className="text-lg font-bold">6.40 USDC</p>
              </div>
            </BrowserFrame>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Illustrative diagram of the contributor dashboard layout.
            </p>
          </div>

          {/* Reputation / payouts */}
          <div className="max-w-4xl mx-auto mb-14">
            <h3 className="text-xl font-bold mb-2">What the system enforces after linking</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div className="p-5 rounded-xl border border-border bg-card">
                <ShieldCheck className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">Signed proofs, not claims</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Every heartbeat and task result is signed with the node's private key and verified on the
                  server before it counts.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <Users className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">Trust score</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Uptime, success rate, latency, and completed task volume determine which tasks a node is
                  offered, and how much they pay.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <KeyRound className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">Identity cannot be hijacked</p>
                <p className="text-xs text-muted-foreground mt-1">
                  A key generated on one device can never be reused to take over a different account's
                  node.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <Coins className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">Automatic USDC payouts</p>
                <p className="text-xs text-muted-foreground mt-1">
                  No manual withdrawals or minimum thresholds. Rewards settle directly to the connected
                  wallet in regular batches.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Ready to register your device?</p>
              <p className="text-sm text-muted-foreground">The wizard runs this exact flow automatically.</p>
            </div>
            <Button asChild>
              <Link href="/contributors/register" className="gap-2">
                Start Contributing <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
