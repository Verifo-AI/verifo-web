import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";
import { loadBrowserNodeKeypair, startBrowserHeartbeatLoop, type BrowserHeartbeatStatus } from "@/lib/browserNode";

interface BrowserNodeContextType {
  isBrowserNode: boolean;
  heartbeatStatus: BrowserHeartbeatStatus;
}

const BrowserNodeContext = createContext<BrowserNodeContextType>({
  isBrowserNode: false,
  heartbeatStatus: "idle",
});

// Runs at the app root (not just the dashboard) so a Browser Mode
// contributor keeps earning while browsing any page of the site, not only
// while the dashboard tab is literally in view — same "tab must stay open"
// deal, just not scoped to one route.
export function BrowserNodeProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [heartbeatStatus, setHeartbeatStatus] = useState<BrowserHeartbeatStatus>("idle");
  const stopRef = useRef<(() => void) | null>(null);

  const { data: node } = useQuery({
    queryKey: ["contributor-node"],
    queryFn: () => apiGet("/contributors/me"),
    enabled: isSignedIn,
    retry: false,
    staleTime: 60_000,
  });

  const isBrowserNode = !!node && node.clientType === "browser" && node.verified;

  useEffect(() => {
    if (!isBrowserNode) {
      stopRef.current?.();
      stopRef.current = null;
      setHeartbeatStatus("idle");
      return;
    }
    const keypair = loadBrowserNodeKeypair();
    if (!keypair) {
      // Registered as Browser Mode but this tab/browser has no key (e.g.
      // cleared storage, different device) — nothing we can sign with here.
      setHeartbeatStatus("error");
      return;
    }
    stopRef.current = startBrowserHeartbeatLoop(keypair, setHeartbeatStatus);
    return () => {
      stopRef.current?.();
      stopRef.current = null;
    };
  }, [isBrowserNode]);

  return (
    <BrowserNodeContext.Provider value={{ isBrowserNode, heartbeatStatus }}>{children}</BrowserNodeContext.Provider>
  );
}

export function useBrowserNodeStatus() {
  return useContext(BrowserNodeContext);
}
