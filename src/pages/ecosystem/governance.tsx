import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";
import { Coins, Vote, Gift, Users, Zap, Shield, Server, Wifi, HardDrive, CheckCircle2, Circle } from "lucide-react";

function DonutChart() {
  const size = 200;
  const cx = 100;
  const cy = 100;
  const r = 72;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * r;
  const communityPct = 0.97;
  const communityDash = communityPct * circumference;
  const contribDash = (1 - communityPct) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            strokeDasharray={`${communityDash} ${circumference - communityDash}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="butt"
          />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="hsl(var(--primary) / 0.35)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${contribDash} ${circumference - contribDash}`}
            strokeDashoffset={circumference * 0.25 - communityDash}
            strokeLinecap="butt"
          />
          <text x={cx} y={cy - 8} textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 700, fill: 'hsl(var(--foreground))' }}>1B VRF</text>
          <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}>Fixed Supply</text>
        </svg>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: 'hsl(var(--primary))' }} />
          <span className="text-muted-foreground">Community <span className="font-semibold text-foreground">97%</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: 'hsl(var(--primary) / 0.35)' }} />
          <span className="text-muted-foreground">Contributors <span className="font-semibold text-foreground">3%</span></span>
        </div>
      </div>
    </div>
  );
}

const UTILITIES = [
  { icon: Vote, label: "Governance voting" },
  { icon: Gift, label: "Contributor rewards" },
  { icon: Zap, label: "Ecosystem incentives" },
  { icon: Users, label: "Community grants" },
  { icon: Shield, label: "Future staking" },
  { icon: Coins, label: "Network participation" },
];

const NODE_TYPES = [
  { icon: Server, label: "Compute Nodes" },
  { icon: CheckCircle2, label: "Verification Nodes" },
  { icon: HardDrive, label: "Storage Nodes" },
  { icon: Wifi, label: "Relay Nodes" },
];

const TIMELINE_STEPS = [
  { label: "Network Launch", done: true },
  { label: "Community Growth", done: false },
  { label: "Contributor Network", done: false },
  { label: "$VRF Token", done: false },
  { label: "DAO Launch", done: false },
  { label: "On-chain Governance", done: false },
];

