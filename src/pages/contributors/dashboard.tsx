import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet, apiPost, API_BASE, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";
import {
  Sun,
  Moon,
  Clock,
  LogOut,
  Cpu,
  Shield,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Download,
  LayoutDashboard,
  Wallet,
  Award,
  Activity,
  ExternalLink,
  TrendingUp,
  RefreshCw,
  Zap,
  Server,
  Copy,
  Check,
  KeyRound,
  Radio,
  Eye,
  Globe,
  Terminal,
  PauseCircle,
} from "lucide-react";
import { useBrowserNodeStatus } from "@/contexts/BrowserNodeContext";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const EARNINGS_REFETCH_INTERVAL_MS = 30_000;

type EarningsDay = { date: string; label: string; vrfEarned: number };

function EarningsChart() {
  const todayStr = new Date().toISOString().split("T")[0]!;

  const { data, isFetching, dataUpdatedAt } = useQuery<{
    days: EarningsDay[];
    totalVrf: number;
    periodDays: number;
  }>({
    queryKey: ["node-earnings"],
    queryFn: () => apiGet("/nodes/earnings?days=7"),
    refetchInterval: EARNINGS_REFETCH_INTERVAL_MS,
    staleTime: 0,
  });

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  const days = data?.days ?? [];
  const totalVrf = data?.totalVrf ?? 0;
  const todayVrf = days.find((d) => d.date === todayStr)?.vrfEarned ?? 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Earnings: Last 7 Days</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isFetching && <RefreshCw className="w-3 h-3 animate-spin" />}
          {lastUpdated && <span>Updated {lastUpdated}</span>}
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-2xl font-bold">{todayVrf.toFixed(2)} VRF</span>
        <span className="text-sm text-muted-foreground">today</span>
        <span className="text-xs text-muted-foreground ml-auto">{totalVrf.toFixed(2)} VRF total this week</span>
      </div>

      {days.length > 0 ? (
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={days} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="25%">
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => v.toFixed(1)}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} VRF`, "Earned"]}
              labelStyle={{ fontSize: 12 }}
              contentStyle={{
                fontSize: 12,
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
              }}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
            />
            <Bar dataKey="vrfEarned" radius={[4, 4, 0, 0]}>
              {days.map((d) => (
                <Cell
                  key={d.date}
                  fill={d.date === todayStr ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.35)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[140px] flex items-center justify-center text-sm text-muted-foreground">
          Loading earnings data…
        </div>
      )}

      <p className="text-[11px] text-muted-foreground mt-3 text-right">
        Auto-refreshes every 30 s · today's bar highlighted
      </p>
    </div>
  );
}

const NODE_TYPE_CONFIG: Record<string, { label: string; icon: typeof Cpu; color: string }> = {
  compute: { label: "Compute Node", icon: Cpu, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300" },
  verification: { label: "Verification Node", icon: Shield, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" },
  storage: { label: "Storage Node", icon: HardDrive, color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300" },
};

const SETUP_STEPS = [
  "Register your node (complete)",
  "Download the Verifo Node client",
  "Generate a pairing code and run `verifo-node link`",
  "Run `verifo-node start` to send heartbeats",
  "Go online and start earning",
];

function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(command).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="w-full flex items-center justify-between gap-2 bg-muted/60 border border-border rounded-lg px-3 py-2 font-mono text-xs text-left hover:bg-muted transition-colors group"
      title="Copy to clipboard"
    >
      <span className="truncate">{command}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0" />
      )}
    </button>
  );
}

type PayoutInfo = {
  pendingRewardUsdc: number;
  totalPaidUsdc: number;
  minPayoutUsdc: number;
  lastPayoutAt: string | null;
  treasuryConfigured: boolean;
  verified: boolean;
};

function PayoutSection() {
  const { data, isLoading, refetch } = useQuery<PayoutInfo>({
    queryKey: ["node-payout-info"],
    queryFn: () => apiGet("/nodes/payout-info"),
    refetchInterval: EARNINGS_REFETCH_INTERVAL_MS,
  });

  const [resultMessage, setResultMessage] = useState<{ type: "success" | "error"; text: string; url?: string } | null>(null);

  const payoutMutation = useMutation({
    mutationFn: () => apiPost("/nodes/payout", {}),
    onSuccess: (result: { amountUsdc: number; solanaTxSignature: string; solanaExplorerUrl: string }) => {
      setResultMessage({
        type: "success",
        text: `Payout of $${result.amountUsdc.toFixed(2)} USDC sent on-chain.`,
        url: result.solanaExplorerUrl,
      });
      refetch();
    },
    onError: (err: unknown) => {
      const message = err instanceof ApiError ? err.message : "Payout failed. Please try again.";
      setResultMessage({ type: "error", text: message });
    },
  });

  if (isLoading || !data) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">Loading payout info…</div>
      </div>
    );
  }

  const canPayout = data.verified && data.treasuryConfigured && data.pendingRewardUsdc >= data.minPayoutUsdc;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-4 h-4 text-primary" />
        <h2 className="font-semibold">Real USDC Payout</h2>
      </div>

      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-2xl font-bold">${data.pendingRewardUsdc.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground">pending USDC</span>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        ${data.totalPaidUsdc.toFixed(2)} paid out lifetime · Minimum payout ${data.minPayoutUsdc.toFixed(2)}
        {data.lastPayoutAt && <> · Last payout {new Date(data.lastPayoutAt).toLocaleString()}</>}
      </p>

      {!data.treasuryConfigured && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">Payouts are not configured yet.</p>
      )}
      {data.treasuryConfigured && !data.verified && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
          Link your node via the CLI to become verified before you can request a payout.
        </p>
      )}

      <Button
        className="w-full gap-2"
        disabled={!canPayout || payoutMutation.isPending}
        onClick={() => {
          setResultMessage(null);
          payoutMutation.mutate();
        }}
      >
        {payoutMutation.isPending ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Sending real USDC on-chain…
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            Request Payout
          </>
        )}
      </Button>

      {resultMessage && (
        <div
          className={cn(
            "mt-3 text-xs rounded-lg p-3",
            resultMessage.type === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          )}
        >
          <p>{resultMessage.text}</p>
          {resultMessage.url && (
            <a href={resultMessage.url} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1 mt-1">
              View on Solana Explorer <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

const PROOF_FEED_REFETCH_INTERVAL_MS = 10_000;

type NodeProofEventRow = {
  id: number;
  taskId: string | null;
  eventType: "connect" | "disconnect" | "task_assigned" | "task_completed";
  status: "pending_signature" | "submitted" | "confirmed" | "failed";
  memoText: string;
  txSignature: string | null;
  failureReason: string | null;
  createdAt: string;
  confirmedAt: string | null;
};

const PROOF_EVENT_CONFIG: Record<NodeProofEventRow["eventType"], { label: string; color: string }> = {
  connect: { label: "Connected", color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300" },
  disconnect: { label: "Disconnected", color: "text-muted-foreground bg-muted" },
  task_assigned: { label: "Task Assigned", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" },
  task_completed: { label: "Task Completed", color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300" },
};

function ProofStatusPill({ status }: { status: NodeProofEventRow["status"] }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-600 dark:text-green-400">
        <CheckCircle className="w-3 h-3" />
        Confirmed on-chain
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive">
        <AlertCircle className="w-3 h-3" />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
      <RefreshCw className="w-3 h-3 animate-spin" />
      Broadcasting…
    </span>
  );
}

function ProofFeedSection() {
  const { data, isFetching, dataUpdatedAt } = useQuery<{ proofs: NodeProofEventRow[] }>({
    queryKey: ["node-proofs"],
    queryFn: () => apiGet("/nodes/proofs"),
    refetchInterval: PROOF_FEED_REFETCH_INTERVAL_MS,
    staleTime: 0,
  });

  const proofs = data?.proofs ?? [];
  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">On-Chain Proof of Activity</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isFetching && <RefreshCw className="w-3 h-3 animate-spin" />}
          {lastUpdated && <span>Updated {lastUpdated}</span>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        Every connect, disconnect, and task event is recorded as a real Solana mainnet transaction, co-signed by your
        node's own key. The network fee is sponsored by Verifo, so you never spend your own SOL.
      </p>

      {proofs.length === 0 ? (
        <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">
          No on-chain activity yet. Start your node to record your first proof.
        </div>
      ) : (
        <ul className="space-y-2">
          {proofs.map((proof, i) => {
            const config = PROOF_EVENT_CONFIG[proof.eventType];
            return (
              <li
                key={proof.id}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 animate-in fade-in slide-in-from-top-1"
                style={{ animationDelay: `${Math.min(i, 10) * 40}ms`, animationDuration: "300ms", animationFillMode: "backwards" }}
              >
                <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold mt-0.5", config.color)}>
                  {config.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{proof.memoText}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(proof.createdAt).toLocaleString()}
                    </span>
                    <ProofStatusPill status={proof.status} />
                    {proof.status === "confirmed" && proof.txSignature && (
                      <a
                        href={`https://orbmarkets.io/tx/${proof.txSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        View on Explorer <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {proof.status === "failed" && proof.failureReason && (
                      <span className="text-[11px] text-destructive truncate">{proof.failureReason}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function PairNodeSection() {
  const [pairingToken, setPairingToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const pairingMutation = useMutation({
    mutationFn: () => apiPost("/nodes/pairing-code", {}),
    onSuccess: (data: { pairingToken: string; expiresInSeconds: number }) => {
      setPairingToken(data.pairingToken);
      setExpiresAt(Date.now() + data.expiresInSeconds * 1000);
    },
  });

  const downloadUrl = `${API_BASE}/api/nodes/download`;
  const minutesLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 60000)) : null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-4 h-4 text-primary" />
        <h2 className="font-semibold">Download & Pair Node Software</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Download the Verifo Node client and pair it with your account to go online and start earning.
      </p>

      <Button className="w-full gap-2 mb-3" asChild>
        <a href={downloadUrl} download>
          <Download className="w-4 h-4" />
          Download Verifo Node Client (.zip)
        </a>
      </Button>
      <Button variant="outline" className="w-full gap-2" asChild>
        <Link href="/contributors/install-docs" target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4" />
          View installation docs
        </Link>
      </Button>

      <div className="mt-5 pt-5 border-t border-border">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5" />
          Pair Your Node
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Requires Node.js 18+. Unzip the download, then generate a one-time pairing code and run it on the machine
          you want to contribute.
        </p>

        {!pairingToken && (
          <Button
            size="sm"
            variant="secondary"
            className="w-full gap-2"
            onClick={() => pairingMutation.mutate()}
            disabled={pairingMutation.isPending}
          >
            {pairingMutation.isPending ? "Generating…" : "Generate Pairing Code"}
          </Button>
        )}

        {pairingMutation.isError && (
          <p className="text-xs text-destructive mt-2">
            {pairingMutation.error instanceof ApiError ? pairingMutation.error.message : "Failed to generate pairing code"}
          </p>
        )}

        {pairingToken && (
          <div className="space-y-2">
            <CopyableCommand command={`node verifo-node.mjs link ${pairingToken} --api ${API_BASE}/api`} />
            <p className="text-[11px] text-muted-foreground">
              {minutesLeft !== null && minutesLeft > 0
                ? `Expires in ~${minutesLeft} min. Run this from inside the unzipped verifo-node-client folder.`
                : "This code has expired — generate a new one."}
            </p>
            <button
              type="button"
              onClick={() => pairingMutation.mutate()}
              className="text-xs text-primary hover:underline"
            >
              Generate a new code
            </button>
            <div className="pt-2">
              <p className="text-[11px] text-muted-foreground mb-1">Then start sending heartbeats with:</p>
              <CopyableCommand command={`node verifo-node.mjs start --api ${API_BASE}/api`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ClientTypeBadge({ clientType }: { clientType?: string | null }) {
  if (clientType === "browser") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
        <Globe className="w-3 h-3" />
        Browser Mode
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border border-border">
      <Terminal className="w-3 h-3" />
      CLI Mode
    </span>
  );
}

function BrowserModePausedNotice() {
  const { heartbeatStatus } = useBrowserNodeStatus();

  if (heartbeatStatus === "paused") {
    return (
      <div className="mb-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
        <PauseCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>This tab isn't focused — Browser Mode contribution is paused. Keep this tab open and active to keep earning.</span>
      </div>
    );
  }
  if (heartbeatStatus === "error") {
    return (
      <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-2 text-sm text-destructive">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Couldn't send a heartbeat from this browser. Make sure you're signed in on the same device that linked this node.</span>
      </div>
    );
  }
  return null;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Online
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        <Clock className="w-3 h-3" />
        Pending Setup
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border border-border">
      <span className="w-2 h-2 rounded-full bg-muted-foreground" />
      {status}
    </span>
  );
}

const CONTRIBUTION_MODE_CONFIG: Record<string, { label: string; description: string; icon: typeof Cpu; color: string }> = {
  compute: {
    label: "Compute",
    description: "Running AI models locally",
    icon: Cpu,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  relay: {
    label: "Relay",
    description: "Forwarding tasks to the network",
    icon: Radio,
    color: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
  },
  witness: {
    label: "Witness",
    description: "Proving real uptime on-chain",
    icon: Eye,
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
};

function ContributionModeCard({ contributionMode }: { contributionMode?: string | null }) {
  const config = (contributionMode && CONTRIBUTION_MODE_CONFIG[contributionMode]) || null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
          config ? config.color : "bg-muted text-muted-foreground"
        )}
      >
        {config ? <config.icon className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Contribution Mode</p>
      <p className="font-semibold text-foreground">{config ? config.label : "Not linked yet"}</p>
      {config && <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>}
    </div>
  );
}

function NoNodeRegistered() {
  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
        <Cpu className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-3">No node registered yet</h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Register your node to start contributing to the Verifo network and earning USDC rewards.
      </p>
      <Button asChild size="lg">
        <Link href="/contributors/register">Register Your Node</Link>
      </Button>
    </div>
  );
}

