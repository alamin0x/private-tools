import { useState } from "react";
import ToolHeader from "@/components/tool-header";

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric"|"imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const calcBmi = () => {
    const w = parseFloat(weight), h = parseFloat(height), hi = parseFloat(heightIn) || 0;
    if (!w || !h) return null;
    let bmi: number;
    if (unit === "metric") { bmi = w / ((h / 100) ** 2); }
    else { const totalIn = h * 12 + hi; bmi = (w / (totalIn ** 2)) * 703; }
    return bmi;
  };

  const bmi = calcBmi();
  const category = bmi == null ? "" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
  const catColor = bmi == null ? "" : bmi < 18.5 ? "#60a5fa" : bmi < 25 ? "#34d399" : bmi < 30 ? "#fbbf24" : "#fb7185";
  const pct = bmi ? Math.min(100, ((bmi - 10) / 30) * 100) : 0;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <ToolHeader title="BMI Calculator" description="Calculate your Body Mass Index with metric or imperial units." />
      <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        {(["metric","imperial"] as const).map(u => (
          <button key={u} onClick={() => setUnit(u)} className="flex-1 py-2.5 text-sm font-semibold transition-all capitalize"
            style={unit === u ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" } : { color: "var(--color-muted-foreground)" }}>
            {u} {u === "metric" ? "(kg/cm)" : "(lb/ft)"}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Weight ({unit === "metric" ? "kg" : "lbs"})</label>
          <input type="number" className="input-base" placeholder={unit === "metric" ? "70" : "154"} value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        {unit === "metric" ? (
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Height (cm)</label>
            <input type="number" className="input-base" placeholder="175" value={height} onChange={e => setHeight(e.target.value)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Feet</label>
              <input type="number" className="input-base" placeholder="5" value={height} onChange={e => setHeight(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Inches</label>
              <input type="number" className="input-base" placeholder="10" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
            </div>
          </div>
        )}
      </div>
      {bmi && (
        <div className="rounded-xl p-5 text-center space-y-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-5xl font-extrabold" style={{ color: catColor }}>{bmi.toFixed(1)}</p>
          <p className="font-bold text-lg" style={{ color: catColor }}>{category}</p>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg,#60a5fa,#34d399,#fbbf24,#fb7185)` }} />
          </div>
          <div className="grid grid-cols-4 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
            {["< 18.5 Underweight","18.5-25 Normal","25-30 Overweight","30+ Obese"].map(l => <span key={l}>{l}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
