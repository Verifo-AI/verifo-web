import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";
import { Button } from "@/components/ui/button";
import { Cpu } from "lucide-react";

export default function Compute() {
  return (
    <Layout>
      <ArticleLayout
        title="Running a Compute Node"
        subtitle="Monetize your idle GPUs by running AI inference for the decentralized network."
        category="For Contributors"
        categoryLink="/contributors/compute"
        relatedLinks={[
          { title: "Become a Contributor", href: "/contributors/register" },
          { title: "Verification Nodes", href: "/contributors/verification" },
          { title: "Storage Nodes", href: "/contributors/storage" },
          { title: "Rewards & Reputation", href: "/contributors/rewards-reputation" },
        ]}
      >
        <div className="not-prose mb-8 p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg mb-1">Ready to start earning?</h3>
            <p className="text-muted-foreground text-sm">Register your compute node in minutes and earn up to 8 USDC/day.</p>
          </div>
          <Button asChild size="lg" className="gap-2 shrink-0">
            <Link href="/contributors/register">
              <Cpu className="w-4 h-4" />
              Register Your Node
            </Link>
          </Button>
        </div>

        <p>
          Compute nodes are the heavy lifters of the Verifo protocol. They receive encrypted prompts from the router, load open-source AI models into memory, run the inference, and return the cryptographically signed output. In exchange, they earn the highest yields on the network.
        </p>

        <h2>Hardware Requirements</h2>
        <p>
          AI inference requires significant VRAM. While you can run a node on a CPU, you will only be routed very lightweight tasks. To maximize earnings, a dedicated GPU is required.
        </p>
        
        <h3>Minimum Requirements</h3>
        <ul>
          <li>8GB System RAM</li>
          <li>50GB available SSD space</li>
          <li>Stable broadband internet connection</li>
        </ul>

        <h3>Recommended Hardware</h3>
        <ul>
          <li><strong>Windows/Linux:</strong> 16GB+ System RAM, NVIDIA GPU with 12GB+ VRAM (e.g., RTX 3060, 4070, 4090).</li>
          <li><strong>macOS:</strong> Apple Silicon (M1/M2/M3/M4) with 16GB+ Unified Memory. Verifo natively utilizes the Apple Neural Engine.</li>
        </ul>

        <h2>How to Start Contributing</h2>
        <ol>
          <li><strong>Download the Node Client:</strong> Available for Windows, macOS, and Linux (Debian/Ubuntu).</li>
          <li><strong>Sign In:</strong> Connect the Solana wallet where you want to receive your USDC rewards.</li>
          <li><strong>Hardware Scan:</strong> The client will automatically benchmark your hardware to determine which AI models your system is capable of running.</li>
          <li><strong>Node Qualification:</strong> Your node will complete a few test inferences to prove its speed and accuracy to the network.</li>
          <li><strong>Start Earning:</strong> Leave the client running. The Verifo router will automatically assign tasks to your machine when demand matches your hardware profile.</li>
        </ol>

        <h2>Task Types and Payouts</h2>
        <p>
          Compute nodes execute a variety of workloads:
        </p>
        <ul>
          <li><strong>LLM Inference:</strong> Text generation (Chat, Code). Consistent volume, moderate reward per task.</li>
          <li><strong>Image Generation:</strong> Stable Diffusion workloads. Lower volume, higher reward per task.</li>
          <li><strong>Embedding Generation:</strong> Processing text for vector databases. Extremely high volume, micro-rewards per task.</li>
        </ul>
        <p>
          Your node will automatically download and cache the necessary model weights in the background so you are ready when a task arrives.
        </p>

        <h2>Reward Structure</h2>
        <p>
          Compute nodes operate on a pay-per-task model. You are compensated for the exact amount of compute time required, scaled by the complexity of the model you ran. Payouts are settled automatically to your connected Solana wallet in USDC.
        </p>

        <div className="not-prose mt-8 p-5 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground flex-1">Your hardware meets the requirements? Get started in 3 minutes.</p>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/contributors/register">Register Node →</Link>
          </Button>
        </div>
      </ArticleLayout>
    </Layout>
  );
}
