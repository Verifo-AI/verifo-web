import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";
import { Button } from "@/components/ui/button";
import { Radio, Smartphone, ArrowRight } from "lucide-react";

export default function Relay() {
  return (
    <Layout>
      <ArticleLayout
        title="Running a Relay Node"
        subtitle="Turn a phone, tablet, or lightweight device into a forwarding node and earn a balanced yield without running AI inference."
        category="For Contributors"
        categoryLink="/contributors/compute"
        relatedLinks={[
          { title: "Become a Contributor", href: "/contributors/register" },
          { title: "Compute Nodes", href: "/contributors/compute" },
          { title: "Verification Nodes", href: "/contributors/verification" },
          { title: "Storage Nodes", href: "/contributors/storage" },
          { title: "Rewards & Reputation", href: "/contributors/rewards-reputation" },
        ]}
      >
        <div className="not-prose mb-8 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg mb-1">Contribute with the hardware you already have</h3>
            <p className="text-muted-foreground text-sm">No GPU, no dedicated server. A phone or a modest laptop is enough to become a Relay Node.</p>
          </div>
          <Button asChild size="lg" className="gap-2 shrink-0">
            <Link href="/contributors/register">
              <Radio className="w-4 h-4" />
              Register Your Node
            </Link>
          </Button>
        </div>

        <p>
          Relay Nodes sit between AI users and Compute Nodes. They don't run model inference themselves, instead, they forward encrypted tasks to more powerful nodes and confirm that delivery happened, verifying that the round trip was honest before the network moves on. This makes Relay the right tier for devices that have decent memory and connectivity, but not enough RAM or GPU power to run inference directly.
        </p>

        <h2>Who Should Run a Relay Node</h2>
        <p>
          During registration, Verifo automatically classifies your device into a contribution tier based on real, detected hardware: Compute, Relay, or Witness. Devices with roughly 3 to 7GB of usable RAM, most modern smartphones, tablets, and entry-level laptops, are classified as Relay by default. You never choose your tier manually; it's read directly from your hardware so the network can't be gamed.
        </p>

        <h2>How to Start Contributing</h2>
        <ol>
          <li><strong>Register your device:</strong> Go through the contributor wizard, it detects your RAM, GPU, and device type automatically.</li>
          <li><strong>Choose a mode:</strong> On mobile, Browser Mode is used automatically, no install required, just keep the tab open. On desktop or laptop, you can also run the CLI client for a stronger, uninterrupted connection.</li>
          <li><strong>Connect your wallet:</strong> Add the Solana wallet where you want to receive USDC rewards.</li>
          <li><strong>Start Earning:</strong> Leave the browser tab open (or the CLI client running) and your node will begin forwarding tasks automatically.</li>
        </ol>

        <div className="not-prose my-8 p-5 rounded-xl border border-border bg-muted/30 flex items-start gap-4">
          <Smartphone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Verifo Mobile app: Coming Soon</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A dedicated Verifo Mobile app is in development for a more stable, background-friendly relay experience on your phone. Until it's released on the App Store and Google Play, Browser Mode is the fully supported way to run a Relay Node from a phone today, no functionality is missing while you wait.
            </p>
          </div>
        </div>

        <h2>Reward Structure</h2>
        <p>
          Relay Nodes earn a balanced yield, lower than running full inference on a Compute Node, but meaningfully higher than a Witness Node. Rewards are paid per task forwarded and verified, settled automatically and instantly on-chain in USDC to your connected Solana wallet the moment each task completes.
        </p>
        <p>
          As with every tier on Verifo, running through the CLI client (on a laptop or desktop) earns the full reward rate, while Browser Mode, needed on phones and low-power devices, applies a reduced multiplier since it only earns while the tab stays open and focused.
        </p>

        <div className="not-prose mt-8 p-5 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground flex-1">Got a spare phone or laptop? Register it as a Relay Node in minutes.</p>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/contributors/register" className="inline-flex items-center gap-1.5">
              Register Node <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </ArticleLayout>
    </Layout>
  );
}
