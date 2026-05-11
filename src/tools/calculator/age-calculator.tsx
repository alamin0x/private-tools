import { useState } from "react";
import ToolHeader from "@/components/tool-header";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const today = new Date();

  const calc = () => {
    if (!dob) return null;
    const birth = new Date(dob);
    let y = today.getFullYear() - birth.getFullYear();
    let m = today.getMonth() - birth.getMonth();
    let d = today.getDate() - birth.getDate();
    if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / 86400000);
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysUntilBday = Math.ceil((nextBirthday.getTime() - today.getTime()) / 86400000);
    return { y, m, d, totalDays, totalWeeks: Math.floor(totalDays / 7), daysUntilBday };
  };

  const result = calc();

  const stats = result ? [
    { label: "Years", value: result.y },
    { label: "Months", value: result.m },
    { label: "Days", value: result.d },
    { label: "Total Days", value: result.totalDays.toLocaleString() },
    { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
    { label: "Days to Birthday", value: result.daysUntilBday },
  ] : [];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <ToolHeader title="Age Calculator" description="Calculate your exact age and days until your next birthday." />
      <div>
        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Date of Birth</label>
        <input type="date" className="input-base" max={today.toISOString().split("T")[0]} value={dob} onChange={e => setDob(e.target.value)} />
      </div>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Years", val: result.y }, { label: "Months", val: result.m }, { label: "Days", val: result.d }].map(({ label, val }) => (
              <div key={label} className="text-center rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <p className="text-3xl font-extrabold" style={{ color: "var(--color-primary-light)" }}>{val}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: "var(--color-muted-foreground)" }}>{label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            {stats.slice(3).map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
                <span className="font-bold" style={{ color: "var(--color-foreground)" }}>{value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
