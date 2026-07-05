import { Link, useParams } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { Shield, CheckCircle, XCircle, LogOut, Sun, Moon, Clock, History, Coins, ExternalLink, Copy, Check, Zap, Server, RefreshCw, Wallet, TrendingUp, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import { getModelLabel } from "@/lib/models";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="group">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 font-mono text-xs text-foreground border border-border">
        <span className="flex-1 break-all">{value}</span>
        <button onClick={copy} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors" title="Copy">
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function usdc(micros: number): string {
  return (micros / 1_000_000).toFixed(6);
}

type ContributorNodeInfo = {
  nodeId: string;
  contributionMode: string | null;
  clientType: string;
  isPlatformNode: boolean;
  walletAddress: string;
  os: string | null;
  hardwareSummary: string | null;
};

type TaskDetail = {
  id: string;
  taskId: string;
  prompt: string;
  model: string;
  type: string;
  status: string;
  creditsUsed: number;
  response?: string;
  createdAt: string;
  completedAt?: string | null;
  source?: string | null;
  assignedNodeId?: number | null;
  nodeRewardUsdcMicros: number;
  totalPaidUsdcMicros: number;
  treasuryUsdcMicros: number;
  contributorNode?: ContributorNodeInfo | null;
  rewardPayoutStatus?: "not_applicable" | "paid" | "failed";
  rewardTxSignature?: string | null;
  rewardExplorerUrl?: string | null;
};

const CONTRIBUTION_MODE_LABEL: Record<string, string> = {
  compute: "Compute Node",
  relay: "Relay Node",
  witness: "Witness Node",
};

type TaskProof = {
  id: number;
  nodeId: number;
  taskId: string | null;
  eventType: "connect" | "disconnect" | "task_assigned" | "task_completed" | "node_offline";
  status: "pending_signature" | "submitted" | "confirmed" | "failed";
  memoText: string;
  txSignature: string | null;
  failureReason?: string | null;
  createdAt: string;
  confirmedAt: string | null;
};

export default function ProofDetail() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const params = useParams<{ taskId: string }>();
  const taskId = params.taskId;

  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: () => apiGet("/tasks/credits"),
    retry: false,
  });

  const { data: task, isLoading, isError } = useQuery<TaskDetail>({
    queryKey: ["task", taskId],
    queryFn: () => apiGet(`/tasks/${taskId}`),
    enabled: !!taskId,
    retry: false,
  });

  const { data: onChainProof, isFetching: isFetchingOnChain } = useQuery<{ proof: TaskProof | null }>({
    queryKey: ["task-proof", taskId],
    queryFn: () => apiGet(`/tasks/${taskId}/proof`),
    enabled: !!taskId,
    retry: false,
    refetchInterval: (query) => (query.state.data?.proof?.status === "confirmed" ? false : 5_000),
  });

  const proof = onChainProof?.proof ?? null;
  const involvedNode = task?.assignedNodeId != null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10" style={{ backgroundColor: "hsl(28 45% 12%)" }}>
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo.webp" alt="Verifo" className="w-14 h-14 object-contain" />
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors hidden sm:block">Verifo</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="text-sm font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Use
              </Link>
              <Link href="/dashboard/history" className="text-sm font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1">
                <History className="w-3.5 h-3.5" />
                History
              </Link>
              <Link href="/contributors/dashboard" className="text-sm font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1">
                <Server className="w-3.5 h-3.5" />
                Contribute
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {credits && (
              <div className="flex items-center gap-1.5 text-sm font-medium bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                <Coins className="w-3.5 h-3.5" />
                <span>{credits.credits} credits</span>
              </div>
            )}
            <button onClick={() => setTheme(theme === "auto" ? "light" : theme === "light" ? "dark" : "auto")} className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              {theme === "auto" ? <Clock className="w-4 h-4" /> : theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="hidden sm:block">{user?.displayName}</span>
              <button onClick={() => signOut()} className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Proof Inspector</h1>
          <p className="text-muted-foreground text-sm">Real on-chain proof for this AI task, signed by the node that ran it.</p>
        </div>

        {isLoading && (
          <div className="bg-card border border-border rounded-2xl p-8 animate-pulse space-y-4">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        )}

        {isError && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <XCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Task not found</h3>
            <p className="text-muted-foreground text-sm">This task could not be found.</p>
          </div>
        )}

        {task && (
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                {task.status === "completed" ? (
                  <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-destructive" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold">{task.status === "completed" ? "Task Completed" : "Task " + task.status}</h2>
                  <p className="text-sm text-muted-foreground">
                    {task.source === "local_model" ? "Answered by a contributor node's own model" : "Answered by Verifo's central network"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Task ID</div>
                  <div className="font-mono text-sm text-foreground break-all">{task.taskId}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Completed</div>
                  <div className="text-sm text-foreground">{task.completedAt ? new Date(task.completedAt).toLocaleString() : "-"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Model</div>
                  <div className="text-sm text-foreground">{getModelLabel(task.model)}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Provenance</div>
                  <div className="text-sm text-foreground">{task.source === "local_model" ? "Contributor node (local model)" : "Verifo central network"}</div>
                </div>
              </div>
            </div>

            {involvedNode && task.contributorNode && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Contributor / Device</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Node</div>
                    <div className="text-sm font-mono text-foreground">{task.contributorNode.nodeId}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Type</div>
                    <div className="text-sm text-foreground">
                      {task.contributorNode.isPlatformNode
                        ? "Platform relay node"
                        : (task.contributorNode.contributionMode && CONTRIBUTION_MODE_LABEL[task.contributorNode.contributionMode]) ?? "Community contributor"}
                      {!task.contributorNode.isPlatformNode && task.contributorNode.clientType === "browser" && " (Browser Mode)"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Device</div>
                    <div className="text-sm text-foreground">
                      {[task.contributorNode.os, task.contributorNode.hardwareSummary].filter(Boolean).join(" · ") || "Not reported"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Reward Wallet</div>
                    <div className="text-sm font-mono text-foreground">{task.contributorNode.walletAddress}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Payment Breakdown</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    <Coins className="w-3.5 h-3.5" />
                    You Paid
                  </div>
                  <div className="text-lg font-bold text-foreground">{task.creditsUsed}</div>
                  <div className="text-xs text-muted-foreground">Credits</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Node Earned
                  </div>
                  <div className="text-lg font-bold text-foreground">${usdc(task.nodeRewardUsdcMicros)}</div>
                  <div className="text-xs text-muted-foreground">USDC</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Treasury Kept
                  </div>
                  <div className="text-lg font-bold text-foreground">${usdc(task.treasuryUsdcMicros)}</div>
                  <div className="text-xs text-muted-foreground">USDC</div>
                </div>
              </div>
              {!involvedNode && (
                <p className="text-xs text-muted-foreground mt-4">
                  No contributor or relay node was involved in this task, so the full amount was retained by the platform treasury.
                </p>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">On-Chain Proof of Activity</h3>
                {isFetchingOnChain && <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />}
              </div>
              {!involvedNode ? (
                <p className="text-sm text-muted-foreground">
                  This task was answered directly by the central fallback with no node involved, so there is no node-cosigned proof for it.
                </p>
              ) : !proof ? (
                <p className="text-sm text-muted-foreground">
                  Waiting for the node to co-sign and broadcast its on-chain completion proof for this task…
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-foreground">{proof.memoText}</p>
                  {proof.status === "confirmed" && proof.txSignature ? (
                    <>
                      <CopyField label="Solana Transaction Signature" value={proof.txSignature} />
                      <a
                        href={`https://orbmarkets.io/tx/${proof.txSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View confirmed transaction on Solana Explorer
                      </a>
                    </>
                  ) : proof.status === "failed" ? (
                    <p className="text-xs text-destructive">{proof.failureReason || "On-chain broadcast failed."}</p>
                  ) : (
                    <p className="text-xs text-amber-600 dark:text-amber-400 inline-flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Broadcasting to Solana mainnet…
                    </p>
                  )}
                </div>
              )}
            </div>

            {involvedNode && task.rewardPayoutStatus && task.rewardPayoutStatus !== "not_applicable" && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Reward Payment</h3>
                </div>
                {task.rewardPayoutStatus === "paid" && task.rewardTxSignature ? (
                  <div className="space-y-3">
                    <p className="text-sm text-foreground">
                      The contributor node was paid ${usdc(task.nodeRewardUsdcMicros)} USDC automatically on-chain the instant this task completed.
                    </p>
                    <CopyField label="Reward Payment Transaction Signature" value={task.rewardTxSignature} />
                    <a
                      href={task.rewardExplorerUrl ?? `https://orbmarkets.io/tx/${task.rewardTxSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View reward payment on Solana Explorer
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    The instant on-chain payment couldn't be broadcast for this task. The reward was credited to the node's balance instead and can still be claimed from its dashboard.
                  </p>
                )}
              </div>
            )}

            <div className="bg-[hsl(28_40%_9%)] border border-border/20 rounded-2xl p-6 font-mono text-sm shadow-xl overflow-x-auto">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <span className="ml-2 text-white/50">proof_record.json</span>
              </div>
              <pre className="text-white/80 leading-relaxed text-xs whitespace-pre-wrap">
                {JSON.stringify({ task, onChainProof: proof }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      <div className="h-16 md:hidden" />
      <DashboardBottomNav />
    </div>
  );
}
