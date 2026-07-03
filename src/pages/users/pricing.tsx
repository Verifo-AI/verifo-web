import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function Pricing() {
  return (
    <Layout>
      <ArticleLayout
        title="Plans and Pricing"
        subtitle="Transparent, pay-as-you-go credit systems with no hidden vendor lock-in."
        category="For AI Users"
        categoryLink="/users/getting-started"
        relatedLinks={[
          { title: "Getting Started", href: "/users/getting-started" },
          { title: "AI Capabilities", href: "/users/ai-capabilities" },
          { title: "Proof Explorer", href: "/users/proof-explorer" },
        ]}
      >
        <p>
          Verifo uses a unified credit system. Instead of managing multiple API keys and subscriptions for different model providers, you purchase Verifo credits and use them seamlessly across any model on the network.
        </p>

        <h2>Credit Exchange Rates</h2>
        <p>
          The cost of a task depends entirely on the compute required to execute it.
        </p>
        <ul>
          <li><strong>1 Credit:</strong> ≈ 1 standard chat message (approx. 500 tokens on an 8B parameter model).</li>
          <li><strong>2-5 Credits:</strong> Heavy reasoning or coding tasks on large models (e.g., 70B parameters).</li>
          <li><strong>10-50 Credits:</strong> Image generation (scales with resolution and step count).</li>
          <li><strong>20-100 Credits:</strong> Autonomous agent runs requiring multi-step execution.</li>
        </ul>

        <h2>Subscription Tiers</h2>

        <h3>Free Tier</h3>
        <p>
          Perfect for trying out the protocol and casual daily use.
        </p>
        <ul>
          <li>100 free credits per month.</li>
          <li>Access to basic AI task types (Chat, Code, basic Images).</li>
          <li>Standard network routing.</li>
          <li>Full cryptographic proofs included automatically.</li>
        </ul>

        <h3>Pro Tier ($19 / month)</h3>
        <p>
          Built for power users, developers, and creators.
        </p>
        <ul>
          <li>5,000 credits per month.</li>
          <li>Access to all AI task types, including high-res video generation and deep research.</li>
          <li>Priority routing (faster response times during network congestion).</li>
          <li>Full Developer API access.</li>
          <li>30-day extended encrypted history.</li>
        </ul>

        <h3>Enterprise Tier</h3>
        <p>
          For organizations requiring zero-knowledge privacy and massive scale.
        </p>
        <ul>
          <li>Custom credit volume.</li>
          <li>Access to Enterprise Privacy Mode (hardware enclaves).</li>
          <li>Dedicated infrastructure routing (your tasks route exclusively to verified tier-1 nodes).</li>
          <li>SLA guarantees and custom model onboarding.</li>
        </ul>

        <h2>Pay with USDC on Solana</h2>
        <p>
          In addition to standard credit card subscriptions, Verifo natively supports Web3 payments. You can top up your account balance at any time using USDC on the Solana blockchain.
        </p>
        <p>
          Purchased credits never expire. You only pay for the compute you actually use.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
