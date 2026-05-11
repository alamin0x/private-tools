import { useState } from "react"
import ToolHeader from "@/components/tool-header"

export default function CoinFlipper() {
  const [result, setResult] = useState<"heads" | "tails" | null>(null)
  const [flipping, setFlipping] = useState(false)
  const [stats, setStats] = useState({ heads: 0, tails: 0 })

  function flip() {
    setFlipping(true)
    setResult(null)
    setTimeout(() => {
      const r = Math.random() < 0.5 ? "heads" : "tails"
      setResult(r)
      setStats(s => ({ ...s, [r]: s[r] + 1 }))
      setFlipping(false)
    }, 600)
  }

  const total = stats.heads + stats.tails

  return (
    <div className="max-w-md mx-auto space-y-5">
      <ToolHeader title="Coin Flipper" description="Flip a virtual coin and track heads vs tails statistics." />

      <div className="rounded-xl p-8 text-center space-y-6" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center justify-center">
          <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-extrabold transition-all duration-300"
            style={{
              background: flipping ? "var(--color-surface-3)" : result === "heads"
                ? "linear-gradient(135deg,#f59e0b,#fbbf24)"
                : result === "tails"
                  ? "linear-gradient(135deg,#7c5af3,#4f8ef7)"
                  : "var(--color-surface-3)",
              boxShadow: result ? "0 0 32px rgba(124,90,243,0.3)" : "none",
              border: "3px solid var(--color-border)",
              transform: flipping ? "rotateY(90deg)" : "rotateY(0deg)",
              transition: "all 0.3s ease",
              color: result ? "#fff" : "var(--color-muted-foreground)",
            }}>
            {flipping ? "?" : result === "heads" ? "H" : result === "tails" ? "T" : "?"}
          </div>
        </div>

        {result && !flipping && (
          <p className="text-2xl font-extrabold capitalize" style={{ color: "var(--color-foreground)" }}>{result}!</p>
        )}

        <button onClick={flip} className="btn-primary px-8 py-3 text-base" disabled={flipping}>
          {flipping ? "Flipping…" : "🪙 Flip Coin"}
        </button>
      </div>

      {total > 0 && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Statistics ({total} flips)</p>
          <div className="flex gap-4">
            {[["Heads", stats.heads, "#f59e0b"], ["Tails", stats.tails, "#7c5af3"]].map(([label, count, color]) => (
              <div key={label as string} className="flex-1 text-center">
                <p className="text-xl font-extrabold" style={{ color: color as string }}>{count as number}</p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{label} ({total > 0 ? Math.round((count as number / total) * 100) : 0}%)</p>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${total > 0 ? (stats.heads / total) * 100 : 50}%`, background: "linear-gradient(90deg,#f59e0b,#7c5af3)" }} />
          </div>
        </div>
      )}
    </div>
  )
}
