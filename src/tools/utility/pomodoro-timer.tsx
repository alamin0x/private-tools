import { useState, useEffect, useRef } from "react"
import ToolHeader from "@/components/tool-header"

type Phase = "work" | "break" | "idle"

export default function PomodoroTimer() {
  const [workMins, setWorkMins] = useState(25)
  const [breakMins, setBreakMins] = useState(5)
  const [phase, setPhase] = useState<Phase>("idle")
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            if (phase === "work") { setSessions(s => s + 1); setPhase("break"); return breakMins * 60 }
            else { setPhase("work"); return workMins * 60 }
          }
          return r - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, phase, workMins, breakMins])

  function start() { setPhase("work"); setRemaining(workMins * 60); setRunning(true) }
  function reset() { setRunning(false); setPhase("idle"); setRemaining(workMins * 60); setSessions(0) }

  const total = phase === "work" ? workMins * 60 : breakMins * 60
  const progress = phase !== "idle" ? ((total - remaining) / total) * 100 : 0
  const m = Math.floor(remaining / 60), s = remaining % 60
  const fmt = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`

  const phaseColor = phase === "work" ? "#7c5af3" : "#10b981"

  return (
    <div className="max-w-md mx-auto space-y-5">
      <ToolHeader title="Pomodoro Timer" description="Focus with timed work/break intervals using the Pomodoro Technique." />

      <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex gap-4">
          {[["Work (min)", workMins, setWorkMins], ["Break (min)", breakMins, setBreakMins]].map(([label, val, setter]) => (
            <div key={label as string} className="flex-1">
              <label className="text-xs block mb-1" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</label>
              <input type="number" min={1} max={60} value={val as number}
                onChange={e => { (setter as (v: number) => void)(+e.target.value); if (phase === "idle") setRemaining(+e.target.value * 60) }}
                className="input-base text-center" disabled={running} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-8 text-center space-y-5" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: phaseColor }}>
            {phase === "idle" ? "Ready" : phase === "work" ? "🍅 Focus Time" : "☕ Break Time"}
          </span>
          <p className="font-mono text-6xl font-extrabold" style={{ color: "var(--color-foreground)" }}>{fmt}</p>
        </div>

        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${phaseColor},${phase === "work" ? "#4f8ef7" : "#06b6d4"})` }} />
        </div>

        <div className="flex gap-3 justify-center">
          {phase === "idle"
            ? <button onClick={start} className="btn-primary px-8 py-2">▶ Start</button>
            : <button onClick={() => setRunning(r => !r)} className="btn-primary px-6 py-2">{running ? "⏸ Pause" : "▶ Resume"}</button>
          }
          <button onClick={reset} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>↺ Reset</button>
        </div>

        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          🍅 Sessions completed: <span style={{ color: "var(--color-primary-light)", fontWeight: 700 }}>{sessions}</span>
        </p>
      </div>
    </div>
  )
}
