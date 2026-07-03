import { Link, useParams } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { Shield, CheckCircle, XCircle, LogOut, Sun, Moon, Clock, History, Coins, ArrowLeft, ExternalLink, Copy, Check, Zap, Server, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";


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

export default function ProofDetail() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const params = useParams<{ proofId: string }>();
  const proofId = params.proofId;

  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: () => apiGet("/tasks/credits"),
    retry: false,
  });

  const { data: proof, isLoading, isError } = useQuery({
    queryKey: ["proof", proofId],
    queryFn: () => apiGet(`/proofs/${proofId}`),
    enabled: !!proofId,
    retry: false,
  });

  const taskId = proof?.taskId;
  const { data: onChainProof, isFetching: isFetchingOnChain } = useQuery<{
    proof: {
      status: "pending_signature" | "submitted" | "confirmed" | "failed";
      memoText: string;
      txSignature: string | null;
      confirmedAt: string | null;
    } | null;
  }>({
    queryKey: ["task-proof", taskId],
    queryFn: () => apiGet(`/tasks/${taskId}/proof`),
    enabled: !!taskId,
    retry: false,
    refetchInterval: (query) => (query.state.data?.proof?.status === "confirmed" ? false : 5_000),
  });

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
          <p className="text-muted-foreground text-sm">On-chain cryptographic proof for this AI task.</p>
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
            <h3 className="font-semibold mb-2">Proof not found</h3>
            <p className="text-muted-foreground text-sm">This proof ID could not be found.</p>
          </div>
        )}

        {proof && (
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                {proof.verified ? (
                  <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-destructive" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold">
                    {proof.verified ? "Verification Passed" : "Verification Failed"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {proof.attestation.verifierCount} of {proof.attestation.verifierThreshold}+ verifiers reached consensus
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Proof ID</div>
                  <div className="font-mono text-sm text-foreground">{proof.proofId}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Timestamp</div>
                  <div className="text-sm text-foreground">{new Date(proof.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Task ID</div>
                  <div className="font-mono text-sm text-foreground">{proof.taskId}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Model</div>
                  <div className="text-sm text-foreground">{proof.modelIdentifier}</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Cryptographic Hashes</h3>
              </div>
              <div className="space-y-3">
                <CopyField label="Prompt SHA-256" value={proof.hashes.promptHashSha256} />
                <CopyField label="Output SHA-256" value={proof.hashes.outputHashSha256} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Node Attestation</h3>
              <div className="space-y-3">
                <CopyField label="Compute Node Wallet" value={proof.attestation.computeNodeWallet} />
                <CopyField label="Node Signature" value={proof.attestation.nodeSignature} />
                <div className="flex items-center gap-2 pt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Verification Consensus: Achieved</span>
                  <span className="text-xs text-muted-foreground">({proof.attestation.verifierCount} verifiers)</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Solana Blockchain Record</h3>
              <CopyField label="Transaction ID" value={proof.solanaTransactionId} />
              <a
                href={proof.solanaExplorerUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                View on Solana Explorer
              </a>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">On-Chain Proof of Activity</h3>
                {isFetchingOnChain && <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />}
              </div>
              {!onChainProof?.proof ? (
                <p className="text-sm text-muted-foreground">
                  Waiting for the compute node to broadcast its on-chain completion proof for this task…
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-foreground">{onChainProof.proof.memoText}</p>
                  {onChainProof.proof.status === "confirmed" && onChainProof.proof.txSignature ? (
                    <a
                      href={`https://orbmarkets.io/tx/${onChainProof.proof.txSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View confirmed transaction on Solana Explorer
                    </a>
                  ) : (
                    <p className="text-xs text-amber-600 dark:text-amber-400 inline-flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Broadcasting to Solana mainnet…
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[hsl(28_40%_9%)] border border-border/20 rounded-2xl p-6 font-mono text-sm shadow-xl overflow-x-auto">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <span className="ml-2 text-white/50">proof_record.json</span>
              </div>
              <pre className="text-white/80 leading-relaxed text-xs whitespace-pre-wrap">
                {JSON.stringify(proof, null, 2)}
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
