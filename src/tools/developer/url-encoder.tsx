import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode"|"decode">("encode");

  const process = () => {
    if (!input) return "";
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch { return "⚠ Invalid URL encoding"; }
  };

  const result = process();

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <ToolHeader title="URL Encoder / Decoder" description="Encode special characters for URLs or decode percent-encoded strings." />
      <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        {(["encode","decode"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(""); }} className="flex-1 py-2.5 text-sm font-semibold transition-all"
            style={mode === m ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" } : { color: "var(--color-muted-foreground)" }}>
            {m === "encode" ? "Encode URL" : "Decode URL"}
          </button>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>{mode === "encode" ? "Plain Text / URL" : "Encoded URL"}</label>
        <textarea className="input-base h-28 font-mono text-sm resize-y" placeholder={mode === "encode" ? "https://example.com/search?q=hello world&lang=en" : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"} value={input} onChange={e => setInput(e.target.value)} />
      </div>
      {result && (
        <div className="relative rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Result</span>
            <CopyButton text={result} />
          </div>
          <p className="font-mono text-sm break-all" style={{ color: "var(--color-primary-light)" }}>{result}</p>
        </div>
      )}
      <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-muted-foreground)" }}>Common Encodings</p>
        {[["Space", "%20"], ["#", "%23"], ["&", "%26"], ["=", "%3D"], ["/", "%2F"], ["?", "%3F"]].map(([c, e]) => (
          <div key={c} className="flex gap-4 text-xs font-mono">
            <span style={{ color: "var(--color-foreground)" }}>{c}</span>
            <span style={{ color: "var(--color-primary-light)" }}>{e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
