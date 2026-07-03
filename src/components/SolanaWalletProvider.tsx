import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-coinbase";
import "@solana/wallet-adapter-react-ui/styles.css";

// Routed through our own backend so it goes through Helius (our primary
// Solana RPC provider) without ever exposing the Helius API key in the
// browser bundle. Connection requires an absolute http(s) URL, so we
// resolve the relative API base against the current origin.
const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "");
const RPC = new URL(`${API_BASE}/api/solana-rpc`, window.location.origin).toString();

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider
        wallets={wallets}
        autoConnect
        onError={(error) => {
          // Wallet adapter errors (rejected connection, wallet not
          // installed, disconnects, etc.) are expected user-driven events,
          // not app bugs. Log them instead of letting them surface as
          // unhandled rejections that could otherwise crash the page.
          console.error("[wallet-adapter]", error.name, error.message, error);
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
