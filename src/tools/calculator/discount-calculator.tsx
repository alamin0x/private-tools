import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

export default function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const orig = parseFloat(price), pct = parseFloat(discount);
  const saved = (orig * pct) / 100;
  const final = orig - saved;
  const valid = !isNaN(orig) && !isNaN(pct) && orig > 0 && pct >= 0 && pct <= 100;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <ToolHeader title="Discount Calculator" description="Calculate sale price, savings amount, and final cost after discount." />
      <div className="space-y-4">
        {[{ label: "Original Price ($)", val: price, set: setPrice, ph: "100" }, { label: "Discount (%)", val: discount, set: setDiscount, ph: "20" }].map(({ label, val, set, ph }) => (
          <div key={label}>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>{label}</label>
            <input type="number" className="input-base text-lg" placeholder={ph} value={val} onChange={e => set(e.target.value)} />
          </div>
        ))}
      </div>
      {valid && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Original", val: `$${orig.toFixed(2)}`, color: "var(--color-muted-foreground)" }, { label: "You Save", val: `-$${saved.toFixed(2)}`, color: "#34d399" }, { label: "Final Price", val: `$${final.toFixed(2)}`, color: "var(--color-primary-light)" }].map(({ label, val, color }) => (
              <div key={label} className="text-center rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <p className="text-xl font-extrabold" style={{ color }}>{val}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: "var(--color-muted-foreground)" }}>{label}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center"><CopyButton text={`Final: $${final.toFixed(2)} (Save $${saved.toFixed(2)})`} /></div>
        </div>
      )}
    </div>
  );
}
