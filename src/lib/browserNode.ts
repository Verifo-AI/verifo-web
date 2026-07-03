// Browser Mode: a no-install contribution path where the node's identity
// lives in this tab's storage and its heartbeat/task loop runs as plain JS
// while the tab is open. There is no separate CLI process here — the browser
// itself IS the client, so it has to generate and hold the signing key that
// a CLI would normally generate on the contributor's machine.
//
// Everything below reuses the exact same signed-request scheme the CLI node
// client uses (see packages/verifo-node-client) and the exact same backend
// endpoints (/nodes/pairing-code, /nodes/link, /nodes/heartbeat,
// /nodes/next-task, /nodes/task-result) — the server doesn't distinguish
// where a valid signature came from, only that it's valid.
import nacl from "tweetnacl";
import bs58 from "bs58";
import { apiPost, API_BASE, getToken } from "@/lib/api";

const STORAGE_KEY = "verifo_browser_node_keypair";

export type BrowserNodeKeypair = {
  publicKey: string; // base58
  secretKey: string; // base64
};

export function loadBrowserNodeKeypair(): BrowserNodeKeypair | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.publicKey === "string" && typeof parsed?.secretKey === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function generateAndStoreBrowserNodeKeypair(): BrowserNodeKeypair {
  const kp = nacl.sign.keyPair();
  const keypair: BrowserNodeKeypair = {
    publicKey: bs58.encode(kp.publicKey),
    secretKey: Buffer.from(kp.secretKey).toString("base64"),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keypair));
  return keypair;
}

export function clearBrowserNodeKeypair() {
  localStorage.removeItem(STORAGE_KEY);
}

function signMessage(secretKeyBase64: string, message: string): string {
  const secretKey = new Uint8Array(Buffer.from(secretKeyBase64, "base64"));
  const msgBytes = new TextEncoder().encode(message);
  const sig = nacl.sign.detached(msgBytes, secretKey);
  return Buffer.from(sig).toString("base64");
}

function estimateBrowserHardware() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const ramGb = typeof deviceMemory === "number" ? deviceMemory : isMobile ? 3 : 4;
  return {
    os: isMobile ? "browser-mobile" : "browser-desktop",
    cpu: `${navigator.hardwareConcurrency ?? "?"} logical cores (browser-reported)`,
    ramGb,
  };
}

// Registers this browser tab's key as the node's real identity, in one shot
// — no manual pairing-code copy/paste, since the browser is both the
// "dashboard" and the "client" here. Requires the node to already exist
// (i.e. /contributors/register already ran) and be unlinked.
export async function linkBrowserNode(): Promise<{ contributionMode: string }> {
  const keypair = loadBrowserNodeKeypair() ?? generateAndStoreBrowserNodeKeypair();
  const { pairingToken } = await apiPost("/nodes/pairing-code", {});
  const hw = estimateBrowserHardware();
  const result = await apiPost("/nodes/link", {
    pairingToken,
    nodePublicKey: keypair.publicKey,
    os: hw.os,
    cpu: hw.cpu,
    ramGb: hw.ramGb,
    clientType: "browser",
  });
  return result;
}

async function sendSignedHeartbeat(keypair: BrowserNodeKeypair): Promise<void> {
  const timestampMs = Date.now();
  const signature = signMessage(keypair.secretKey, `verifo-heartbeat:${keypair.publicKey}:${timestampMs}`);
  const res = await fetch(`${API_BASE}/api/nodes/heartbeat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodePublicKey: keypair.publicKey, timestampMs, signature }),
  });
  if (!res.ok) throw new Error(`Heartbeat failed: ${res.status}`);
}

const HEARTBEAT_INTERVAL_MS = 25_000;

export type BrowserHeartbeatStatus = "idle" | "active" | "paused" | "error";

// Starts the heartbeat loop for as long as this tab is open. Pauses
// automatically when the tab is hidden (Page Visibility API) — contribution
// is honestly tied to the tab being open AND focused, not just open in a
// background pinned tab, since that's what the reward is meant to represent.
export function startBrowserHeartbeatLoop(
  keypair: BrowserNodeKeypair,
  onStatusChange: (status: BrowserHeartbeatStatus) => void
): () => void {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function tick() {
    if (stopped) return;
    if (document.visibilityState !== "visible") {
      onStatusChange("paused");
      timer = setTimeout(tick, HEARTBEAT_INTERVAL_MS);
      return;
    }
    try {
      await sendSignedHeartbeat(keypair);
      onStatusChange("active");
    } catch {
      onStatusChange("error");
    }
    timer = setTimeout(tick, HEARTBEAT_INTERVAL_MS);
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "visible" && !stopped) {
      if (timer) clearTimeout(timer);
      tick();
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  tick();

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}

export function hasAuthToken(): boolean {
  return !!getToken();
}
