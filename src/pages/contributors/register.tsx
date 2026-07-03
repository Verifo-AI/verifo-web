import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import {
  Cpu,
  Radio,
  Eye,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  Wallet,
  Monitor,
  AlertCircle,
  AppWindow,
  Smartphone,
  Laptop,
} from "lucide-react";
import { SiLinux, SiApple } from "react-icons/si";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiPost, ApiError } from "@/lib/api";
import { linkBrowserNode } from "@/lib/browserNode";
import { Globe, Terminal } from "lucide-react";

type ContributionMode = "compute" | "relay" | "witness";

const CONTRIBUTION_MODE_INFO: Record<
  ContributionMode,
  { label: string; icon: typeof Cpu; description: string; earnings: string; tag: string; tagColor: string }
> = {
  compute: {
    label: "Compute Node",
    icon: Cpu,
    description: "Your device has enough RAM to run AI inference workloads directly.",
    earnings: "Up to 8 USDC/day",
    tag: "Most Rewarding",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  relay: {
    label: "Relay Node",
    icon: Radio,
    description: "Your device forwards AI tasks to more powerful nodes and verifies delivery — it won't run inference itself.",
    earnings: "Up to 3 USDC/day",
    tag: "Balanced",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  witness: {
    label: "Witness Node",
    icon: Eye,
    description: "Your device is too light for AI or relay work, but you can still earn by proving honest, verified uptime.",
    earnings: "Up to ~0.26 USDC/day",
    tag: "Low Hardware",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
};

// Mirrors the thresholds in artifacts/api-server/src/lib/contributionMode.ts —
// used only for an instant local preview while the /contributors/detect-mode
// call is in flight. The server-side classification is always the one that
// actually gets stored, so this can never be gamed from the client.
function previewClassify(ramGb: number | null): ContributionMode {
  if (ramGb == null || ramGb <= 2) return "witness";
  if (ramGb <= 7) return "relay";
  return "compute";
}

type DeviceProfile = {
  ramGb: number | null;
  gpu: string | null;
  isMobile: boolean;
  cpuCores: number | null;
};

function detectDeviceProfile(): DeviceProfile {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const isMobile =
    /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 2 && /Mac/i.test(navigator.platform ?? ""));

  const deviceMemory =
    typeof navigator !== "undefined" ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory : undefined;
  const cpuCores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? null : null;

  let gpu: string | null = null;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (gl) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      if (info) {
        const renderer = gl.getParameter(info.UNMASKED_RENDERER_WEBGL) as string;
        if (renderer && !/swiftshader|software|llvmpipe/i.test(renderer)) {
          gpu = renderer;
        }
      }
    }
  } catch {
    gpu = null;
  }

  // navigator.deviceMemory is the most trustworthy signal where it exists
  // (Chrome/Edge, capped at 8GB). Safari/iOS/Firefox don't expose it, so we
  // fall back to a conservative estimate: mobile devices default low, and
  // desktops use core count as a rough proxy. This is always just a
  // registration-time estimate — real verification happens once the CLI
  // node client reports actual hardware.
  let ramGb: number | null = null;
  if (typeof deviceMemory === "number") {
    ramGb = deviceMemory;
  } else if (isMobile) {
    ramGb = 3;
  } else if (typeof cpuCores === "number") {
    ramGb = cpuCores >= 8 ? 16 : cpuCores >= 4 ? 8 : 4;
  }

  return { ramGb, gpu, isMobile, cpuCores };
}

const OS_OPTIONS = [
  { value: "linux", label: "Linux (Ubuntu/Debian)", icon: SiLinux },
  { value: "windows", label: "Windows 10/11", icon: AppWindow },
  { value: "macos", label: "macOS (Apple Silicon)", icon: SiApple },
];

type ClientMode = "browser" | "cli";

