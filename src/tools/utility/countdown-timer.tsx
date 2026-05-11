import { useState, useEffect } from "react"
import ToolHeader from "@/components/tool-header"

export default function CountdownTimer() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (running && remaining !== null && remaining > 0) {
      const interval = setInterval(() => {
        setRemaining(r => {
          if (r === null || r <= 1) {
            setRunning(false)
            setDone(true)
            return 0
          }
          return r - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [running, remaining])

  function start() {
    const total = hours * 3600 + minutes * 60 + seconds
    if (total <= 0) return
    setRemaining(total); setDone(false); setRunning(true)
  }

  function reset() { setRunning(false); setRemaining(null); setDone(false) }

  function fmt(secs: number) {
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":")
  }

  const total = hours * 3600 + minutes * 60 + seconds
  const progress = remaining !== null && total > 0 ? (remaining / total) * 100 : 100

  return (
    <div className="max-w-md mx-auto space-y-5">
      <ToolHeader title="Countdown Timer" description="Set a custom countdown and get alerted when it reaches zero." />

      {remaining === null ? (
        <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Set Time</p>
          <div className="flex gap-3">
            {[["Hours", hours, setHours, 23], ["Minutes", minutes, setMinutes, 59], ["Seconds", seconds, setSeconds, 59]].map(([label, val, setter, max]) => (
              <div key={label as string} className="flex-1 text-center">
                <label className="text-xs block mb-1" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</label>
                <input type="number" min={0} max={max as number} value={val as number}
                  onChange={e => (setter as (v: number) => void)(Math.min(max as number, Math.max(0, +e.target.value)))}
                  className="input-base text-center text-xl font-bold" />
              </div>
            ))}
          </div>
          <button onClick={start} className="btn-primary w-full py-3">▶ Start</button>
        </div>
      ) : (
        <div className="rounded-xl p-8 text-center space-y-5" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          {done ? (
            <p className="text-4xl">🎉</p>
          ) : (
            <div className="space-y-4">
              <p className="font-mono text-5xl font-extrabold" style={{ color: done ? "var(--color-success)" : "var(--color-foreground)" }}>
                {fmt(remaining!)}
              </p>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#7c5af3,#06b6d4)" }} />
              </div>
            </div>
          )}
          <p className="text-lg font-bold" style={{ color: done ? "var(--color-success)" : "var(--color-muted-foreground)" }}>
            {done ? "Time's up!" : running ? "Counting down…" : "Paused"}
          </p>
          <div className="flex gap-3 justify-center">
            {!done && <button onClick={() => setRunning(r => !r)} className="btn-primary px-6 py-2">{running ? "⏸ Pause" : "▶ Resume"}</button>}
            <button onClick={reset} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>↺ Reset</button>
          </div>
        </div>
      )}
    </div>
  )
}
