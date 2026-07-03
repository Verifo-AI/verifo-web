import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function GettingStarted() {
  return (
    <Layout>
      <ArticleLayout
        title="Getting Started with Verifo"
        subtitle="A step-by-step guide to running your first verifiable AI inference."
        category="For AI Users"
        categoryLink="/users/getting-started"
        relatedLinks={[
          { title: "AI Capabilities", href: "/users/ai-capabilities" },
          { title: "Proof Explorer", href: "/users/proof-explorer" },
          { title: "Pricing & Credits", href: "/users/pricing" },
        ]}
      >
        <p>
          Using the Verifo Network is as simple as using any centralized AI provider, with the added benefit of complete cryptographic verification. This guide will walk you through setting up an account and running your first task.
        </p>

        <h2>Step 1: Access the Platform</h2>
        <p>
          You can interact with Verifo through our intuitive Web App dashboard or programmatically via our Developer API. For this guide, we'll focus on the Web App.
        </p>

        <h2>Step 2: Create an Account</h2>
        <p>
          Verifo supports both Web3 and Web2 onboarding:
        </p>
        <ul>
          <li><strong>Web3 (Recommended):</strong> Connect any Solana wallet (Phantom, Solflare, Backbone) to authenticate instantly. Your wallet becomes your identity, and your history is secured by your keys.</li>
          <li><strong>Web2:</strong> Sign up with an email and password. Verifo will automatically provision a non-custodial smart wallet for you in the background to handle proof anchoring.</li>
        </ul>

        <h2>Step 3: Receive Free Credits</h2>
        <p>
          Every new account receives 100 free inference credits. This is enough to run dozens of chat queries, generate a few images, or test our coding models. No credit card or crypto deposit is required to start.
        </p>

        <h2>Step 4: Submit a Prompt</h2>
        <p>
          Navigate to the <strong>Playground</strong>. 
        </p>
        <ol>
          <li>Select your desired AI Task Type from the dropdown (e.g., Chat, Image Generation, Code).</li>
          <li>Select the specific model you want to use (e.g., Llama 3 70B).</li>
          <li>Type your prompt.</li>
          <li>Click <strong>Submit</strong>.</li>
        </ol>

        <h2>Step 5: Execution and Verification</h2>
        <p>
          Unlike centralized services where you wait on a single server, your request is instantly routed to the optimal community node. The node runs the inference, and verification nodes validate the math. This entire process typically takes less than 2 seconds for standard chat tasks.
        </p>
        <p>
          The AI response will stream into your dashboard exactly as you are used to.
        </p>

        <h2>Step 6: View the Cryptographic Proof</h2>
        <p>
          Once the response is complete, you will see a green "Verified" badge appear next to the message. Clicking this badge opens the Proof Inspector, where you can view the transaction ID, the node signature, and the hashes anchored to the Solana blockchain.
        </p>

        <h2>Step 7: Access Your History</h2>
        <p>
          All of your tasks are automatically saved in the <strong>History</strong> tab. Because you are using Private Mode (the default), your prompts are encrypted locally. Only you can read your history, but you retain the ability to cryptographically prove any past interaction.
        </p>
      </ArticleLayout>
    </Layout>
  );
}
