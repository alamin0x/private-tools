import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";
import { Timer, RefreshCw } from "lucide-react";

const FIELDS = ["Minute", "Hour", "Day", "Month", "Weekday"] as const;
type Field = typeof FIELDS[number];

const OPTIONS: Record<Field, { label: string; value: string }[]> = {
  Minute:  [{ label: "Every minute (*)", value: "*" }, ...Array.from({ length: 60 }, (_, i) => ({ label: String(i), value: String(i) }))],
  Hour:    [{ label: "Every hour (*)", value: "*" }, ...Array.from({ length: 24 }, (_, i) => ({ label: String(i), value: String(i) }))],
  Day:     [{ label: "Every day (*)", value: "*" }, ...Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }))],
  Month:   [{ label: "Every month (*)", value: "*" }, ...["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => ({ label: m, value: String(i + 1) }))],
  Weekday: [{ label: "Every day (*)", value: "*" }, ...["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((d, i) => ({ label: d, value: String(i) }))],
};

function describe(vals: Record<Field, string>): string {
  const parts: string[] = [];
  const hr   = vals.Hour    === "*" ? "every hour"   : `at ${String(vals.Hour).padStart(2,"0")}:${String(vals.Minute === "*" ? "00" : vals.Minute).padStart(2,"0")}`;
  const day  = vals.Day     === "*" ? ""              : `on day ${vals.Day}`;
  const mon  = vals.Month   === "*" ? ""              : `in ${OPTIONS.Month.find(o => o.value === vals.Month)?.label ?? vals.Month}`;
  const wday = vals.Weekday === "*" ? ""              : `on ${OPTIONS.Weekday.find(o => o.value === vals.Weekday)?.label ?? vals.Weekday}s`;

  if (vals.Minute === "*" && vals.Hour === "*") parts.push("Every minute");
  else if (vals.Minute !== "*" && vals.Hour === "*") parts.push(`At minute ${vals.Minute} of every hour`);
  else parts.push(`At ${hr}`);
  if (day) parts.push(day);
  if (mon) parts.push(mon);
  if (wday) parts.push(wday);
  return parts.join(", ") + ".";
}

const PRESETS: { label: string; vals: Record<Field, string>; desc: string }[] = [
  { label: "Every minute",   vals: { Minute:"*",  Hour:"*",  Day:"*", Month:"*", Weekday:"*" }, desc: "* * * * *" },
  { label: "Every hour",     vals: { Minute:"0",  Hour:"*",  Day:"*", Month:"*", Weekday:"*" }, desc: "0 * * * *" },
  { label: "Every day 8am",  vals: { Minute:"0",  Hour:"8",  Day:"*", Month:"*", Weekday:"*" }, desc: "0 8 * * *" },
  { label: "Every Monday",   vals: { Minute:"0",  Hour:"9",  Day:"*", Month:"*", Weekday:"1" }, desc: "0 9 * * 1" },
  { label: "1st of month",   vals: { Minute:"0",  Hour:"0",  Day:"1", Month:"*", Weekday:"*" }, desc: "0 0 1 * *" },
  { label: "Every weekday",  vals: { Minute:"0",  Hour:"9",  Day:"*", Month:"*", Weekday:"1-5" }, desc: "0 9 * * 1-5" },
];

export default function CronBuilder() {
  const [vals, setVals] = useState<Record<Field, string>>({ Minute:"0", Hour:"*", Day:"*", Month:"*", Weekday:"*" });

  const set = (f: Field, v: string) => setVals((p) => ({ ...p, [f]: v }));
  const expr = `${vals.Minute} ${vals.Hour} ${vals.Day} ${vals.Month} ${vals.Weekday}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToolHeader title="Cron Expression Builder" description="Build cron schedule expressions visually with a human-readable description." />

      {/* Expression display */}
      <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>CRON EXPRESSION</span>
          <CopyButton text={expr} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FIELDS.map((f) => (
            <div key={f} className="text-center">
              <div className="text-lg font-mono font-bold px-3 py-2 rounded-lg mb-1"
                style={{ background: "var(--color-surface-3)", color: "var(--color-primary-light)", border: "1px solid var(--color-border)" }}>
                {vals[f]}
              </div>
              <div className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{f}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
          <Timer className="h-4 w-4 inline mr-1.5" style={{ color: "var(--color-primary)" }} />
          {describe(vals)}
        </p>
      </div>

      {/* Field selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-foreground)" }}>{field}</label>
            <div className="flex gap-2">
              <select value={vals[field]} onChange={(e) => set(field, e.target.value)} className="input-base flex-1">
                {OPTIONS[field].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <input
                type="text" value={vals[field]}
                onChange={(e) => set(field, e.target.value)}
                placeholder="*"
                className="input-base w-20 font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-foreground)" }}>Common Presets</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => setVals(p.vals)}
              className="px-3 py-2.5 rounded-xl text-left transition-all"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs font-bold mb-0.5" style={{ color: "var(--color-foreground)" }}>{p.label}</p>
              <code className="text-xs" style={{ color: "var(--color-primary-light)" }}>{p.desc}</code>
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => setVals({ Minute:"*", Hour:"*", Day:"*", Month:"*", Weekday:"*" })}
        className="flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--color-muted-foreground)" }}>
        <RefreshCw className="h-4 w-4" />Reset to defaults
      </button>
    </div>
  );
}
