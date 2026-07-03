import { Layout } from "@/components/layout";
import { ArticleLayout } from "@/components/article-layout";

export default function DeveloperApi() {
  return (
    <Layout>
      <ArticleLayout
        title="Developer API"
        subtitle="Integrate verifiable AI directly into your applications with our REST API."
        category="Ecosystem"
        categoryLink="/ecosystem/roadmap"
        relatedLinks={[
          { title: "Roadmap", href: "/ecosystem/roadmap" },
          { title: "Governance", href: "/ecosystem/governance" },
          { title: "About Verifo", href: "/ecosystem/about" },
        ]}
      >
        <p>
          The Verifo Developer API provides programmatic access to the entire decentralized network. It functions like any standard REST API, meaning you can drop it into your existing applications with minimal code changes.
        </p>

        <h2>Authentication</h2>
        <p>
          All API requests require an API key, which you can generate in your developer dashboard. Send the key in the Authorization header of your requests.
        </p>

        <div className="not-prose my-6 bg-[hsl(28_40%_9%)] border border-border/20 rounded-xl p-4 font-mono text-sm overflow-x-auto text-white/90">
          <pre>
<span className="text-gray-400">Authorization:</span> Bearer vf_live_8x92nd...
          </pre>
        </div>

        <h2>Base URL</h2>
        <div className="not-prose my-6 bg-[hsl(28_40%_9%)] border border-border/20 rounded-xl p-4 font-mono text-sm overflow-x-auto text-white/90">
          <pre>https://api.verifo.sh/v1</pre>
        </div>

        <h2>Core Endpoints</h2>

        <h3>POST /chat</h3>
        <p>Submit a chat or reasoning prompt to the network.</p>
        <div className="not-prose my-4 bg-[hsl(28_40%_9%)] border border-border/20 rounded-xl p-4 font-mono text-sm overflow-x-auto text-white/90">
          <pre>
<span className="text-pink-400">const</span> response = <span className="text-blue-400">await</span> fetch(<span className="text-green-300">'https://api.verifo.sh/v1/chat'</span>, {'{'}
  method: <span className="text-green-300">'POST'</span>,
  headers: {'{'}
    <span className="text-green-300">'Authorization'</span>: <span className="text-green-300">'Bearer YOUR_API_KEY'</span>,
    <span className="text-green-300">'Content-Type'</span>: <span className="text-green-300">'application/json'</span>
  {'}'},
  body: JSON.stringify({'{'}
    model: <span className="text-green-300">'meta-llama/Llama-3-70b-instruct'</span>,
    messages: [
      {'{'} role: <span className="text-green-300">'user'</span>, content: <span className="text-green-300">'Explain zero-knowledge proofs.'</span> {'}'}
    ],
    privacy_mode: <span className="text-green-300">'private'</span>
  {'}'})
{'}'});
          </pre>
        </div>

        <h3>POST /image</h3>
        <p>Generate high-fidelity images via Stable Diffusion models.</p>

        <h3>POST /code</h3>
        <p>Submit specialized coding tasks to fine-tuned developer models.</p>

        <h3>GET /tasks/{'{id}'}</h3>
        <p>Retrieve the status and output of a specific task.</p>

        <h3>GET /tasks/{'{id}'}/proof</h3>
        <p>Retrieve the raw JSON cryptographic proof for a completed task, including all hashes and node signatures.</p>

        <h2>Common Use Cases</h2>
        <ul>
          <li><strong>Customer Support Bots:</strong> Build AI agents that automatically log verifiable proofs of their responses to protect your company from liability.</li>
          <li><strong>IDE Extensions:</strong> Integrate decentralized code generation directly into VS Code or Cursor.</li>
          <li><strong>Enterprise Audit Trails:</strong> Use Enterprise Privacy Mode to run proprietary internal data through LLMs while maintaining a mathematically provable audit trail of who ran what, without leaking the actual data.</li>
        </ul>
      </ArticleLayout>
    </Layout>
  );
}
