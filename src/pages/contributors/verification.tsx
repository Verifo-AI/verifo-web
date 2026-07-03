import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Verification() {
  return (
    <Layout>
      <ArticleLayout
        title="Running a Verification Node"
        subtitle="Become the integrity backbone of the network and earn consistent yields with standard hardware."
        category="For Contributors"
        categoryLink="/contributors/compute"
        relatedLinks={[
          { title: "Become a Contributor", href: "/contributors/register" },
          { title: "Compute Nodes", href: "/contributors/compute" },
          { title: "Storage Nodes", href: "/contributors/storage" },
          { title: "Rewards & Reputation", href: "/contributors/rewards-reputation" },
        ]}
      >
        <div className="not-prose mb-8 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg mb-1">Low hardware, steady income</h3>
            <p className="text-muted-foreground text-sm">Run a verification node on any modern machine, no GPU required. Earn consistent USDC rewards.</p>
          </div>
          <Button asChild size="lg" className="gap-2 shrink-0">
            <Link href="/contributors/register">
              <Shield className="w-4 h-4" />
              Register Your Node
            </Link>
          </Button>
        </div>

        <p>
          If Compute Nodes are the muscles of the Verifo network, Verification Nodes are the immune system. They do not generate AI responses; instead, they check the math. Without verification nodes, the network could not guarantee the cryptographic integrity of its outputs.
        </p>

        <h2>The Role of a Verifier</h2>
        <p>
          When a Compute Node completes a task, it cannot simply hand the result back to the user. It must submit its output, along with a digital signature, to a randomly selected committee of Verification Nodes.
        </p>
        <p>
          As a Verification Node, your software will rapidly execute the following checks:
        </p>
        <ol>
          <li>Calculate the SHA-256 hash of the original prompt and ensure it matches the compute node's claim.</li>
          <li>Calculate the SHA-256 hash of the generated AI output.</li>
          <li>Verify the cryptographic signature against the compute node's public wallet address.</li>
          <li>Validate the model metadata formatting.</li>
        </ol>
        <p>
          If all checks pass, your node generates an attestation. Once enough verifiers in the committee agree, the final proof is formulated and submitted to the Solana blockchain.
        </p>

        <h2>Hardware Requirements</h2>
        <p>
          Because hashing and signature verification are computationally inexpensive compared to AI inference, Verification Nodes have dramatically lower hardware requirements. You do not need a powerful GPU to run a verifier.
        </p>
        <ul>
          <li>Any modern multi-core CPU (Intel i3/Ryzen 3 or better)</li>
          <li>4GB System RAM</li>
          <li>Stable internet connection (10Mbps+)</li>
        </ul>
        <p>
          Because of these low requirements, verification nodes are ideal for running on older hardware, laptops, or cheap VPS instances.
        </p>

        <h2>Reward Structure</h2>
        <p>
          Verification tasks pay a fraction of a cent per task, significantly less than a compute task. However, because verification takes milliseconds rather than seconds, a single Verification Node can process thousands of tasks per hour.
        </p>
        <p>
          This results in a highly consistent, predictable yield that requires very little electricity or hardware overhead. As long as your node maintains high uptime and accurately validates hashes, you will earn steady USDC rewards, paid instantly on-chain to your Solana wallet the moment each task is verified.
        </p>

        <div className="not-prose mt-8 p-5 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground flex-1">Have an old laptop or VPS? It qualifies. Register in minutes.</p>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/contributors/register">Register Node →</Link>
          </Button>
        </div>
      </ArticleLayout>
    </Layout>
  );
}
