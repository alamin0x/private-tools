import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";
import { ArrowLeftRight } from "lucide-react";

const ONES = ["","I","II","III","IV","V","VI","VII","VIII","IX"];
const TENS = ["","X","XX","XXX","XL","L","LX","LXX","LXXX","XC"];
const HUNDS = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM"];
const THOUS = ["","M","MM","MMM"];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return "Out of range (1–3999)";
  return THOUS[Math.floor(n / 1000)] + HUNDS[Math.floor((n % 1000) / 100)] + TENS[Math.floor((n % 100) / 10)] + ONES[n % 10];
}

const ROMAN_VALS: [string, number][] = [["M",1000],["CM",900],["D",500],["CD",400],["C",100],["XC",90],["L",50],["XL",40],["X",10],["IX",9],["V",5],["IV",4],["I",1]];

function fromRoman(s: string): number | null {
  const str = s.toUpperCase().trim();
  if (!/^[MDCLXVI]+$/.test(str)) return null;
  let result = 0; let i = 0;
  for (const [sym, val] of ROMAN_VALS) {
    while (str.startsWith(sym, i)) { result += val; i += sym.length; }
  }
  return i === str.length ? result : null;
}

export default function RomanNumeral() {
  const [mode, setMode] = useState<"toRoman" | "toArabic">("toRoman");
  const [input, setInput] = useState("");

  const result = (() => {
    if (!input.trim()) return null;
    if (mode === "toRoman") {
      const n = parseInt(input);
      if (isNaN(n)) return { value: "Enter a valid number", error: true };
      return { value: toRoman(n), error: n < 1 || n > 3999 };
    } else {
      const n = fromRoman(input);
      return n == null
        ? { value: "Invalid Roman numeral", error: true }
        : { value: String(n), error: false };
    }
  })();

  const examples = mode === "toRoman"
    ? [["1", "I"], ["4", "IV"], ["9", "IX"], ["42", "XLII"], ["1999", "MCMXCIX"], ["2024", "MMXXIV"]]
    : [["XIV", "14"], ["XLII", "42"], ["XCIX", "99"], ["CDXLIV", "444"], ["MCMXCIX", "1999"]];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <ToolHeader title="Roman Numeral Converter" description="Convert between Arabic numbers and Roman numerals instantly." />

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface-2)" }}>
        {(["toRoman", "toArabic"] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); setInput(""); }}
            className="flex-1 py-2.5 text-sm font-semibold transition-all"
            style={mode === m
              ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" }
              : { color: "var(--color-muted-foreground)" }}>
            {m === "toRoman" ? "Number → Roman" : "Roman → Number"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <input
          type={mode === "toRoman" ? "number" : "text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "toRoman" ? "Enter a number (1–3999)…" : "Enter Roman numerals (e.g. XLII)…"}
          className="input-base text-lg"
        />

        {result && (
          <div className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: result.error ? "rgba(244,63,94,0.08)" : "rgba(124,90,243,0.08)",
              border: `1px solid ${result.error ? "rgba(244,63,94,0.25)" : "rgba(124,90,243,0.25)"}`,
            }}>
            <ArrowLeftRight className="h-5 w-5 flex-shrink-0" style={{ color: result.error ? "#fb7185" : "var(--color-primary-light)" }} />
            <span className="flex-1 text-2xl font-bold font-mono" style={{ color: result.error ? "#fb7185" : "var(--color-foreground)" }}>
              {result.value}
            </span>
            {!result.error && <CopyButton text={result.value} />}
          </div>
        )}
      </div>

      {/* Examples */}
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-muted-foreground)" }}>Examples</p>
        <div className="grid grid-cols-3 gap-2">
          {examples.map(([from, to]) => (
            <button key={from} onClick={() => setInput(mode === "toRoman" ? from : from)}
              className="p-2 rounded-lg text-left transition-all"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <span className="block text-xs font-mono font-bold" style={{ color: "var(--color-primary-light)" }}>{from}</span>
              <span className="block text-xs font-mono" style={{ color: "var(--color-muted-foreground)" }}>→ {to}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Roman numeral reference */}
      <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-muted-foreground)" }}>Reference</p>
        <div className="grid grid-cols-4 gap-2">
          {[["I","1"],["V","5"],["X","10"],["L","50"],["C","100"],["D","500"],["M","1000"],["IV","4"]].map(([r,a]) => (
            <div key={r} className="flex justify-between px-2 py-1 rounded"
              style={{ background: "var(--color-surface-3)" }}>
              <span className="font-mono font-bold text-xs" style={{ color: "var(--color-primary-light)" }}>{r}</span>
              <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
