import { useState, useEffect, useRef } from "react"
import ToolHeader from "@/components/tool-header"

export default function Stopwatch() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsed
      const tick = () => { setElapsed(Date.now() - startRef.current); rafRef.current = requestAnimationFrame(tick) }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, elapsed])

  function fmt(ms: number) {
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), cs = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`
  }

  function reset() { setRunning(false); setElapsed(0); setLaps([]) }
  function lap() { setLaps(l => [elapsed, ...l]) }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <ToolHeader title="Stopwatch" description="Precision stopwatch with lap timing." />

      <div className="rounded-xl p-8 text-center space-y-6" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <p className="font-mono text-5xl font-extrabold" style={{ color: "var(--color-foreground)", letterSpacing: "-0.03em" }}>
          {fmt(elapsed)}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setRunning(r => !r)} className="btn-primary px-6 py-2">
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          <button onClick={lap} disabled={!running}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "var(--color-surface-3)", color: "var(--color-foreground)", border: "1px solid var(--color-border)", opacity: running ? 1 : 0.4 }}>
            🏁 Lap
          </button>
          <button onClick={reset}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
            ↺ Reset
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-muted-foreground)" }}>Laps</p>
          {laps.map((lap, i) => (
            <div key={i} className="flex justify-between text-sm font-mono py-1" style={{ borderBottom: "1px solid var(--color-border)", color: "var(--color-foreground)" }}>
              <span style={{ color: "var(--color-muted-foreground)" }}>Lap {laps.length - i}</span>
              <span>{fmt(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
