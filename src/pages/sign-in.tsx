import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Shield, Loader2, Wallet } from "lucide-react";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "");

function getRedirectTarget(): string {
  if (typeof window === "undefined") return "/dashboard";
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }
  return "/dashboard";
}

export default function SignInPage() {
  const { publicKey, signMessage, connected } = useWallet();
  const { setAuth, isSignedIn, isLoaded } = useAuth();
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"idle" | "signing" | "verifying" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLocation(getRedirectTarget());
    }
  }, [isLoaded, isSignedIn]);

  const handleAuth = useCallback(async () => {
    if (!publicKey || !signMessage) return;
    setStatus("signing");
    setErrorMsg("");
    try {
      const message = `Sign in to Verifo\n\nWallet: ${publicKey.toBase58()}\nNonce: ${Date.now()}`;
      const msgBytes = new TextEncoder().encode(message);
      const sig = await signMessage(msgBytes);
      const signatureBase64 = Buffer.from(sig).toString("base64");

      setStatus("verifying");

      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          signature: signatureBase64,
          message,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error((err as any).error || "Authentication failed");
      }

      const { token, walletAddress } = await resp.json();
      setAuth(token, walletAddress);
      setLocation(getRedirectTarget());
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message === "User rejected the request." ? "Signing cancelled" : (err.message || "Signing cancelled"));
    }
  }, [publicKey, signMessage, setAuth, setLocation]);

  useEffect(() => {
    if (connected && publicKey && status === "idle") {
      handleAuth();
    }
  }, [connected, publicKey]);

  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center bg-background px-4"
      style={{ backgroundImage: "radial-gradient(ellipse at top, hsl(28 45% 8% / 0.4) 0%, transparent 60%)" }}
    >
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <img src="/logo.webp" alt="Verifo" className="w-32 h-32 object-contain" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">Connect to Verifo</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Use your Solana wallet to sign in, no password needed
              </p>
            </div>

            {!connected ? (
              <div className="flex flex-col items-center gap-3">
                <WalletMultiButton
                  style={{
                    background: "hsl(90, 52%, 36%)",
                    borderRadius: "0.5rem",
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "10px 24px",
                    height: "auto",
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Phantom, Solflare, Backpack & more
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {status === "signing" && (
                  <div className="flex flex-col items-center gap-3 py-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Check your wallet and approve the signature request</p>
                  </div>
                )}
                {status === "verifying" && (
                  <div className="flex flex-col items-center gap-3 py-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Verifying signature...</p>
                  </div>
                )}
                {status === "error" && (
                  <div className="space-y-3">
                    <p className="text-sm text-destructive">{errorMsg}</p>
                    <button
                      onClick={handleAuth}
                      className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                    <div className="flex justify-center">
                      <WalletMultiButton style={{ background: "transparent", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", borderRadius: "0.5rem", fontSize: "12px", padding: "6px 12px", height: "auto" }} />
                    </div>
                  </div>
                )}
                {status === "idle" && (
                  <button
                    onClick={handleAuth}
                    className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Sign in with Wallet
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Signing only, no transaction, no gas fees</span>
            </div>
          </div>

          <div className="px-8 pb-6 border-t border-border pt-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Wallet className="w-3.5 h-3.5" />
              <span>New to Solana wallets?</span>
              <a href="https://phantom.app" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Get Phantom
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
