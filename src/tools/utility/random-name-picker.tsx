import { useState } from "react"
import ToolHeader from "@/components/tool-header"

export default function RandomNamePicker() {
  const [input, setInput] = useState("Alice\nBob\nCarol\nDave\nEve")
  const [picked, setPicked] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [spinning, setSpinning] = useState(false)

  function pick() {
    const names = input.split("\n").map(n => n.trim()).filter(Boolean)
    if (names.length === 0) return
    setSpinning(true)
    setPicked(null)
    let i = 0
    const interval = setInterval(() => {
      setPicked(names[Math.floor(Math.random() * names.length)])
      i++
      if (i > 15) {
        clearInterval(interval)
        const winner = names[Math.floor(Math.random() * names.length)]
        setPicked(winner)
        setHistory(h => [winner, ...h.slice(0, 9)])
        setSpinning(false)
      }
    }, 80)
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <ToolHeader title="Random Name Picker" description="Enter names and randomly select a winner. Great for giveaways and decisions." />

      <div className="rounded-xl p-5 space-y-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <label className="text-xs font-semibold block" style={{ color: "var(--color-muted-foreground)" }}>Names (one per line)</label>
        <textarea className="input-base h-36 font-mono text-sm" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter names, one per line…" />
        <button onClick={pick} className="btn-primary w-full py-3" disabled={spinning}>
          {spinning ? "Picking…" : "🎰 Pick Random Name"}
        </button>
      </div>

      {picked && (
        <div className="rounded-xl p-8 text-center" style={{ background: spinning ? "var(--color-surface-2)" : "linear-gradient(135deg,rgba(124,90,243,0.15),rgba(6,182,212,0.1))", border: "1px solid var(--color-border)", transition: "all 0.3s" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-muted-foreground)" }}>{spinning ? "Picking…" : "🏆 Winner!"}</p>
          <p className="text-3xl font-extrabold" style={{ color: spinning ? "var(--color-muted-foreground)" : "var(--color-primary-light)" }}>{picked}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>History</p>
          {history.map((n, i) => (
            <div key={i} className="flex items-center gap-2 text-sm py-1" style={{ borderBottom: "1px solid var(--color-border)", color: i === 0 ? "var(--color-primary-light)" : "var(--color-muted-foreground)" }}>
              <span className="w-5 h-5 rounded text-xs flex items-center justify-center" style={{ background: "var(--color-surface-3)" }}>{i + 1}</span>
              {n}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
