import { useState } from "react";
import ToolHeader from "@/components/tool-header";

export default function DaysUntil() {
  const [target, setTarget] = useState("");
  const [label, setLabel] = useState("");
  const today = new Date(); today.setHours(0,0,0,0);

  const calc = () => {
    if (!target) return null;
    const t = new Date(target); t.setHours(0,0,0,0);
    const diff = Math.round((t.getTime() - today.getTime()) / 86400000);
    const weeks = Math.floor(Math.abs(diff) / 7);
    const months = Math.round(Math.abs(diff) / 30.44);
    return { diff, weeks, months, past: diff < 0 };
  };

  const r = calc();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <ToolHeader title="Days Until Calculator" description="Find out how many days until (or since) any date." />
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Event Name (optional)</label>
          <input className="input-base" placeholder="e.g. New Year, Birthday…" value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Target Date</label>
          <input type="date" className="input-base" value={target} onChange={e => setTarget(e.target.value)} />
        </div>
      </div>
      {r && (
        <div className="rounded-xl p-6 text-center space-y-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          {label && <p className="text-sm font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{label}</p>}
          <p className="text-6xl font-extrabold" style={{ color: r.past ? "#fb7185" : "var(--color-primary-light)" }}>{Math.abs(r.diff)}</p>
          <p className="text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>days {r.past ? "ago" : "to go"}</p>
          <div className="flex justify-center gap-6 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            <span><strong style={{ color: "var(--color-foreground)" }}>{r.weeks}</strong> weeks</span>
            <span><strong style={{ color: "var(--color-foreground)" }}>{r.months}</strong> months</span>
          </div>
          {r.diff === 0 && <p className="text-green-400 font-bold">🎉 That's Today!</p>}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Christmas", date: `${today.getFullYear()}-12-25` },
          { label: "New Year", date: `${today.getFullYear() + 1}-01-01` },
          { label: "Halloween", date: `${today.getFullYear()}-10-31` },
        ].map(({ label: l, date }) => (
          <button key={l} onClick={() => { setTarget(date); setLabel(l); }}
            className="py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
