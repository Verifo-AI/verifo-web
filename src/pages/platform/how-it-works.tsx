import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";
import { ArrowRight, Server, Shield, Activity, Network } from "lucide-react";

export default function HowItWorks() {
  return (
    <Layout>
      <ArticleLayout
        title="How the Verifo Network Works"
        subtitle="A technical overview of how AI inference is routed, executed, and verified on decentralized infrastructure."
        category="Platform"
        categoryLink="/platform/how-it-works"
        relatedLinks={[
          { title: "On-Chain Proof", href: "/platform/on-chain-proof" },
          { title: "Privacy Modes", href: "/platform/privacy-modes" },
          { title: "Security Architecture", href: "/platform/security" },
        ]}
      >
        <p>
          Verifo transforms artificial intelligence from a centralized service into a verifiable protocol. By separating the roles of requesting, computing, and verifying AI tasks, the network ensures that every output is mathematically proven to be authentic and untampered.
        </p>

        <h2>The Inference Pipeline</h2>
        <p>
          When you submit a prompt to Verifo, it does not go to a monolithic data center. Instead, it travels through a series of cryptographic checkpoints.
        </p>

        <div className="not-prose my-12 p-8 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center text-center max-w-[120px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">1. Request</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
            <div className="flex flex-col items-center text-center max-w-[120px]">
              <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-3">
                <Network className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">2. Routing</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
            <div className="flex flex-col items-center text-center max-w-[120px]">
              <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-3">
                <Server className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">3. Execution</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
            <div className="flex flex-col items-center text-center max-w-[120px]">
              <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">4. Verification</span>
            </div>
          </div>
        </div>

        <h3>1. Submission</h3>
        <p>
          A user opens the Verifo application or calls the API, submitting a prompt. Depending on the selected privacy mode, the prompt is either hashed (Private) or left as plaintext (Public) before entering the network.
        </p>

        <h3>2. Intelligent Routing</h3>
        <p>
          The Verifo Router receives the request and analyzes the network state. Requests are matched to the appropriate contribution tier, Compute Nodes run inference directly, while lighter devices such as phones and modest laptops act as Relay Nodes, forwarding tasks to a Compute Node and confirming delivery. Within the selected tier, the router picks the best available node based on three factors:
        </p>
        <ul>
          <li><strong>Hardware capabilities:</strong> Does the node have the VRAM required for the requested model?</li>
          <li><strong>Reputation:</strong> Does this node have a history of high uptime and successful verifiable completions?</li>
          <li><strong>Latency:</strong> Is the node geographically positioned to return the result quickly?</li>
        </ul>

        <h3>3. Model Execution</h3>
        <p>
          The selected contributor node receives the encrypted payload, runs the requested model inference (e.g., Llama 3, Stable Diffusion), and generates the response. The node cryptographically signs the output using its Solana wallet private key.
        </p>

        <h3>4. Verification</h3>
        <p>
          Before the response is returned to the user, the signed output is checked against the original request. The network validates:
        </p>
        <ul>
          <li>The output hash matches the returned response.</li>
          <li>The digital signature maps correctly to the compute node's public key.</li>
          <li>The model metadata aligns with the original request.</li>
        </ul>
        <p>
          A dedicated network of independent Verification Nodes that reach committee consensus on every task is on the roadmap (see Protocol Roadmap, Phase 2) and not yet active, today this check is performed centrally before anchoring.
        </p>

        <h3>5. On-Chain Anchoring</h3>
        <p>
          Once validation passes, a cryptographic proof is generated. This proof (containing hashes, signatures, and timestamps, but not the raw prompt unless Public mode is used) is anchored to the Solana blockchain.
        </p>
        <p>
          Finally, the response is decrypted and displayed to the user, complete with a permanent, verifiable proof link.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
