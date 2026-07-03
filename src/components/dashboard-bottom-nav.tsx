import { Link, useLocation } from "wouter";
import { Zap, Server, History, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  {
    href: "/dashboard",
    label: "Use",
    icon: Zap,
    match: (p: string) => p === "/dashboard",
  },
  {
    href: "/contributors/dashboard",
    label: "Contribute",
    icon: Server,
    match: (p: string) => p.startsWith("/contributors"),
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: History,
    match: (p: string) => p.startsWith("/dashboard/history"),
  },
  {
    href: "/dashboard/topup",
    label: "Top Up",
    icon: Coins,
    match: (p: string) => p.startsWith("/dashboard/topup"),
  },
];

export function DashboardBottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
      style={{ backgroundColor: "hsl(28 45% 12%)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around h-16">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(location);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-white/55 active:text-white/80"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
