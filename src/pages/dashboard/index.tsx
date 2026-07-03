import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import { Shield, CheckCircle, Clock, AlertCircle, LogOut, Sun, Moon, History, Zap, Server, MessageSquare, Code, Image, Globe, ChevronRight, Coins } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";


const MODELS = [
  { value: "meta-llama/Llama-3-70b-instruct", label: "Llama 3 70B" },
  { value: "meta-llama/Llama-3-8b-instruct", label: "Llama 3 8B" },
  { value: "mistralai/Mistral-7B-Instruct", label: "Mistral 7B" },
  { value: "stable-diffusion-xl", label: "Stable Diffusion XL" },
];

const TASK_TYPES = [
  { value: "chat", label: "Chat", icon: MessageSquare },
  { value: "coding", label: "Coding", icon: Code },
  { value: "image_generation", label: "Image Gen", icon: Image },
  { value: "translation", label: "Translation", icon: Globe },
];

type Task = {
  id: string;
  prompt: string;
  model: string;
  type: string;
  status: string;
  creditsUsed: number;
  response?: string;
  createdAt: string;
  proofId?: string;
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("meta-llama/Llama-3-70b-instruct");
  const [taskType, setTaskType] = useState("chat");
  const [lastTask, setLastTask] = useState<Task | null>(null);
  const qc = useQueryClient();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: () => apiGet("/tasks/credits"),
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: (data: { prompt: string; model: string; type: string }) =>
      apiPost("/tasks", data),
    onSuccess: (task) => {
      setLastTask(task);
      setPrompt("");
      qc.invalidateQueries({ queryKey: ["credits"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSubmit = () => {
    if (!prompt.trim() || submitMutation.isPending) return;
    submitMutation.mutate({ prompt: prompt.trim(), model, type: taskType });
  };

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
              <Link href="/dashboard" className="text-sm font-medium text-white px-3 py-1.5 rounded-md bg-white/15 flex items-center gap-1">
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
              <Link
                href="/dashboard/topup"
                className="flex items-center gap-1.5 text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{credits.credits} credits</span>
                <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">+ Top Up</span>
              </Link>
            )}
            <button
              onClick={() => setTheme(theme === "auto" ? "light" : theme === "light" ? "dark" : "auto")}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              {theme === "auto" ? <Clock className="w-4 h-4" /> : theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="hidden sm:block">{user?.displayName}</span>
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            {user ? `Welcome, ${user.displayName}` : "AI Playground"}
          </h1>
          <p className="text-muted-foreground text-sm">Submit a prompt. Every response is cryptographically verified by the Verifo network.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Task Type</label>
              <div className="flex gap-1.5 flex-wrap">
                {TASK_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTaskType(value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                      taskType === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:w-48">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Model</label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={taskType === "chat" ? "Ask anything... e.g. Explain zero-knowledge proofs in simple terms." : taskType === "coding" ? "Describe the code you need... e.g. Write a binary search algorithm in TypeScript." : taskType === "image_generation" ? "Describe the image... e.g. A futuristic cityscape at night with neon lights." : "Enter text to translate..."}
            className="min-h-[120px] resize-none text-sm mb-4"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {prompt.length > 0 && `${prompt.length} chars · `}
              <kbd className="bg-muted px-1 py-0.5 rounded text-[10px]">⌘↵</kbd> to submit
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || submitMutation.isPending}
              className="gap-2"
            >
              {submitMutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  Submit Task
                </>
              )}
            </Button>
          </div>
        </div>

        {submitMutation.isError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive text-sm">Task failed</p>
              <p className="text-sm text-muted-foreground mt-0.5">There was an error submitting your task. Please try again.</p>
            </div>
          </div>
        )}

        {lastTask && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {lastTask.status === "completed" ? (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200">
                    <Clock className="w-3.5 h-3.5" />
                    Processing
                  </div>
                )}
                <span className="text-xs text-muted-foreground">{lastTask.creditsUsed} credits used</span>
              </div>
              {lastTask.proofId && (
                <Link
                  href={`/dashboard/proofs/${lastTask.proofId}`}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Shield className="w-3.5 h-3.5" />
                  View Proof
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Your prompt</div>
            <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3 mb-4">{lastTask.prompt}</p>

            {lastTask.response && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Response</div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>·</span>
                    <span>{lastTask.model}</span>
                  </div>
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap bg-background rounded-lg p-4 border border-border font-mono leading-relaxed">
                  {lastTask.response}
                </div>
              </>
            )}
          </div>
        )}

        {!lastTask && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Cryptographically Verified", desc: "Every response gets a unique on-chain proof anchored to Solana." },
              { icon: Zap, title: "Fast & Decentralized", desc: "Requests are routed to the fastest available community node globally." },
              { icon: Coins, title: "Pay-per-task Credits", desc: "Simple credit system. You start with 100 free credits, no card needed." },
            ].map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-5">
                <f.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="h-16 md:hidden" />
      <DashboardBottomNav />
    </div>
  );
}
