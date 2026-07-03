import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function InstallDocs() {
  return (
    <Layout>
      <ArticleLayout
        title="Installing the Verifo Node Client"
        subtitle="Set up the real contributor node client on your own machine and start earning."
        category="For Contributors"
        categoryLink="/contributors/compute"
        relatedLinks={[
          { title: "Compute Contribution", href: "/contributors/compute" },
          { title: "Verification", href: "/contributors/verification" },
          { title: "Rewards & Reputation", href: "/contributors/rewards-reputation" },
          { title: "Contributor Dashboard", href: "/contributors/dashboard" },
        ]}
      >
        <p>
          The Verifo Node client is a small program that runs on your own computer. It detects your machine's real
          CPU, RAM, and GPU, generates a local identity keypair, and proves your node is online by sending signed
          heartbeats to the network — there is no simulated data involved.
        </p>

        <h2>Requirements</h2>
        <ul>
          <li>Node.js 18 or newer installed on the machine you want to contribute.</li>
          <li>A Verifo account, signed in with your Solana wallet.</li>
        </ul>

        <h2>Step 1: Download the client</h2>
        <p>
          On your <a href="/contributors/dashboard">Contributor Dashboard</a>, click{" "}
          <strong>Download Verifo Node Client (.zip)</strong>, then unzip it anywhere on your machine.
        </p>

        <h2>Step 2: Generate a pairing code</h2>
        <p>
          Still on the Contributor Dashboard, click <strong>Generate Pairing Code</strong>. This gives you a
          one-time code, valid for a few minutes, that links the client to your account.
        </p>

        <h2>Step 3: Install and link</h2>
        <p>From inside the unzipped folder, run:</p>
        <pre><code>npm install
node bin/verifo-node.mjs link &lt;PAIRING_CODE&gt;</code></pre>

        <h2>Step 4: Start the node</h2>
        <p>Once linked, start reporting with:</p>
        <pre><code>node bin/verifo-node.mjs start</code></pre>
        <p>
          Leave this process running — it sends a signed heartbeat every 30 seconds. Your dashboard will only show
          your node as "online" while this process is actively running on your machine.
        </p>

        <h2>What happens next</h2>
        <p>
          Depending on your machine's real hardware, your node is automatically classified into a contribution mode
          (witness, relay, or compute). Verified, online nodes are eligible to receive AI tasks and earn USDC
          rewards, and every completion is co-signed on-chain as real proof of activity.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