export default function ContributorDashboard() {
  const { user, signOut, isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const [, navigate] = useLocation();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const { data: node, isLoading, isError, error } = useQuery({
    queryKey: ["contributor-node"],
    queryFn: () => apiGet("/contributors/me"),
    retry: false,
  });

  const isNotFound = isError && error instanceof ApiError && error.status === 404;

  const typeConfig = node ? NODE_TYPE_CONFIG[node.nodeType] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo.webp" alt="Verifo" className="w-14 h-14 object-contain" />
              <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors hidden sm:block">
                Verifo
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-accent/50 transition-colors flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                Use
              </Link>
              <Link
                href="/contributors/dashboard"
                className="text-sm font-medium text-foreground px-3 py-1.5 rounded-md bg-accent flex items-center gap-1"
              >
                <Server className="w-3.5 h-3.5" />
                Contribute
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "auto" ? "light" : theme === "light" ? "dark" : "auto")}
              className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === "auto" ? <Clock className="w-4 h-4" /> : theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:block">{user?.displayName}</span>
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {!isSignedIn && (
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <h2 className="text-xl font-bold mb-3">Sign in to view your dashboard</h2>
            <Button asChild>
              <Link href="/sign-in?redirect=/contributors/dashboard">Sign In</Link>
            </Button>
          </div>
        </div>
      )}

      {isSignedIn && (
        <>
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && isNotFound && <NoNodeRegistered />}

        {!isLoading && isError && !isNotFound && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="font-medium text-destructive">Failed to load node data</p>
              <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
            </div>
          </div>
        )}

        {!isLoading && node && typeConfig && (
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Contributor Dashboard</h1>
                <p className="text-muted-foreground text-sm">
                  {user?.displayName ? `Welcome, ${user.displayName}` : "Node overview and setup guide"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ClientTypeBadge clientType={node.clientType} />
                <StatusBadge status={node.status} />
              </div>
            </div>

            {node.clientType === "browser" && <BrowserModePausedNotice />}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", typeConfig.color)}>
                  <typeConfig.icon className="w-5 h-5" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Node Type</p>
                <p className="font-semibold text-foreground">{typeConfig.label}</p>
              </div>

              <ContributionModeCard contributionMode={node.contributionMode} />

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Reputation Score</p>
                <p className="font-semibold text-foreground">{node.reputationScore} / 100</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Rewards Wallet</p>
                <p className="font-semibold text-foreground font-mono text-sm">
                  {node.walletAddress.slice(0, 6)}…{node.walletAddress.slice(-4)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <EarningsChart />
            </div>

            <div className="mb-6">
              <PayoutSection />
            </div>

            <div className="mb-6">
              <ProofFeedSection />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold">Setup Progress</h2>
                </div>
                <div className="space-y-3">
                  {SETUP_STEPS.map((step, i) => (
                    <div key={step} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5",
                          i === 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground border border-border"
                        )}
                      >
                        {i === 0 ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          i === 0
                            ? "text-foreground font-medium line-through opacity-60"
                            : i === 1
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <PairNodeSection />
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 mt-6">
              <h3 className="text-sm font-semibold mb-3">Node Details</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground mb-1">Hardware</dt>
                  <dd className="font-medium">{node.hardware.replace(/_/g, " ")}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground mb-1">OS</dt>
                  <dd className="font-medium capitalize">{node.os}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground mb-1">Registered</dt>
                  <dd className="font-medium">{new Date(node.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </main>
        )}
        </>
      )}

      <div className="h-16 md:hidden" />
      <DashboardBottomNav />
    </div>
  );
}
