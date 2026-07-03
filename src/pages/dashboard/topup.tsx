import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet, apiPost } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import {
  Coins,
  History,
  Sun,
  Moon,
  LogOut,
  Zap,
  Server,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";


const PACKAGES = [
  { id: "pack_100", usdcAmount: 1, credits: 100, label: "Starter", popular: false },
  { id: "pack_500", usdcAmount: 4, credits: 500, label: "Pro", popular: true },
  { id: "pack_2000", usdcAmount: 14, credits: 2000, label: "Builder", popular: false },
  { id: "pack_10000", usdcAmount: 60, credits: 10000, label: "Enterprise", popular: false },
];

type TopUpState =
  | { step: "idle" }
  | { step: "confirming" }
  | { step: "sending" }
  | { step: "verifying"; txSignature: string }
  | { step: "success"; txSignature: string; credits: number; added: number }
  | { step: "error"; message: string };

export default function TopUpPage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const qc = useQueryClient();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const [selected, setSelected] = useState("pack_500");
  const [state, setState] = useState<TopUpState>({ step: "idle" });

  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: () => apiGet("/tasks/credits"),
    retry: false,
  });

  const topupMutation = useMutation({
    mutationFn: (data: { packageId: string; txSignature: string; walletAddress: string }) =>
      apiPost("/credits/topup", data),
    onSuccess: (result) => {
      const sig = state.step === "verifying" ? state.txSignature : "";
      setState({ step: "success", txSignature: sig, credits: result.credits, added: result.added });
      qc.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (err: Error) => {
      setState({ step: "error", message: err.message });
    },
  });

  const handleTopUp = async () => {
    if (!connected || !publicKey) return;
    const pkg = PACKAGES.find((p) => p.id === selected)!;

    try {
      setState({ step: "confirming" });

      const { Transaction, PublicKey } = await import("@solana/web3.js");
      const {
        getAssociatedTokenAddress,
        createTransferCheckedInstruction,
        TOKEN_PROGRAM_ID,
      } = await import("@solana/spl-token");

      const pkgInfo = await apiGet("/credits/packages");
      const USDC_MINT = new PublicKey(pkgInfo.usdcMint);
      const TREASURY = new PublicKey(pkgInfo.treasuryWallet);

      const fromAta = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const toAta = await getAssociatedTokenAddress(USDC_MINT, TREASURY);

      const { blockhash } = await connection.getLatestBlockhash("finalized");

      const transferIx = createTransferCheckedInstruction(
        fromAta,
        USDC_MINT,
        toAta,
        publicKey,
        BigInt(pkg.usdcAmount * 1_000_000),
        6,
        [],
        TOKEN_PROGRAM_ID,
      );

      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(transferIx);

      setState({ step: "sending" });
      const sig = await sendTransaction(tx, connection);
      setState({ step: "verifying", txSignature: sig });

      topupMutation.mutate({
        packageId: selected,
        txSignature: sig,
        walletAddress: publicKey.toBase58(),
      });
    } catch (err: any) {
      if (err?.message?.includes("User rejected") || err?.code === 4001) {
        setState({ step: "idle" });
      } else {
        setState({ step: "error", message: err?.message || "Transaction failed" });
      }
    }
  };

  const selectedPkg = PACKAGES.find((p) => p.id === selected)!;
  const isBusy = state.step === "confirming" || state.step === "sending" || state.step === "verifying";

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
                <Zap className="w-3.5 h-3.5" />Use
              </Link>
              <Link href="/dashboard/history" className="text-sm font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1">
                <History className="w-3.5 h-3.5" />History
              </Link>
              <span className="text-sm font-medium text-white px-3 py-1.5 rounded-md bg-white/15 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />Top Up
              </span>
              <Link href="/contributors/dashboard" className="text-sm font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1">
                <Server className="w-3.5 h-3.5" />Contribute
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {credits && (
              <div className="flex items-center gap-1.5 text-sm font-medium bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                <Coins className="w-3.5 h-3.5" /><span>{credits.credits} credits</span>
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

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Top Up Credits</h1>
          <p className="text-muted-foreground text-sm">Connect your Solana wallet and deposit USDC to add credits. 1 credit ≈ $0.01 USDC. VRF token payments coming soon.</p>
        </div>

        {state.step === "success" ? (
          <div className="bg-card border border-green-500/30 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-1">Credits Added!</h2>
            <p className="text-muted-foreground text-sm mb-4">
              <span className="font-semibold text-foreground">+{state.added} credits</span> added. New balance: <span className="font-semibold text-foreground">{state.credits} credits</span>.
            </p>
            {state.txSignature && (
              <a href={`https://orbmarkets.io/tx/${state.txSignature}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mb-6">
                <ExternalLink className="w-3.5 h-3.5" />View on OrbMarkets
              </a>
            )}
            <div className="flex gap-3 justify-center flex-wrap mt-6">
              <button onClick={() => setState({ step: "idle" })} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <Coins className="w-4 h-4" />Top Up More
              </button>
              <Link href="/dashboard" className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-2">
                <Zap className="w-4 h-4" />Use Credits
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {PACKAGES.map((pkg) => (
                <button key={pkg.id} onClick={() => setSelected(pkg.id)} className={cn(
                  "relative text-left rounded-2xl border-2 p-5 transition-all hover:shadow-md",
                  selected === pkg.id ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/40"
                )}>
                  {pkg.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-full tracking-wider uppercase">Most Popular</span>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{pkg.label}</span>
                    {selected === pkg.id && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"><CheckCircle className="w-3 h-3 text-primary-foreground" /></div>}
                  </div>
                  <div className="text-2xl font-bold mb-0.5">
                    {pkg.credits.toLocaleString()}<span className="text-sm font-normal text-muted-foreground ml-1">credits</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${pkg.usdcAmount} USDC
                    <span className="ml-2 text-xs text-primary font-medium">${(pkg.usdcAmount / pkg.credits * 100).toFixed(1)}¢ / 100 cr</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment Method
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 mb-1 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">USDC on Solana</p>
                    <p className="text-xs text-muted-foreground">Instant · Low fees · Non-custodial</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg px-3 py-2">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>VRF token payments <strong>coming soon</strong></span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground mb-4">
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Send exactly <strong className="text-foreground">${selectedPkg.usdcAmount} USDC</strong> from your wallet. Supports Phantom, Solflare, Backpack, and any Solana wallet. Credits are added instantly after on-chain confirmation.
                </span>
              </div>
              <div className="[&_.wallet-adapter-button]:!bg-primary [&_.wallet-adapter-button]:!rounded-xl [&_.wallet-adapter-button]:!font-medium [&_.wallet-adapter-button]:!text-sm [&_.wallet-adapter-button]:!h-10 [&_.wallet-adapter-button]:!px-5">
                <WalletMultiButton />
              </div>
            </div>

            {state.step === "error" && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4 text-sm text-destructive">{state.message}</div>
            )}

            <button
              onClick={handleTopUp}
              disabled={!connected || isBusy}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all",
                connected && !isBusy
                  ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md hover:shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isBusy ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {state.step === "confirming" && "Preparing transaction…"}
                  {state.step === "sending" && "Waiting for wallet approval…"}
                  {state.step === "verifying" && "Confirming on chain…"}
                </>
              ) : !connected ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 11-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect Wallet to Continue
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Pay ${selectedPkg.usdcAmount} USDC · Get {selectedPkg.credits.toLocaleString()} Credits
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Non-custodial · Your keys, your funds · Solana mainnet
            </p>
          </>
        )}
      </main>

      <div className="h-16 md:hidden" />
      <DashboardBottomNav />
    </div>
  );
}
