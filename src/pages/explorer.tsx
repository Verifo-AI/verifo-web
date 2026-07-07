import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/layout";
import { ExternalLink, Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "all" | "nodes" | "tasks" | "rewards";
type ModelFilter = "all" | "chat" | "coding" | "image_generation" | "translation" | "research";
type EventCategory = "connect" | "offline" | "task" | "reward";

interface ExplorerItem {
  id: string;
  category: EventCategory;
  nodeLabel: string;
  txHash: string | null;
  explorerUrl: string | null;
  status: string;
  timestamp: string;
  taskType: string | null;
  amount: string | null;
}

interface ExplorerStats {
  totalProofsToday: number;
  totalUsdcPaidToday: number;
  totalVerifiedNodes: number;
}

interface ExplorerResponse {
  stats: ExplorerStats;
  items: ExplorerItem[];
}

const API_BASE = import.meta.env.VITE_API_URL ?? "";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "nodes", label: "Nodes" },
  { key: "tasks", label: "Tasks" },
  { key: "rewards", label: "Rewards" },
];

const MODELS: { key: ModelFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "chat", label: "Chat" },
  { key: "coding", label: "Code" },
  { key: "image_generation", label: "Image" },
  { key: "translation", label: "Embedding" },
  { key: "research", label: "Research" },
];

const CATEGORY_CONFIG: Record<EventCategory, { label: string; dotClass: string; textClass: string }> = {
  connect: { label: "Connect", dotClass: "bg-emerald-500 dark:bg-emerald-400", textClass: "text-emerald-700 dark:text-emerald-400" },
  offline: { label: "Offline", dotClass: "bg-red-400 dark:bg-red-400", textClass: "text-red-600 dark:text-red-400" },
  task: { label: "Task", dotClass: "bg-sky-500 dark:bg-sky-400", textClass: "text-sky-700 dark:text-sky-400" },
  reward: { label: "Reward", dotClass: "bg-amber-500 dark:bg-amber-400", textClass: "text-amber-700 dark:text-amber-400" },
};

function shortHash(hash: string | null): string {
  if (!hash) return "—";
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

function relativeTime(isoStr: string): string {
  const ms = Date.now() - new Date(isoStr).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-1 p-0.5 rounded text-muted-foreground/50 hover:text-muted-foreground transition-colors"
      title="Copy full hash"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function CategoryBadge({ category }: { category: EventCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", cfg.textClass)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dotClass)} />
      {cfg.label}
    </span>
  );
}

export default function NetworkExplorer() {
  const [tab, setTab] = useState<Tab>("all");
  const [model, setModel] = useState<ModelFilter>("all");
  const [data, setData] = useState<ExplorerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (activeTab: Tab, activeModel: ModelFilter) => {
    try {
      const params = new URLSearchParams({ tab: activeTab, model: activeModel, limit: "50" });
      const res = await fetch(`${API_BASE}/api/public/explorer?${params}`);
      if (!res.ok) throw new Error("fetch failed");
      const json: ExplorerResponse = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch {
      // keep stale data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData(tab, model);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => fetchData(tab, model), 15_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [tab, model, fetchData]);

  const stats = data?.stats;
  const items = data?.items ?? [];
  const showModelFilter = tab !== "nodes";

  return (
    <Layout>
      <div className="min-h-screen bg-background">

        {/* ─── Header ─── */}
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Network Explorer
                  </h1>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Real-time on-chain activity across all Verifo network nodes
                </p>
              </div>
              <button
                onClick={() => fetchData(tab, model)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:bg-muted/40"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {/* Stats strip */}
            {stats && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-semibold tabular-nums text-foreground">
                    {stats.totalVerifiedNodes}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">Verified nodes</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-semibold tabular-nums text-foreground">
                    {stats.totalProofsToday}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">Proofs today</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-semibold tabular-nums text-foreground">
                    ${stats.totalUsdcPaidToday.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">USDC paid today</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Filters ─── */}
        <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4">
            {/* Tabs */}
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    tab === key
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Model chips */}
            {showModelFilter && (
              <div className="flex items-center gap-1.5 pb-3 overflow-x-auto scrollbar-none">
                <span className="text-xs text-muted-foreground shrink-0 mr-1">Model:</span>
                {MODELS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setModel(key)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap border",
                      model === key
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 bg-transparent"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-sm">No activity found for this filter.</p>
              <p className="text-xs mt-1">Try switching to a different tab or model.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-36">Node</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">TX Hash</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Details</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr
                        key={item.id}
                        className={cn(
                          "border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors",
                          i % 2 === 0 ? "bg-background" : "bg-card/30"
                        )}
                      >
                        <td className="px-4 py-3">
                          <CategoryBadge category={item.category} />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                          {item.nodeLabel}
                        </td>
                        <td className="px-4 py-3">
                          {item.txHash ? (
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-foreground/80">
                                {shortHash(item.txHash)}
                              </span>
                              <CopyButton value={item.txHash} />
                              {item.explorerUrl && (
                                <a
                                  href={item.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-0.5 text-muted-foreground/50 hover:text-primary transition-colors"
                                  title="View on Solana Explorer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/40">Pending…</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {item.amount
                            ? <span className="font-medium text-amber-700 dark:text-amber-400">{item.amount} USDC</span>
                            : item.taskType
                              ? <span>{item.taskType}</span>
                              : <span className="text-muted-foreground/40">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground text-right tabular-nums">
                          {relativeTime(item.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CategoryBadge category={item.category} />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {relativeTime(item.timestamp)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mb-2">
                      {item.nodeLabel}
                    </div>
                    {item.txHash ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-foreground/80 flex-1 truncate">
                          {shortHash(item.txHash)}
                        </span>
                        <CopyButton value={item.txHash} />
                        {item.explorerUrl && (
                          <a
                            href={item.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground/60 hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">TX pending…</span>
                    )}
                    {(item.amount || item.taskType) && (
                      <div className="mt-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                        {item.amount
                          ? <span className="font-medium text-amber-700 dark:text-amber-400">{item.amount} USDC</span>
                          : item.taskType}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground/50 text-center mt-6">
                Last updated {relativeTime(lastRefresh.toISOString())} · Auto-refreshes every 15s
              </p>
            </>
          )}
        </div>

      </div>
    </Layout>
  );
}
