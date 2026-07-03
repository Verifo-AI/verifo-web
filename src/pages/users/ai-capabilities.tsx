import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function AiCapabilities() {
  return (
    <Layout>
      <ArticleLayout
        title="AI Task Types and Capabilities"
        subtitle="The Verifo network supports a massive range of open-source and proprietary models, categorized by task type."
        category="For AI Users"
        categoryLink="/users/getting-started"
        relatedLinks={[
          { title: "Getting Started", href: "/users/getting-started" },
          { title: "Proof Explorer", href: "/users/proof-explorer" },
          { title: "Pricing & Credits", href: "/users/pricing" },
        ]}
      >
        <p>
          The Verifo network is model-agnostic. Rather than building our own proprietary foundation models, we provide the decentralized infrastructure to run the world's best models securely and verifiably.
        </p>

        <h2>1. Chat & Reasoning</h2>
        <p>
          Conversational AI for writing, brainstorming, summarization, and deep reasoning tasks.
        </p>
        <ul>
          <li><strong>Models:</strong> Llama 3 (8B, 70B), Mixtral 8x22B, and Verifo's own managed cloud models.</li>
          <li><strong>Typical Cost:</strong> 1 credit per interaction.</li>
          <li><strong>Response Time:</strong> 1-3 seconds.</li>
        </ul>

        <h2>2. Coding & Development</h2>
        <p>
          Models specifically fine-tuned for code generation, architectural design, debugging, and comprehensive documentation.
        </p>
        <ul>
          <li><strong>Models:</strong> DeepSeek Coder, Phind-CodeLlama, CodeQwen.</li>
          <li><strong>Typical Cost:</strong> 2-5 credits depending on context length.</li>
          <li><strong>Response Time:</strong> 2-5 seconds.</li>
        </ul>

        <h2>3. Image Generation</h2>
        <p>
          High-fidelity text-to-image generation supporting various aspect ratios, styles (photorealistic, anime, 3D), and negative prompting.
        </p>
        <ul>
          <li><strong>Models:</strong> Stable Diffusion XL, SDXL Lightning, PixArt-alpha.</li>
          <li><strong>Typical Cost:</strong> 10-50 credits depending on resolution and step count.</li>
          <li><strong>Response Time:</strong> 5-15 seconds.</li>
        </ul>

        <h2>4. Video Generation</h2>
        <p>
          Generate short, high-quality video clips directly from text descriptions.
        </p>
        <ul>
          <li><strong>Models:</strong> Stable Video Diffusion, open-source animation models.</li>
          <li><strong>Typical Cost:</strong> 100-300 credits per generation.</li>
          <li><strong>Response Time:</strong> 1-3 minutes.</li>
        </ul>

        <h2>5. Deep Research</h2>
        <p>
          AI that has access to the live web. It can search, scrape, synthesize, and provide comprehensive reports with verified citations.
        </p>
        <ul>
          <li><strong>Models:</strong> Custom Verifo RAG pipelines backed by Llama 3.</li>
          <li><strong>Typical Cost:</strong> 10-20 credits.</li>
          <li><strong>Response Time:</strong> 10-30 seconds.</li>
        </ul>

        <h2>6. Translation & Localization</h2>
        <p>
          High-accuracy context-aware translation across more than 100 global languages.
        </p>
        <ul>
          <li><strong>Models:</strong> SeamlessM4T, specialized linguistic models.</li>
          <li><strong>Typical Cost:</strong> 1-3 credits per block.</li>
          <li><strong>Response Time:</strong> 1-2 seconds.</li>
        </ul>

        <h2>7. Voice AI</h2>
        <p>
          Advanced Text-to-Speech (TTS) for natural, emotive voice generation, and Speech-to-Text (ASR) for highly accurate transcription.
        </p>
        <ul>
          <li><strong>Models:</strong> Whisper V3, XTTS.</li>
          <li><strong>Typical Cost:</strong> 5 credits per minute of audio.</li>
          <li><strong>Response Time:</strong> Real-time streaming available.</li>
        </ul>

        <h2>8. AI Agents (Coming Soon)</h2>
        <p>
          Autonomous agents that can complete multi-step, complex tasks by breaking them down, using tools, and evaluating their own progress.
        </p>
        <ul>
          <li><strong>Status:</strong> Phase 3 Roadmap.</li>
          <li><strong>Typical Cost:</strong> 20-100 credits per run.</li>
        </ul>
      </ArticleLayout>
    </Layout>
  );
}