const STEPS = ["Device", "Contribution Mode", "Wallet", "Confirm"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all",
                i < current
                  ? "bg-primary border-primary text-primary-foreground"
                  : i === current
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground bg-background"
              )}
            >
              {i < current ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:block",
                i === current ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-8 sm:w-16 mb-4 transition-colors",
                i < current ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Step1({
  detecting,
  profile,
  mode,
  detectError,
}: {
  detecting: boolean;
  profile: DeviceProfile | null;
  mode: ContributionMode;
  detectError: boolean;
}) {
  const info = CONTRIBUTION_MODE_INFO[mode];
  const DeviceIcon = profile?.isMobile ? Smartphone : Laptop;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">We detected your device</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Verifo automatically classifies your contribution role from your actual browser-reported hardware —
        no guessing your GPU model required.
      </p>

      {detecting ? (
        <div className="flex items-center justify-center gap-3 p-10 text-muted-foreground text-sm">
          <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
          Detecting your device…
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
            <div className="p-2 rounded-lg bg-muted text-muted-foreground">
              <DeviceIcon className="w-5 h-5" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{profile?.isMobile ? "Mobile device" : "Desktop / laptop"}</p>
              <p className="text-muted-foreground">
                ~{profile?.ramGb ?? "?"} GB RAM (estimated)
                {profile?.gpu ? ` · ${profile.gpu}` : " · no dedicated GPU detected"}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border-2 border-primary bg-primary/5 flex gap-4 items-start">
            <div className="p-2.5 rounded-lg shrink-0 bg-primary text-primary-foreground">
              <info.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold">{info.label}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", info.tagColor)}>{info.tag}</span>
              </div>
              <p className="text-sm text-muted-foreground">{info.description}</p>
              <p className="text-xs font-semibold text-primary mt-2">{info.earnings}</p>
            </div>
          </div>

          {detectError && (
            <div className="flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Couldn't reach the classification service, so this is a local estimate. It will be re-checked when you register.</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            This is an estimate based on what your browser reports. It's rechecked at registration, and superseded by
            real, verified numbers once you run the Verifo node client on this device.
          </p>
        </div>
      )}
    </div>
  );
}

