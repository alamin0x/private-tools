import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [sep, setSep] = useState("-");
  const slug = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s]/g,"").trim().replace(/\s+/g, sep);

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <ToolHeader title="Slug Generator" description="Convert text into a clean URL slug for SEO-friendly links." />
      <div>
        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Title or Text</label>
        <input className="input-base text-lg" placeholder="My Awesome Blog Post Title" value={input} onChange={e => setInput(e.target.value)} />
      </div>
      <div className="flex gap-3">
        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Separator:</label>
        {["-", "_", "."].map(s => (
          <button key={s} onClick={() => setSep(s)}
            className="px-3 py-1 rounded-lg text-sm font-mono font-bold transition-all"
            style={sep === s ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" } : { background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
            {s}
          </button>
        ))}
      </div>
      {slug && (
        <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Generated Slug</span>
            <CopyButton text={slug} />
          </div>
          <code className="text-base break-all" style={{ color: "var(--color-primary-light)" }}>{slug}</code>
          <p className="text-xs mt-2" style={{ color: "var(--color-muted-foreground)" }}>
            Preview: <span style={{ color: "var(--color-foreground)" }}>https://example.com/<span style={{ color: "var(--color-primary-light)" }}>{slug}</span></span>
          </p>
        </div>
      )}
    </div>
  );
}
