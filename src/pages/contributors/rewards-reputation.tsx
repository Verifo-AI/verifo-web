import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function RewardsReputation() {
  return (
    <Layout>
      <ArticleLayout
        title="Rewards and Reputation"
        subtitle="How the network evaluates node performance and distributes yields."
        category="For Contributors"
        categoryLink="/contributors/compute"
        relatedLinks={[
          { title: "Compute Nodes", href: "/contributors/compute" },
          { title: "Relay Nodes", href: "/contributors/relay" },
          { title: "Verification Nodes", href: "/contributors/verification" },
          { title: "Storage Nodes", href: "/contributors/storage" },
        ]}
      >
        <p>
          In a decentralized network, trust must be earned algorithmically. Verifo uses a robust reputation system to ensure that high-quality node operators are rewarded, while malicious or unstable nodes are phased out.
        </p>

        <h2>The Trust Score</h2>
        <p>
          Every node (Compute, Relay, Witness, Verification, or Storage) maintains a public Trust Score, calculated dynamically based on four primary metrics:
        </p>

        <h3>1. Uptime</h3>
        <p>
          The percentage of time your node is online and actively accepting tasks from the router. Nodes that frequently drop offline or disconnect during tasks are penalized heavily.
        </p>

        <h3>2. Success Rate</h3>
        <p>
          The percentage of assigned tasks that your node completes without error. For compute nodes, this means returning an output that passes the verification committee. For verification nodes, this means accurately validating hashes without timing out.
        </p>

        <h3>3. Latency</h3>
        <p>
          Your node's average response time compared to the network baseline for the specific hardware tier. Faster nodes provide a better experience for AI users and thus accrue higher reputation.
        </p>

        <h3>4. Completed Tasks</h3>
        <p>
          The sheer volume of historical tasks processed. A node that has successfully processed 100,000 inferences is inherently more trusted than a node that just spun up yesterday.
        </p>

        <h2>How Reputation Drives Earnings</h2>
        <p>
          The Verifo scheduling router is ruthless. It preferentially assigns valuable, high-reward tasks to nodes with the highest Trust Scores. 
        </p>
        <p>
          If your node has a low Trust Score (due to high latency or frequent disconnects), it will still receive tasks, but they will likely be low-priority or background batch jobs that pay less. Maintaining a pristine Trust Score is the single best way to maximize your hardware's yield.
        </p>
        <p>
          <em>Note for new operators:</em> All new nodes start at a baseline reputation. It steadily improves over your first 30 days on the network as you establish a track record of reliable uptime and successful completions.
        </p>

        <h2>Automated USDC Payments</h2>
        <p>
          There are no manual withdrawals, no minimum payout thresholds, and no locked tokens. 
        </p>
        <p>
          The instant your node completes a task, the reward is paid on-chain in USDC directly to your connected Solana wallet, no batching, no waiting period. The transparency of the Solana blockchain means you can audit every single payment your node receives, task by task.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
