import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";
import { Button } from "@/components/ui/button";
import { HardDrive } from "lucide-react";

export default function Storage() {
  return (
    <Layout>
      <ArticleLayout
        title="Running a Storage Node"
        subtitle="Provide decentralized, redundant storage for the network and earn passive yields."
        category="For Contributors"
        categoryLink="/contributors/compute"
        relatedLinks={[
          { title: "Become a Contributor", href: "/contributors/register" },
          { title: "Compute Nodes", href: "/contributors/compute" },
          { title: "Verification Nodes", href: "/contributors/verification" },
          { title: "Rewards & Reputation", href: "/contributors/rewards-reputation" },
        ]}
      >
        <div className="not-prose mb-8 p-6 rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg mb-1">Passive income from spare disk space</h3>
            <p className="text-muted-foreground text-sm">Storage nodes require almost no active management. Set it up once and earn USDC automatically.</p>
          </div>
          <Button asChild size="lg" className="gap-2 shrink-0">
            <Link href="/contributors/register">
              <HardDrive className="w-4 h-4" />
              Register Your Node
            </Link>
          </Button>
        </div>

        <p>
          As the Verifo network processes millions of tasks, it generates a massive amount of data. Cryptographic proofs, model outputs, fine-tuning artifacts, and encrypted user history all need to be stored reliably. Storage Nodes form the decentralized data layer that makes this possible.
        </p>

        <h2>The Role of a Storage Node</h2>
        <p>
          Storage nodes do not run AI inference or verify hashes. Their sole purpose is to securely store shards of encrypted data and serve them back to the network upon request.
        </p>
        <p>
          When a user accesses their Proof Explorer to view past tasks, the Verifo protocol routes a retrieval request to the storage nodes holding those encrypted records. The nodes deliver the data back to the user's client, where it is decrypted locally.
        </p>

        <h2>Hardware Requirements</h2>
        <p>
          Storage nodes prioritize capacity and uptime over raw processing power.
        </p>
        <ul>
          <li><strong>Storage:</strong> Minimum 100GB available space. SSDs are preferred for retrieval speed, but HDDs are acceptable for cold storage shards.</li>
          <li><strong>Network:</strong> 50Mbps+ stable connection. Consistent uptime is critical.</li>
          <li><strong>Compute:</strong> Minimal. Any basic CPU and 4GB RAM is sufficient to handle the network daemon.</li>
        </ul>

        <h2>Privacy and Encryption</h2>
        <p>
          If you run a storage node, you might wonder: <em>"What exactly am I storing on my hard drive?"</em>
        </p>
        <p>
          The answer is mathematically unintelligible ciphertext. All data is chunked and encrypted at rest (AES-GCM-256) before it ever reaches a storage node. A storage node operator cannot read the data, cannot determine who owns the data, and cannot alter the data without destroying the integrity hash (which would immediately slash the node's reputation).
        </p>

        <h2>Reward Structure</h2>
        <p>
          Storage nodes provide the most passive form of yield on the Verifo network. You are compensated based on two metrics:
        </p>
        <ol>
          <li><strong>Storage Volume:</strong> Paid per gigabyte of data stored per month.</li>
          <li><strong>Retrieval Operations:</strong> A micro-reward is paid each time your node successfully serves a data shard back to the network.</li>
        </ol>
        <p>
          While the per-unit reward is lower than running compute inference, storage yields are highly predictable and require essentially zero active management once configured. Rewards are accumulated and deposited to your connected Solana wallet in USDC.
        </p>

        <div className="not-prose mt-8 p-5 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground flex-1">Have spare disk space? Start earning passively in minutes.</p>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/contributors/register">Register Node →</Link>
          </Button>
        </div>
      </ArticleLayout>
    </Layout>
  );
}
