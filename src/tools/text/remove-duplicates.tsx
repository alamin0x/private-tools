import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";
import { Filter } from "lucide-react";

export default function RemoveDuplicates() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);

  const process = () => {
    const lines = input.split("\n");
    const seen = new Set<string>();
    return lines.filter((line) => {
      const key = trimLines ? line.trim() : line;
      const cmpKey = caseSensitive ? key : key.toLowerCase();
      if (seen.has(cmpKey)) return false;
      seen.add(cmpKey); return true;
    }).join("\n");
  };

  const result = input ? process() : "";
  const removed = input ? input.split("\n").length - result.split("\n").filter(Boolean).length : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <ToolHeader title="Remove Duplicate Lines" description="Remove repeated lines from any list or text block instantly." />
      <div className="flex gap-4 flex-wrap">
        {[{ label: "Case sensitive", val: caseSensitive, set: setCaseSensitive }, { label: "Trim whitespace", val: trimLines, set: setTrimLines }].map(({ label, val, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--color-foreground)" }}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} className="accent-violet-500" />
            {label}
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Input</label></div>
          <textarea className="input-base h-64 font-mono text-sm resize-y" placeholder="Paste lines here..." value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Output</label>
            <span className="text-xs" style={{ color: removed > 0 ? "#34d399" : "var(--color-muted-foreground)" }}>{removed > 0 ? `${removed} duplicate${removed > 1 ? "s" : ""} removed` : ""}</span>
          </div>
          <div className="relative">
            <textarea className="input-base h-64 font-mono text-sm resize-y" readOnly value={result} />
            {result && <div className="absolute top-2 right-2"><CopyButton text={result} /></div>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <Filter className="h-4 w-4" />
        {input ? `${input.split("\n").length} lines in → ${result.split("\n").filter(Boolean).length} lines out` : "Paste text above to begin"}
      </div>
    </div>
  );
}
