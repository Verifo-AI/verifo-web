import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";
import { Globe, Lock, Shield } from "lucide-react";

export default function PrivacyModes() {
  return (
    <Layout>
      <ArticleLayout
        title="Privacy and Data Control"
        subtitle="Flexible privacy modes designed for everyone from open researchers to enterprise organizations."
        category="Platform"
        categoryLink="/platform/how-it-works"
        relatedLinks={[
          { title: "How It Works", href: "/platform/how-it-works" },
          { title: "On-Chain Proof", href: "/platform/on-chain-proof" },
          { title: "Security Architecture", href: "/platform/security" },
        ]}
      >
        <p>
          Verifiable AI requires anchoring cryptographic proofs to a public ledger. However, public ledgers are visible to everyone. Verifo solves this tension through three distinct privacy modes, allowing you to choose exactly what data becomes public and what remains strictly confidential.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose my-12">
          <div className="p-6 bg-card border border-border rounded-xl">
            <Globe className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Public Mode</h3>
            <p className="text-sm text-muted-foreground">Full transparency. Prompt and output are stored in plaintext on-chain.</p>
          </div>
          <div className="p-6 bg-card border border-primary/50 shadow-md rounded-xl relative">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">Default</div>
            <Lock className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Private Mode</h3>
            <p className="text-sm text-muted-foreground">Standard privacy. Only cryptographic hashes are anchored on-chain.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-xl">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Enterprise Mode</h3>
            <p className="text-sm text-muted-foreground">Zero-knowledge. End-to-end encryption with private verification enclaves.</p>
          </div>
        </div>

        <h2>Public Mode</h2>
        <p>
          In Public Mode, the entire prompt and the entire AI response are written to the Solana blockchain alongside the standard proof metadata. 
        </p>
        <p>
          <strong>Use cases:</strong> Open-source research, public algorithmic audits, decentralized journalism, and building transparent community agents. Anyone in the world can view the prompt, view the result, and independently verify the math.
        </p>

        <h2>Private Mode (Default)</h2>
        <p>
          This is the default setting for all users. In Private Mode, your raw text, images, and code are never written to the blockchain.
        </p>
        <p>
          Instead, the Verifo protocol calculates a SHA-256 hash of your prompt and a SHA-256 hash of the output. Only these hashes are anchored on-chain. The actual content is encrypted and stored either locally on your device or in Verifo's decentralized storage network, accessible only by your wallet signature.
        </p>
        <p>
          <strong>How verification works:</strong> If you ever need to prove the authenticity of the interaction, you can provide the plaintext prompt and output to a third party. They can hash the text themselves and confirm that their hash matches the immutable hash stored on Solana.
        </p>

        <h2>Enterprise Mode</h2>
        <p>
          For organizations handling proprietary code bases, PII, or classified data, standard encryption is not enough. Enterprise Mode utilizes fully end-to-end encrypted pipelines.
        </p>
        <p>
          In this mode, prompts are encrypted client-side using the public key of a specific, vetted, highly-trusted enclave node. The Verifo router cannot read the prompt. The network verifiers cannot read the prompt. The data is only decrypted inside a secure hardware enclave (such as Intel SGX or AWS Nitro) at the moment of inference.
        </p>
        <p>
          The resulting proof contains zero-knowledge attestations that the correct model was run inside the secure enclave, providing a complete audit trail without ever exposing the underlying data to the network or the public ledger.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
