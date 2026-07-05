import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function Security() {
  return (
    <Layout>
      <ArticleLayout
        title="Security Architecture"
        subtitle="How cryptographic signatures and verification nodes prevent tampering and ensure network integrity."
        category="Platform"
        categoryLink="/platform/how-it-works"
        relatedLinks={[
          { title: "How It Works", href: "/platform/how-it-works" },
          { title: "On-Chain Proof", href: "/platform/on-chain-proof" },
          { title: "Privacy Modes", href: "/platform/privacy-modes" },
        ]}
      >
        <p>
          Decentralized networks operate on a fundamental principle: trust no one, verify everything. Because Verifo relies on community-owned hardware to run inference, the security architecture is designed to assume that any given compute node might be malicious or faulty.
        </p>
        <p>
          We secure the network through a combination of cryptographic signatures, redundant verification, and deterministic hashing.
        </p>

        <h2>Cryptographic Signatures</h2>
        <p>
          Identity in the Verifo network is entirely wallet-based. There are no usernames, passwords, or centralized API tokens for nodes. Every compute node, relay node, witness node, verification node, and storage node is identified by a Solana wallet public key.
        </p>
        <p>
          When a compute node finishes generating an AI response, it must sign the output hash using its private key before returning it to the router. This creates a permanent, undeniable mathematical link between the hardware provider and the specific output they generated. A node cannot deny having produced a specific output, nor can a user forge an output and claim a specific node produced it.
        </p>

        <h2>Hash Verification</h2>
        <p>
          Digital signatures prove <em>who</em> generated the output, but they do not prove that the output is <em>correct</em>. That is the job of Verification Nodes.
        </p>
        <p>
          When a compute node submits a completed task, the data payload (including the prompt hash, output hash, model metadata, and signature) is sent to a randomly selected committee of Verification Nodes.
        </p>
        <p>
          These nodes independently calculate the hashes and verify the signatures. The protocol requires a strict consensus threshold before a task is considered valid. If the verifiers agree, an attestation is signed and the proof is anchored to Solana. If they disagree, the task is rejected, the compute node's reputation is slashed, and the task is re-routed to a new node.
        </p>

        <h2>Tamper Detection</h2>
        <p>
          The pipeline is highly sensitive to tampering. Because a SHA-256 hash changes completely if even a single character is altered, any interference (whether by a malicious ISP, a compromised router, or a faulty storage drive) results in a hash mismatch.
        </p>
        <p>
          If an attacker attempts to alter the prompt en route to the compute node, the resulting output hash will not correspond to the user's original prompt signature. If an attacker attempts to alter the output before it reaches the user, the verification nodes will flag the signature mismatch. 
        </p>

        <h2>Encrypted Storage</h2>
        <p>
          By default, AI task history and generated artifacts (such as generated images or large code bases) are stored on the Verifo decentralized storage network. All data is encrypted at rest using AES-GCM-256 before it ever leaves the user's client or the secure compute enclave. 
        </p>
        <p>
          Storage nodes are completely blind to the data they host. They hold encrypted shards, ensuring data redundancy and availability without compromising user privacy.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
