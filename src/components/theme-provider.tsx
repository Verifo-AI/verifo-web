import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "auto";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "auto",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function getTimeBasedTheme(): "light" | "dark" {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

function msUntilNextBoundary(): number {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const elapsedMs = (h * 3600 + m * 60 + s) * 1000;
  const dayMs = 24 * 3600 * 1000;
  const boundary6am = 6 * 3600 * 1000;
  const boundary6pm = 18 * 3600 * 1000;

  let nextBoundary: number;
  if (elapsedMs < boundary6am) {
    nextBoundary = boundary6am;
  } else if (elapsedMs < boundary6pm) {
    nextBoundary = boundary6pm;
  } else {
    nextBoundary = dayMs + boundary6am;
  }

  return nextBoundary - elapsedMs + 500;
}

export function ThemeProvider({
  children,
  defaultTheme = "auto",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    function applyTheme() {
      root.classList.remove("light", "dark");
      const resolved = theme === "auto" ? getTimeBasedTheme() : theme;
      root.classList.add(resolved);
    }

    applyTheme();

    if (theme !== "auto") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const ms = msUntilNextBoundary();
      timeoutId = setTimeout(() => {
        applyTheme();
        scheduleNext();
      }, ms);
    }

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [theme]);

  const value = {
    theme,
    setTheme: (t: Theme) => {
      localStorage.setItem(storageKey, t);
      setThemeState(t);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
