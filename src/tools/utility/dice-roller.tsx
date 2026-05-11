import { useState } from "react"
import ToolHeader from "@/components/tool-header"

const DICE = [4, 6, 8, 10, 12, 20, 100]

export default function DiceRoller() {
  const [sides, setSides] = useState(6)
  const [count, setCount] = useState(1)
  const [results, setResults] = useState<number[]>([])
  const [rolling, setRolling] = useState(false)

  function roll() {
    setRolling(true)
    setTimeout(() => {
      const r = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1)
      setResults(r)
      setRolling(false)
    }, 400)
  }

  const total = results.reduce((a, b) => a + b, 0)

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <ToolHeader title="Dice Roller" description="Roll any dice — d4, d6, d8, d10, d12, d20, or d100." />

      <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex flex-wrap gap-2">
          {DICE.map(d => (
            <button key={d} onClick={() => setSides(d)}
              className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
              style={sides === d
                ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" }
                : { background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              d{d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Dice count:</label>
          <input type="number" min={1} max={20} value={count} onChange={e => setCount(Math.min(20, Math.max(1, +e.target.value)))}
            className="input-base w-20" />
        </div>

        <button onClick={roll} className="btn-primary w-full py-3 text-base" disabled={rolling}>
          {rolling ? "Rolling…" : `🎲 Roll ${count}d${sides}`}
        </button>
      </div>

      {results.length > 0 && (
        <div className="rounded-xl p-5 text-center space-y-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex flex-wrap gap-2 justify-center">
            {results.map((r, i) => (
              <span key={i} className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-extrabold"
                style={{ background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" }}>{r}</span>
            ))}
          </div>
          {count > 1 && <p className="text-sm font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Total: <span style={{ color: "var(--color-primary-light)", fontSize: "1.25rem" }}>{total}</span></p>}
        </div>
      )}
    </div>
  )
}
