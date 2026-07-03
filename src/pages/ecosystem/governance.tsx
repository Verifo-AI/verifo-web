import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function Governance() {
  return (
    <Layout>
      <ArticleLayout
        title="Protocol Governance"
        subtitle="How the community will eventually control the parameters of the Verifo network."
        category="Ecosystem"
        categoryLink="/ecosystem/roadmap"
        relatedLinks={[
          { title: "Developer API", href: "/ecosystem/developer-api" },
          { title: "Roadmap", href: "/ecosystem/roadmap" },
          { title: "About Verifo", href: "/ecosystem/about" },
        ]}
      >
        <p>
          Currently, in Phase 1 of the roadmap, the Verifo protocol and its routing infrastructure are managed by the core founding team. This centralized stewardship allows us to ship updates rapidly, fix critical bugs, and optimize the scheduling algorithms in real-time as the network scales.
        </p>
        <p>
          However, the ultimate vision for Verifo is complete decentralization. By Phase 4, control of the protocol will be handed over to a Decentralized Autonomous Organization (DAO).
        </p>

        <h2>The Protocol Treasury</h2>
        <p>
          A small percentage of every AI task fee processed by the network is directed into a protocol treasury. As the network grows, this treasury will accumulate significant value. The DAO will have direct cryptographic control over how these funds are deployed: core development grants, contributor incentive boosts, or strategic partnerships.
        </p>

        <h2>What the DAO Controls</h2>
        <p>
          Once governance is activated, token holders will be able to submit and vote on proposals to alter core protocol parameters:
        </p>
        <ul>
          <li><strong>Fee Distribution Ratios:</strong> Adjusting the percentage of fees that go to Compute vs. Verification vs. Storage nodes.</li>
          <li><strong>Hardware Requirements:</strong> Raising or lowering the minimum trust scores and hardware specs required to join the network.</li>
          <li><strong>Model Whitelisting:</strong> Voting on which new open-source AI models should be officially supported and cached by the network.</li>
          <li><strong>Roadmap Priorities:</strong> Directing the core engineering team on which features to prioritize next.</li>
        </ul>

        <h2>Voting Mechanics</h2>
        <p>
          Governance will be executed on-chain via Solana. Voting power will be token-weighted, meaning those with a larger stake in the network have a proportional say in its direction.
        </p>
        <p>
          To ensure high participation and informed decision-making, the protocol will support Liquid Democracy (delegation). If you do not have the time to research technical proposals, you can delegate your voting power to a trusted community member, engineer, or organization. You retain ownership of your tokens and can revoke delegation at any time.
        </p>

        <h2>The Transition Path</h2>
        <p>
          We are currently designing the governance architecture with input from our earliest contributors. Approved proposals during Phases 2 and 3 will be implemented manually by the core team. By Phase 4, critical protocol parameters will become fully on-chain and self-executing, cementing Verifo as public, community-owned infrastructure.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
