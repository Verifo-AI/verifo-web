import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";
import { CheckCircle2, Circle } from "lucide-react";

export default function Roadmap() {
  return (
    <Layout>
      <ArticleLayout
        title="Protocol Roadmap"
        subtitle="The development phases for the Verifo decentralized AI network."
        category="Ecosystem"
        categoryLink="/ecosystem/roadmap"
        relatedLinks={[
          { title: "Developer API", href: "/ecosystem/developer-api" },
          { title: "Governance", href: "/ecosystem/governance" },
          { title: "About Verifo", href: "/ecosystem/about" },
        ]}
      >
        <p>
          Building a verifiable, decentralized infrastructure layer requires measured, secure progression. We are rolling out the Verifo protocol in four distinct phases to ensure network stability and cryptographic security at every step.
        </p>

        <div className="not-prose my-12 space-y-8">
          
          {/* Phase 1 */}
          <div className="relative pl-8 border-l-2 border-primary pb-8">
            <div className="absolute -left-[11px] top-0 bg-background p-1">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-xl font-bold text-foreground">Phase 1: Compute Launch</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground uppercase tracking-widest">Active</span>
            </div>
            <p className="text-muted-foreground mb-4">Establishing the foundation of the compute network and user access.</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Launch of AI Chat, Image Generation, and Coding tasks</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Credits system implementation and free tier rollout</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Compute Contributors onboarding (GPU inference nodes)</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Solana USDC payment integration</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Basic cryptographic proof anchoring</li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="relative pl-8 border-l-2 border-border pb-8">
            <div className="absolute -left-[11px] top-0 bg-background p-1">
              <Circle className="w-5 h-5 text-primary" />
            </div>
            <div className="mb-2">
              <h3 className="text-xl font-bold text-foreground">Phase 2: Verifiers & API</h3>
            </div>
            <p className="text-muted-foreground mb-4">Decentralizing the verification process and opening the developer platform.</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Launch of Verification Contributors network</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Encrypted task history implementation</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Public Proof Explorer interface</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Developer API Platform (v1) general availability</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="relative pl-8 border-l-2 border-border pb-8">
            <div className="absolute -left-[11px] top-0 bg-background p-1">
              <Circle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="mb-2">
              <h3 className="text-xl font-bold text-foreground">Phase 3: Storage & Agents</h3>
            </div>
            <p className="text-muted-foreground mb-4">Expanding capabilities to handle autonomous tasks and distributed storage.</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Launch of Storage Contributors network</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> AI Agent Platform for multi-step autonomous reasoning</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Complete Reputation System scoring and public leaderboards</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Multi-model automatic routing intelligence</li>
            </ul>
          </div>

          {/* Phase 4 */}
          <div className="relative pl-8">
            <div className="absolute -left-[11px] top-0 bg-background p-1">
              <Circle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="mb-2">
              <h3 className="text-xl font-bold text-foreground">Phase 4: Full Decentralization</h3>
            </div>
            <p className="text-muted-foreground mb-4">Handing protocol control entirely over to the community.</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Fully decentralized scheduling (removing the central router)</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> DAO governance launch and token distribution</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Cross-network proof interoperability</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" /> Automated protocol treasury distributions</li>
            </ul>
          </div>

        </div>
      </ArticleLayout>
    </Layout>
  );
}