function Step2({
  profile,
  contributionMode,
  clientMode,
  onClientModeChange,
  os,
  onOsChange,
}: {
  profile: DeviceProfile | null;
  contributionMode: ContributionMode;
  clientMode: ClientMode;
  onClientModeChange: (v: ClientMode) => void;
  os: string;
  onOsChange: (v: string) => void;
}) {
  // Mobile devices can never run the Node.js CLI, so there is nothing to
  // choose — Browser Mode is the only real option, and we say so plainly
  // instead of pretending there's a decision to make.
  if (profile?.isMobile) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-2">How you'll contribute</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Phones can't run the Verifo node client, so you'll contribute in <strong>Browser Mode</strong> — no install
          needed.
        </p>
        <div className="p-5 rounded-xl border-2 border-primary bg-primary/5 flex gap-4 items-start mb-4">
          <div className="p-2.5 rounded-lg shrink-0 bg-primary text-primary-foreground">
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-semibold">Browser Mode</span>
            <p className="text-sm text-muted-foreground mt-1">
              Runs entirely from this browser tab — nothing to download or install.
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Keep this tab open to keep earning. Closing the tab or locking your phone for a while pauses your
            contribution — it resumes automatically as soon as you reopen it. Reward rate is lower than CLI Mode
            because of this.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">How you'll contribute</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Choose how this device runs the Verifo node — you can change this later from the dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onClientModeChange("browser")}
          className={cn(
            "flex flex-col gap-2 p-4 rounded-xl border-2 transition-all text-left",
            clientMode === "browser" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
          )}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">Browser Mode</span>
          </div>
          <p className="text-xs text-muted-foreground">No install. Runs while this tab stays open.</p>
          <p className="text-xs font-medium text-muted-foreground">Lower reward</p>
        </button>

        <button
          onClick={() => onClientModeChange("cli")}
          className={cn(
            "flex flex-col gap-2 p-4 rounded-xl border-2 transition-all text-left",
            clientMode === "cli" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
          )}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">CLI Mode</span>
            {contributionMode === "compute" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                Recommended
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Install the node client. Runs 24/7, independent of your browser.</p>
          <p className="text-xs font-medium text-primary">Higher reward</p>
        </button>
      </div>

      {clientMode === "browser" && contributionMode === "compute" && (
        <div className="flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Your hardware qualifies for Compute Node — the highest reward tier. Compute mode can only run through the
            CLI client. Choosing Browser Mode here will register you as a Relay/Witness node instead, at the lower
            Browser Mode rate.
          </span>
        </div>
      )}

      {clientMode === "browser" && contributionMode !== "compute" && (
        <div className="flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Keep this tab open to keep earning. Closing it pauses your contribution until you reopen it.</span>
        </div>
      )}

      {clientMode === "cli" && (
        <div>
          <p className="text-sm font-semibold mb-3">Operating system</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {OS_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => onOsChange(o.value)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                  os === o.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <o.icon className="w-6 h-6 shrink-0" />
                <span className="text-sm font-medium">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Step3({
  wallet,
  onChange,
}: {
  wallet: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Connect your Solana wallet</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Enter your Solana wallet address. This is where your USDC rewards will be sent.
      </p>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-300">
          <p className="font-semibold mb-1">Use a dedicated rewards wallet</p>
          <p>We recommend using a fresh Solana wallet for node rewards, not your primary holdings wallet.</p>
        </div>
      </div>

      <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
        Solana Wallet Address
      </label>
      <div className="relative">
        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={wallet}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. 7xKX..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        A valid Solana address is 32–44 characters. For testing, any non-empty value is accepted.
        Pre-filled with your connected wallet — edit it if you'd like rewards sent elsewhere.
      </p>
    </div>
  );
}

function Step4({
  mode,
  clientMode,
  profile,
  os,
  wallet,
}: {
  mode: ContributionMode;
  clientMode: ClientMode;
  profile: DeviceProfile | null;
  os: string;
  wallet: string;
}) {
  const osInfo = OS_OPTIONS.find((o) => o.value === os);
  const effectiveMode = clientMode === "browser" && mode === "compute" ? "relay" : mode;
  const effectiveInfo = CONTRIBUTION_MODE_INFO[effectiveMode];

  const rows = [
    {
      label: "How",
      value: clientMode === "browser" ? "Browser Mode (no install)" : "CLI Mode (node client)",
      icon: clientMode === "browser" ? <Globe className="w-4 h-4" /> : <Terminal className="w-4 h-4" />,
    },
    { label: "Contribution", value: effectiveInfo.label, icon: <effectiveInfo.icon className="w-4 h-4" /> },
    {
      label: "Detected",
      value: `~${profile?.ramGb ?? "?"} GB RAM${profile?.gpu ? ` · ${profile.gpu}` : ""}`,
      icon: <Shield className="w-4 h-4" />,
    },
    ...(clientMode === "cli" ? [{ label: "OS", value: osInfo?.label ?? os, icon: <Monitor className="w-4 h-4" /> }] : []),
    { label: "Wallet", value: `${wallet.slice(0, 8)}...${wallet.slice(-6)}`, icon: <Wallet className="w-4 h-4" /> },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Confirm registration</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Review your node configuration before registering.
      </p>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={cn("flex items-center gap-3 px-5 py-4", i < rows.length - 1 && "border-b border-border")}
          >
            <span className="text-muted-foreground shrink-0">{r.icon}</span>
            <span className="text-sm text-muted-foreground w-24 shrink-0">{r.label}</span>
            <span className="text-sm font-medium text-foreground">{r.value}</span>
          </div>
        ))}
      </div>

      {clientMode === "browser" ? (
        <p className="text-xs text-muted-foreground">
          By registering, you agree to keep this tab open while contributing. Reward accrues only while the tab is
          open and focused, at the Browser Mode rate. You can switch to CLI Mode later from your dashboard for a
          higher reward.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          By registering, you agree to run your node according to the Verifo contributor guidelines. You'll get a
          pairing code and download link for the node client on the next screen.
        </p>
      )}
    </div>
  );
}

export default function ContributorRegister() {
  const { isSignedIn, user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [os, setOs] = useState("");
  const [wallet, setWallet] = useState(user?.walletAddress ?? "");
  const [clientMode, setClientMode] = useState<ClientMode | null>(null);

  const [detecting, setDetecting] = useState(true);
  const [profile, setProfile] = useState<DeviceProfile | null>(null);
  const [mode, setMode] = useState<ContributionMode>("relay");
  const [detectError, setDetectError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const detected = detectDeviceProfile();
    setProfile(detected);
    setMode(previewClassify(detected.ramGb));
    // Mobile devices literally cannot run the CLI, so there's no real choice
    // to make — pre-select Browser Mode instead of asking a question with
    // only one honest answer.
    if (detected.isMobile) setClientMode("browser");

    if (detected.ramGb == null) {
      setDetecting(false);
      return;
    }

    apiPost("/contributors/detect-mode", { ramGb: detected.ramGb, gpu: detected.gpu })
      .then((data: { contributionMode: ContributionMode }) => {
        if (!cancelled) setMode(data.contributionMode);
      })
      .catch(() => {
        if (!cancelled) setDetectError(true);
      })
      .finally(() => {
        if (!cancelled) setDetecting(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const canNext = [
    !detecting,
    profile?.isMobile ? true : clientMode === "browser" || (clientMode === "cli" && !!os),
    wallet.length >= 8,
    true,
  ][step];

  const registerMutation = useMutation({
    mutationFn: async () => {
      const node = await apiPost("/contributors/register", {
        os: clientMode === "browser" ? "browser" : os,
        walletAddress: wallet,
        ramGb: profile?.ramGb ?? null,
        gpu: profile?.gpu ?? null,
        hardwareNote: profile
          ? `${profile.isMobile ? "Mobile" : "Desktop"} · ~${profile.ramGb ?? "?"}GB RAM${profile.gpu ? ` · ${profile.gpu}` : ""}`
          : "",
      });
      // Browser Mode has no separate CLI to pair with, so we self-link right
      // here using a key generated in this tab — same /nodes/link endpoint
      // the CLI uses, just called automatically instead of manually.
      if (clientMode === "browser") {
        await linkBrowserNode();
      }
      return node;
    },
    onSuccess: () => navigate("/contributors/dashboard"),
  });

  function handleNext() {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      registerMutation.mutate();
    }
  }

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mt-4 mb-2">Become a Contributor</h1>
            <p className="text-muted-foreground">
              Register your node and start earning USDC rewards on the Verifo network.
            </p>
            <Link href="/guide" className="text-sm text-primary hover:underline mt-2 inline-block">
              Not sure how this works? Read the full guide
            </Link>
          </div>

          {!isSignedIn && (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">Sign in to register</h2>
              <p className="text-muted-foreground text-sm mb-6">
                You need a Verifo account to register your node and track your rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/sign-in?redirect=/contributors/register">Connect Wallet</Link>
                </Button>
              </div>
            </div>
          )}

          {isSignedIn && (
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <StepIndicator current={step} />

              {step === 0 && (
                <Step1 detecting={detecting} profile={profile} mode={mode} detectError={detectError} />
              )}
              {step === 1 && (
                <Step2
                  profile={profile}
                  contributionMode={mode}
                  clientMode={clientMode ?? "cli"}
                  onClientModeChange={setClientMode}
                  os={os}
                  onOsChange={setOs}
                />
              )}
              {step === 2 && <Step3 wallet={wallet} onChange={setWallet} />}
              {step === 3 && (
                <Step4 mode={mode} clientMode={clientMode ?? "cli"} profile={profile} os={os} wallet={wallet} />
              )}

              {registerMutation.isError && (
                <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">
                    {(registerMutation.error as ApiError)?.message === "Node already registered for this account"
                      ? "You already have a node registered. Visit your contributor dashboard."
                      : "Registration failed. Please try again."}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canNext || registerMutation.isPending}
                  className="gap-1 min-w-32"
                >
                  {registerMutation.isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering…
                    </>
                  ) : step === 3 ? (
                    <>
                      <Check className="w-4 h-4" />
                      Register Node
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
