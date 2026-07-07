import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/layout";
import { ExternalLink, Copy, Check, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
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

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ExplorerStats {
  totalProofsToday: number;
  totalUsdcPaidToday: number;
  totalVerifiedNodes: number;
}

interface ExplorerResponse {
  stats: ExplorerStats;
  items: ExplorerItem[];
  pagination: Pagination;
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
  offline: { label: "Offline",  dotClass: "bg-red-400",                        textClass: "text-red-600 dark:text-red-400" },
  task:    { label: "Task",     dotClass: "bg-sky-500 dark:bg-sky-400",         textClass: "text-sky-700 dark:text-sky-400" },
  reward:  { label: "Reward",   dotClass: "bg-amber-500 dark:bg-amber-400",     textClass: "text-amber-700 dark:text-amber-400" },
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
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}
      className="p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors"
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

function PaginationBar({ pagination, onPage }: { pagination: Pagination; onPage: (p: number) => void }) {
  const { page, totalPages, total, pageSize } = pagination;
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build visible page numbers (window of 5 around current page)
  const pages: (number | "…")[] = [];
  const WINDOW = 2;
  const start = Math.max(1, page - WINDOW);
  const end = Math.min(totalPages, page + WINDOW);
  if (start > 1) { pages.push(1); if (start > 2) pages.push("…"); }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) { if (end < totalPages - 1) pages.push("…"); pages.push(totalPages); }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
      <span className="text-xs text-muted-foreground order-2 sm:order-1">
        Showing {from}–{to} of {total} entries
      </span>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>

        <div className="flex items-center gap-0.5 mx-1">
          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-muted-foreground">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPage(p as number)}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-medium transition-colors",
                  p === page
                    ? "bg-foreground text-background"
                    : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function NetworkExplorer() {
  const [tab, setTab] = useState<Tab>("all");
  const [model, setModel] = useState<ModelFilter>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ExplorerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (activeTab: Tab, activeModel: ModelFilter, activePage: number, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ tab: activeTab, model: activeModel, page: String(activePage) });
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
    fetchData(tab, model, page);
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Only auto-refresh on page 1 (newest), so user isn't disrupted while browsing older pages
    if (page === 1) {
      intervalRef.current = setInterval(() => fetchData(tab, model, 1, true), 15_000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [tab, model, page, fetchData]);

  const handleTabChange = (t: Tab) => { setTab(t); setPage(1); };
  const handleModelChange = (m: ModelFilter) => { setModel(m); setPage(1); };

  const stats = data?.stats;
  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { page: 1, pageSize: 15, total: 0, totalPages: 1 };
  const showModelFilter = tab !== "nodes";

  return (
    <Layout>
      <div className="min-h-screen bg-background">

        {/* ─── Header ─── */}
        <div className="border-b border-border bg-card">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">
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
                onClick={() => fetchData(tab, model, page)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:bg-muted/40"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {stats && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xl md:text-2xl font-semibold tabular-nums text-foreground">{stats.totalVerifiedNodes}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Verified nodes</p>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-semibold tabular-nums text-foreground">{stats.totalProofsToday}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Proofs today</p>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-semibold tabular-nums text-foreground">${stats.totalUsdcPaidToday.toFixed(2)}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">USDC paid today</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Filters ─── */}
        <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
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

            {showModelFilter && (
              <div className="flex items-center gap-1.5 pb-3 overflow-x-auto scrollbar-none">
                <span className="text-xs text-muted-foreground shrink-0 mr-1">Model:</span>
                {MODELS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleModelChange(key)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap border",
                      model === key
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
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
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6">
          {loading ? (
            <div className="space-y-2">
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
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-40">Node</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">TX Hash</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Details</th>
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
                        <td className="px-4 py-3"><CategoryBadge category={item.category} /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{item.nodeLabel}</td>
                        <td className="px-4 py-3">
                          {item.txHash ? (
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs text-foreground/80">{shortHash(item.txHash)}</span>
                              <CopyButton value={item.txHash} />
                              {item.explorerUrl && (
                                <a href={item.explorerUrl} target="_blank" rel="noopener noreferrer"
                                  className="text-muted-foreground/40 hover:text-primary transition-colors" title="View on Solana Explorer">
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
                            : item.taskType ?? <span className="text-muted-foreground/30">—</span>}
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
                  <div key={item.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <CategoryBadge category={item.category} />
                      <span className="text-xs text-muted-foreground tabular-nums">{relativeTime(item.timestamp)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mb-2">{item.nodeLabel}</div>
                    {item.txHash ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-foreground/80 flex-1 truncate">{shortHash(item.txHash)}</span>
                        <CopyButton value={item.txHash} />
                        {item.explorerUrl && (
                          <a href={item.explorerUrl} target="_blank" rel="noopener noreferrer"
                            className="text-muted-foreground/50 hover:text-primary transition-colors">
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

              {/* Pagination */}
              <PaginationBar pagination={pagination} onPage={(p) => setPage(p)} />

              <p className="text-xs text-muted-foreground/40 text-center mt-4">
                {page === 1 ? `Auto-refreshes every 15s · last updated ${relativeTime(lastRefresh.toISOString())}` : `Viewing page ${page} · auto-refresh paused`}
              </p>
            </>
          )}
        </div>

      </div>
    </Layout>
  );
}
