import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import { Shield, CheckCircle, XCircle, Clock, LogOut, Sun, Moon, History, ChevronRight, Coins, MessageSquare, Code, Image, Globe, ArrowLeft, Zap, Server } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { getModelLabel } from "@/lib/models";


const TASK_TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  chat: MessageSquare,
  coding: Code,
  image_generation: Image,
  translation: Globe,
};

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800", label: "Verified" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", label: "Failed" },
  running: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", label: "Running" },
};

type Task = {
  id: string;
  taskId: string;
  prompt: string;
  model: string;
  type: string;
  status: string;
  creditsUsed: number;
  createdAt: string;
};

export default function TaskHistory() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: () => apiGet("/tasks/credits"),
    retry: false,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => apiGet("/tasks?limit=20"),
    retry: false,
  });

  const tasks: Task[] = data?.tasks ?? [];

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
              <Link href="/dashboard/history" className="text-sm font-medium text-white px-3 py-1.5 rounded-md bg-white/15 flex items-center gap-1">
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
          <h1 className="text-2xl font-bold">Task History</h1>
          <p className="text-muted-foreground text-sm">All your past AI tasks with verification status.</p>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-1/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <XCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="text-muted-foreground">Failed to load task history. Please try refreshing.</p>
          </div>
        )}

        {!isLoading && !isError && tasks.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No tasks yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Submit your first AI prompt to get started.</p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
              Go to Playground <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!isLoading && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => {
              const statusConf = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.running;
              const StatusIcon = statusConf.icon;
              const TypeIcon = TASK_TYPE_ICONS[task.type] || MessageSquare;

              return (
                <div key={task.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", statusConf.bg, statusConf.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConf.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <TypeIcon className="w-3 h-3" />
                          {task.type.replace("_", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{getModelLabel(task.model)}</span>
                        {task.creditsUsed > 0 && (
                          <>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{task.creditsUsed} credits</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-foreground truncate">{task.prompt}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {task.taskId && (
                      <Link
                        href={`/dashboard/proofs/${task.taskId}`}
                        className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Proof
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <div className="h-16 md:hidden" />
      <DashboardBottomNav />
    </div>
  );
}
