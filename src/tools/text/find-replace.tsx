import { useState, useMemo } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

export default function FindReplace() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const { result, count, error } = useMemo(() => {
    if (!find) return { result: input, count: 0, error: "" };

    try {
      const flags = "g" + (caseSensitive ? "" : "i");
      const pattern = useRegex 
        ? new RegExp(find, flags) 
        : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      
      const res = input.replace(pattern, replace);
      const matches = input.match(pattern);
      const matchCount = matches ? matches.length : 0;

      return { result: res, count: matchCount, error: "" };
    } catch (e) {
      return { result: input, count: 0, error: (e as Error).message };
    }
  }, [input, find, replace, useRegex, caseSensitive]);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <ToolHeader title="Find and Replace" description="Find text patterns and replace them — supports plain text and regex." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Find</label>
          <input 
            className="input-base font-mono" 
            placeholder={useRegex ? "Regex pattern…" : "Text to find…"} 
            value={find} 
            onChange={e => setFind(e.target.value)} 
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Replace with</label>
          <input 
            className="input-base font-mono" 
            placeholder="Replacement…" 
            value={replace} 
            onChange={e => setReplace(e.target.value)} 
          />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {[{ label: "Use Regex", val: useRegex, set: setUseRegex }, { label: "Case sensitive", val: caseSensitive, set: setCaseSensitive }].map(({ label, val, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--color-foreground)" }}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} className="accent-violet-500" />{label}
          </label>
        ))}
        {count > 0 && <span className="text-sm font-semibold" style={{ color: "#34d399" }}>{count} match{count > 1 ? "es" : ""} replaced</span>}
      </div>

      {error && <p className="text-sm" style={{ color: "#fb7185" }}>{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted-foreground)" }}>Input</p>
          <textarea 
            className="input-base h-52 font-mono text-sm resize-y" 
            placeholder="Paste text here…" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
          />
        </div>
        <div className="relative">
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted-foreground)" }}>Output</p>
          <textarea className="input-base h-52 font-mono text-sm resize-y" readOnly value={result} />
          {result && result !== input && (
            <div className="absolute top-6 right-2">
              <CopyButton text={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
