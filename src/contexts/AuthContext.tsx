import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface AuthUser {
  walletAddress: string;
  displayName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  setAuth: (token: string, walletAddress: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeJwtPayload(token: string): { walletAddress: string; exp: number } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function makeDisplayName(addr: string): string {
  if (addr.length <= 8) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("verifo_jwt");
    if (stored) {
      const payload = decodeJwtPayload(stored);
      if (payload && payload.exp * 1000 > Date.now()) {
        setToken(stored);
        setUser({ walletAddress: payload.walletAddress, displayName: makeDisplayName(payload.walletAddress) });
      } else {
        localStorage.removeItem("verifo_jwt");
      }
    }
    setIsLoaded(true);
  }, []);

  const setAuth = useCallback((newToken: string, walletAddress: string) => {
    localStorage.setItem("verifo_jwt", newToken);
    setToken(newToken);
    setUser({ walletAddress, displayName: makeDisplayName(walletAddress) });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("verifo_jwt");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoaded, isSignedIn: !!user, setAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
