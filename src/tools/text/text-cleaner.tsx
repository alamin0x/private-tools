import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

export default function TextCleaner() {
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState({ extraSpaces: true, blankLines: true, tabs: true, lineBreaks: false, lowercase: false, special: false });

  const toggle = (k: keyof typeof opts) => setOpts(p => ({ ...p, [k]: !p[k] }));

  const clean = () => {
    let t = input;
    if (opts.tabs) t = t.replace(/\t/g, " ");
    if (opts.extraSpaces) t = t.replace(/ {2,}/g, " ").split("\n").map(l => l.trim()).join("\n");
    if (opts.blankLines) t = t.replace(/\n{3,}/g, "\n\n");
    if (opts.lineBreaks) t = t.replace(/\n/g, " ");
    if (opts.lowercase) t = t.toLowerCase();
    if (opts.special) t = t.replace(/[^\w\s.,!?'"()-]/g, "");
    return t.trim();
  };

  const result = input ? clean() : "";
  const CHECKS = [
    { key: "extraSpaces", label: "Remove extra spaces" },
    { key: "blankLines", label: "Remove extra blank lines" },
    { key: "tabs", label: "Convert tabs to spaces" },
    { key: "lineBreaks", label: "Remove line breaks" },
    { key: "lowercase", label: "Convert to lowercase" },
    { key: "special", label: "Remove special characters" },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <ToolHeader title="Text Cleaner" description="Remove extra whitespace, blank lines, special characters, and more." />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CHECKS.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded-lg" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}>
            <input type="checkbox" checked={opts[key]} onChange={() => toggle(key)} className="accent-violet-500" />{label}
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted-foreground)" }}>Input ({input.length} chars)</p>
          <textarea className="input-base h-52 font-mono text-sm resize-y" placeholder="Paste messy text..." value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className="relative">
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted-foreground)" }}>Cleaned ({result.length} chars)</p>
          <textarea className="input-base h-52 font-mono text-sm resize-y" readOnly value={result} />
          {result && <div className="absolute top-6 right-2"><CopyButton text={result} /></div>}
        </div>
      </div>
    </div>
  );
}
