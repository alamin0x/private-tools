import { useState } from "react";
import ToolHeader from "@/components/tool-header";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState<"months"|"years">("years");

  const calc = () => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const t = parseFloat(tenure);
    
    if (isNaN(P) || isNaN(annualRate) || isNaN(t) || P <= 0 || t <= 0) return null;
    
    const n = t * (tenureType === "years" ? 12 : 1);
    const r = annualRate / 100 / 12;

    // Handle 0% interest rate separately to avoid division by zero
    if (r === 0) {
      const emi = P / n;
      return { emi, total: P, interest: 0 };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return { emi, total, interest: total - P };
  };

  const result = calc();
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = result && result.total > 0 ? Math.round((result.interest / result.total) * 100) : 0;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <ToolHeader title="Loan / EMI Calculator" description="Calculate monthly EMI, total payment, and interest for any loan." />
      
      <div className="space-y-4 p-6 rounded-2xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-muted-foreground)" }}>Loan Amount ($)</label>
          <input type="number" className="input-base text-lg" placeholder="100,000" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-muted-foreground)" }}>Interest Rate (%)</label>
            <input type="number" step="0.1" className="input-base" placeholder="8.5" value={rate} onChange={e => setRate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-muted-foreground)" }}>Tenure</label>
            <div className="flex gap-2">
              <input type="number" className="input-base flex-1" placeholder="5" value={tenure} onChange={e => setTenure(e.target.value)} />
              <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--color-border)" }}>
                {(["Y","M"] as const).map(t => {
                  const full = t === "Y" ? "years" : "months";
                  return (
                    <button key={t} onClick={() => setTenureType(full)} className="px-3 py-1 text-[10px] font-black transition-all"
                      style={tenureType === full ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" } : { color: "var(--color-muted-foreground)", background: "var(--color-surface-3)" }}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {result ? (
        <div className="rounded-2xl p-6 space-y-5 animate-in zoom-in-95 duration-300" 
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)" }}>
          <div className="text-center pb-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--color-muted-foreground)" }}>Monthly EMI</p>
            <p className="text-5xl font-black tracking-tight" style={{ color: "var(--color-primary-light)" }}>
              <span className="text-2xl mr-1 font-medium text-muted-foreground">$</span>{fmt(result.emi)}
            </p>
          </div>
          
          <div className="space-y-3">
             {[
               { label: "Total Payment", val: `$${fmt(result.total)}`, color: "var(--color-foreground)" }, 
               { label: "Total Interest", val: `$${fmt(result.interest)}`, color: "#fb7185" }, 
               { label: "Principal", val: `$${fmt(parseFloat(principal))}`, color: "#34d399" }
             ].map(({ label, val, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
                <span className="font-bold font-mono" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-[10px] font-black uppercase mb-1.5" style={{ color: "var(--color-muted-foreground)" }}>
              <span>Principal {100 - pct}%</span><span>Interest {pct}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex p-0.5" style={{ background: "var(--color-surface-3)" }}>
              <div className="rounded-full transition-all duration-500" style={{ width: `${100 - pct}%`, background: "#34d399" }} />
              <div className="rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "#fb7185" }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-8 text-center border-2 border-dashed" style={{ borderColor: "var(--color-border)", color: "var(--color-muted-foreground)" }}>
          <p className="text-sm font-medium">Enter loan details to see calculation results</p>
        </div>
      )}
    </div>
  );
}