export default function Governance() {
  return (
    <Layout>
      <ArticleLayout
        title="Governance & Token"
        subtitle="How the Verifo protocol will be owned, directed, and rewarded by its community."
        category="Ecosystem"
        categoryLink="/ecosystem/roadmap"
        relatedLinks={[
          { title: "Developer API", href: "/ecosystem/developer-api" },
          { title: "Roadmap", href: "/ecosystem/roadmap" },
          { title: "About Verifo", href: "/ecosystem/about" },
        ]}
      >

        {/* Governance intro */}
        <div className="not-prose mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border" style={{ background: 'hsl(var(--primary) / 0.08)', borderColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))' }}>
            Coming Soon
          </span>
        </div>

        <p>
          The Verifo protocol is designed from the ground up to be community-owned. Today, in the early network phase, the core team manages protocol parameters to ship updates quickly and keep the network stable. As the network matures, control will progressively transfer to a Decentralized Autonomous Organization (DAO) governed by token holders.
        </p>

        {/* DAO section */}
        <h2>Decentralized Autonomous Organization (DAO)</h2>
        <p>
          The DAO is the governance engine of the Verifo protocol. Once activated, any $VRF token holder will be able to propose and vote on protocol decisions. No single entity — including the founding team — will be able to override a community-approved proposal.
        </p>

        <div className="not-prose my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Contributor Incentives", body: "Adjust reward ratios across Compute, Verification, Storage, and Relay nodes." },
            { title: "Treasury Allocation", body: "Direct protocol treasury funds toward grants, audits, or ecosystem growth." },
            { title: "Ecosystem Funding", body: "Vote on which projects and integrations receive community grants." },
            { title: "Network Upgrades", body: "Approve or reject changes to core protocol parameters and node requirements." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border p-5" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <p className="font-semibold text-sm mb-1" style={{ color: 'hsl(var(--foreground))' }}>{item.title}</p>
              <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.body}</p>
            </div>
          ))}
        </div>

        {/* $VRF Token */}
        <h2>$VRF — Native Protocol Token</h2>
        <p>
          $VRF is the native token of the Verifo protocol. It is designed to align three groups — contributors, users, and the broader ecosystem — around the long-term success of the network. Holding $VRF gives you a stake and a voice in how the protocol evolves.
        </p>

        {/* Token Utility */}
        <h2>Token Utility</h2>
        <p>Planned uses for $VRF once the token launches:</p>

        <div className="not-prose my-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {UTILITIES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <Icon className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--primary))' }} />
              <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Token Supply */}
        <h2>Token Supply</h2>
        <p>
          The total supply of $VRF is fixed. There is no inflation mechanism and no additional minting planned after the initial distribution.
        </p>

        <div className="not-prose my-8 rounded-2xl border p-8 text-center" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <p className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            1,000,000,000
          </p>
          <p className="text-xl font-bold mb-3" style={{ color: 'hsl(var(--primary))' }}>VRF</p>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Fixed supply. No additional minting planned.
          </p>
        </div>

        {/* Planned Allocation */}
        <h2>Planned Allocation</h2>
        <p>
          The token supply is split into two allocations. The vast majority goes directly to the community through public distribution and ecosystem participation. The smaller allocation is reserved exclusively for the contributors who run the network — not the team.
        </p>

        <div className="not-prose my-8 flex flex-col lg:flex-row gap-8 items-center">
          <DonutChart />
          <div className="flex-1 w-full space-y-4">
            <div className="rounded-xl border p-5" style={{ background: 'hsl(var(--primary) / 0.06)', borderColor: 'hsl(var(--primary) / 0.25)' }}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-bold text-lg" style={{ color: 'hsl(var(--foreground))' }}>Community Distribution</p>
                  <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Public distribution and ecosystem participation</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>97%</p>
                  <p className="text-xs font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>970,000,000 VRF</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-5" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-bold text-lg" style={{ color: 'hsl(var(--foreground))' }}>Protocol Contributor Rewards</p>
                  <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Reserved for node contributors — not a team allocation</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-extrabold" style={{ color: 'hsl(var(--foreground))' }}>3%</p>
                  <p className="text-xs font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>30,000,000 VRF</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Distribution detail */}
        <h2>Community Distribution</h2>
        <p>
          970,000,000 VRF — 97% of the total supply — is reserved for the community through public distribution and ecosystem participation. This is the primary allocation and is designed to make $VRF broadly accessible to everyone who uses or supports the Verifo network.
        </p>

        <div className="not-prose my-6 rounded-xl border px-6 py-4" style={{ background: 'hsl(var(--primary) / 0.05)', borderColor: 'hsl(var(--primary) / 0.2)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'hsl(var(--primary))' }}>Coming Soon</p>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            The public distribution mechanism, including eligibility criteria and timeline, will be announced as the network approaches the token launch phase.
          </p>
        </div>

        {/* Contributor Rewards detail */}
        <h2>Protocol Contributor Rewards</h2>
        <p>
          30,000,000 VRF — 3% of the total supply — is reserved exclusively for contributors who power the network. This allocation is earned through real contributions of compute, bandwidth, verification, or storage capacity. It is not a team allocation.
        </p>

        <div className="not-prose my-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NODE_TYPES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
              <span className="text-xs font-medium" style={{ color: 'hsl(var(--foreground))' }}>{label}</span>
            </div>
          ))}
        </div>

        <p>
          Rewards are earned by contributing real resources to the protocol — not through team allocation, investor rounds, or pre-sale mechanics. If you run a node and contribute to the network, you are eligible.
        </p>

        <div className="not-prose my-6 rounded-xl border px-6 py-4" style={{ background: 'hsl(var(--primary) / 0.05)', borderColor: 'hsl(var(--primary) / 0.2)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'hsl(var(--primary))' }}>Coming Soon</p>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            $VRF contributor reward distribution will launch alongside the DAO. Contributors who are active on the network before launch will be considered for retroactive eligibility.
          </p>
        </div>

        {/* Governance Timeline */}
        <h2>Governance Timeline</h2>
        <p>
          Governance is a long-term commitment. The path from today's early network to full on-chain decentralization follows these stages:
        </p>

        <div className="not-prose my-10 space-y-0">
          {TIMELINE_STEPS.map((step, i) => {
            const isLast = i === TIMELINE_STEPS.length - 1;
            const isActive = step.done;
            return (
              <div key={step.label} className="relative flex items-start gap-4 pb-8">
                {/* vertical connector */}
                {!isLast && (
                  <div
                    className="absolute left-[15px] top-7 w-0.5 h-full"
                    style={{ background: isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                  />
                )}
                {/* dot */}
                <div className="relative z-10 shrink-0 mt-0.5">
                  {isActive ? (
                    <CheckCircle2 className="w-8 h-8" style={{ color: 'hsl(var(--primary))' }} />
                  ) : (
                    <Circle className="w-8 h-8" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`font-semibold text-base ${isActive ? '' : ''}`} style={{ color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                    {step.label}
                    {isActive && (
                      <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest" style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
                        Active
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </ArticleLayout>
    </Layout>
  );
}
