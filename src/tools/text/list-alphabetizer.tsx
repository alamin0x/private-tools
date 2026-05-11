import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

export default function ListAlphabetizer() {
  const [input, setInput] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [trimLines, setTrimLines] = useState(true);
  const [removeBlanks, setRemoveBlanks] = useState(true);

  const process = () => {
    let lines = input.split("\n");
    if (trimLines) lines = lines.map(l => l.trim());
    if (removeBlanks) lines = lines.filter(Boolean);
    lines.sort((a, b) => order === "asc" ? a.localeCompare(b) : b.localeCompare(a));
    return lines.join("\n");
  };

  const result = input ? process() : "";

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <ToolHeader title="List Alphabetizer" description="Sort any list of lines alphabetically in ascending or descending order." />
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          {(["asc", "desc"] as const).map(o => (
            <button key={o} onClick={() => setOrder(o)}
              className="px-4 py-1.5 text-sm font-semibold transition-all"
              style={order === o ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" } : { color: "var(--color-muted-foreground)" }}>
              {o === "asc" ? "A → Z" : "Z → A"}
            </button>
          ))}
        </div>
        {[{ label: "Trim whitespace", val: trimLines, set: setTrimLines }, { label: "Remove blank lines", val: removeBlanks, set: setRemoveBlanks }].map(({ label, val, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--color-foreground)" }}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} className="accent-violet-500" />{label}
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted-foreground)" }}>Input ({input ? input.split("\n").filter(Boolean).length : 0} lines)</p>
          <textarea className="input-base h-64 font-mono text-sm resize-y" placeholder="One item per line..." value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className="relative">
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted-foreground)" }}>Sorted Output</p>
          <textarea className="input-base h-64 font-mono text-sm resize-y" readOnly value={result} />
          {result && <div className="absolute top-6 right-2"><CopyButton text={result} /></div>}
        </div>
      </div>
    </div>
  );
}
