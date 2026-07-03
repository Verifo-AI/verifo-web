import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function ProofExplorer() {
  return (
    <Layout>
      <ArticleLayout
        title="Exploring Your Proof History"
        subtitle="How to verify, audit, and share your cryptographic AI task history."
        category="For AI Users"
        categoryLink="/users/getting-started"
        relatedLinks={[
          { title: "Getting Started", href: "/users/getting-started" },
          { title: "AI Capabilities", href: "/users/ai-capabilities" },
          { title: "Pricing & Credits", href: "/users/pricing" },
        ]}
      >
        <p>
          The Proof Explorer is your command center for verifying the integrity of your AI usage. Every prompt you submit and every response you receive is logged here, alongside its cryptographic attestation.
        </p>

        <h2>Navigating the Explorer</h2>
        <p>
          When you open the Proof Explorer from your dashboard, you will see a chronological ledger of your tasks. Each entry displays:
        </p>
        <ul>
          <li><strong>Task Type:</strong> Chat, Code, Image, etc.</li>
          <li><strong>Timestamp:</strong> The exact local time the task was completed.</li>
          <li><strong>Model Used:</strong> The specific architecture (e.g., Llama-3-70b).</li>
          <li><strong>Proof Status:</strong> Verified, Pending, or Failed.</li>
        </ul>

        <h2>Understanding Proof Status</h2>
        <p>
          The health of the network is transparently reflected in the status badges:
        </p>
        <ul>
          <li><strong>Verified (Green):</strong> The task was successfully executed by a compute node, the verification committee reached consensus, and the proof has been successfully anchored to the Solana blockchain.</li>
          <li><strong>Pending (Yellow):</strong> The inference is complete and you have the result, but the network is currently writing the final proof to Solana. This usually resolves within seconds.</li>
          <li><strong>Failed (Red):</strong> The verification nodes detected an anomaly (e.g., a hash mismatch or bad signature). The task was rejected. <strong>You are never charged credits for a failed task.</strong></li>
        </ul>

        <h2>Deep Dive: Inspecting a Proof</h2>
        <p>
          Clicking on any row opens the full Proof Inspector. Here you can see the raw JSON data that was submitted to the blockchain. You can view the compute node's Solana wallet address, verify the digital signatures manually, and follow the link directly to SolanaFM or Solscan to view the on-chain transaction.
        </p>

        <h2>Sharing Proofs</h2>
        <p>
          Verifiability is most powerful when it can be shared. The Proof Explorer allows you to generate a public link for any specific task. 
        </p>
        <p>
          Crucially, <strong>sharing a proof does not expose your private data unless you want it to.</strong> If you ran a task in Private Mode, the public link will only show the cryptographic hashes and the fact that a verified task occurred at that timestamp. If you wish to prove the content, you can optionally attach the plaintext, allowing anyone with the link to hash the text and verify it against the on-chain record.
        </p>

        <h2>Exporting Data</h2>
        <p>
          For enterprise users and developers conducting algorithmic audits, you can export your entire proof history as a structured JSON or CSV file, complete with all hashes, signatures, and transaction IDs for offline analysis.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
