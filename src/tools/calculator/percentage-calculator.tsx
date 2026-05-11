import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

type Mode = "percentOf"|"whatPct"|"increase"|"decrease"|"diff";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("percentOf");
  const [a, setA] = useState(""); const [b, setB] = useState("");

  const calc = (): string => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return "";
    switch (mode) {
      case "percentOf": return `${((x / 100) * y).toFixed(4).replace(/\.?0+$/, "")}`;
      case "whatPct": return `${((x / y) * 100).toFixed(4).replace(/\.?0+$/, "")}%`;
      case "increase": return `${(y * (1 + x / 100)).toFixed(4).replace(/\.?0+$/, "")}`;
      case "decrease": return `${(y * (1 - x / 100)).toFixed(4).replace(/\.?0+$/, "")}`;
      case "diff": return `${(((y - x) / x) * 100).toFixed(2)}%`;
    }
  };

  const MODES: { key: Mode; label: string; qa: [string, string]; desc: string }[] = [
    { key: "percentOf", label: "% of Number", qa: ["Percentage (%)", "Of number"], desc: `${a||"X"}% of ${b||"Y"}` },
    { key: "whatPct", label: "What % is", qa: ["Number", "Of number"], desc: `${a||"X"} is what % of ${b||"Y"}` },
    { key: "increase", label: "% Increase", qa: ["Increase by (%)", "From number"], desc: `${b||"Y"} increased by ${a||"X"}%` },
    { key: "decrease", label: "% Decrease", qa: ["Decrease by (%)", "From number"], desc: `${b||"Y"} decreased by ${a||"X"}%` },
    { key: "diff", label: "% Change", qa: ["From", "To"], desc: `From ${a||"X"} to ${b||"Y"}` },
  ];
  const current = MODES.find(m => m.key === mode)!;
  const result = calc();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <ToolHeader title="Percentage Calculator" description="Calculate percentages, increases, decreases, and changes instantly." />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {MODES.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)}
            className="py-2 px-3 rounded-lg text-xs font-semibold transition-all"
            style={mode === m.key ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" } : { background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <p className="text-sm font-semibold mb-4 text-center" style={{ color: "var(--color-foreground)" }}>{current.desc} = ?</p>
        <div className="grid grid-cols-2 gap-3">
          {current.qa.map((lbl, i) => (
            <div key={i}>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>{lbl}</label>
              <input type="number" className="input-base" placeholder="0" value={i === 0 ? a : b} onChange={e => i === 0 ? setA(e.target.value) : setB(e.target.value)} />
            </div>
          ))}
        </div>
        {result && (
          <div className="mt-4 p-3 rounded-lg flex items-center justify-between" style={{ background: "rgba(124,90,243,0.1)", border: "1px solid rgba(124,90,243,0.25)" }}>
            <span className="text-2xl font-extrabold" style={{ color: "var(--color-primary-light)" }}>{result}</span>
            <CopyButton text={result} />
          </div>
        )}
      </div>
    </div>
  );
}
