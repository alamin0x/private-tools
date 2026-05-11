import { useState, useRef } from "react"
import ToolHeader from "@/components/tool-header"

type State = "idle" | "waiting" | "ready" | "done"

export default function ReactionTimeTester() {
  const [state, setState] = useState<State>("idle")
  const [time, setTime] = useState<number | null>(null)
  const [best, setBest] = useState<number | null>(null)
  const [times, setTimes] = useState<number[]>([])
  const startRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function begin() {
    setState("waiting")
    const delay = 2000 + Math.random() * 3000
    timeoutRef.current = setTimeout(() => { setState("ready"); startRef.current = Date.now() }, delay)
  }

  function click() {
    if (state === "waiting") {
      clearTimeout(timeoutRef.current!)
      setState("idle")
      setTime(null)
      return
    }
    if (state === "ready") {
      const t = Date.now() - startRef.current
      setTime(t)
      setTimes(prev => [...prev, t])
      setBest(b => b === null ? t : Math.min(b, t))
      setState("done")
    }
    if (state === "idle" || state === "done") begin()
  }

  const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null

  const bgColor = state === "ready" ? "#10b981" : state === "waiting" ? "#f59e0b" : "var(--color-surface-2)"

  return (
    <div className="max-w-md mx-auto space-y-5">
      <ToolHeader title="Reaction Time Tester" description="Click as fast as you can when the screen turns green. Test your reflexes!" />

      <div onClick={click} className="rounded-xl p-12 text-center cursor-pointer select-none transition-all duration-200"
        style={{ background: bgColor, border: "1px solid var(--color-border)", minHeight: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        {state === "idle" && <><p className="text-2xl font-extrabold" style={{ color: "var(--color-foreground)" }}>Click to Start</p><p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Wait for green, then click!</p></>}
        {state === "waiting" && <><p className="text-2xl font-extrabold text-white">Wait…</p><p className="text-sm text-white opacity-80">Don't click yet! (Click to cancel)</p></>}
        {state === "ready" && <p className="text-3xl font-extrabold text-white">CLICK NOW!</p>}
        {state === "done" && <>
          <p className="text-4xl font-extrabold" style={{ color: "var(--color-foreground)" }}>{time}ms</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            {time! < 200 ? "⚡ Incredible!" : time! < 300 ? "🚀 Great!" : time! < 500 ? "👍 Good" : "🐢 Keep practicing"}
          </p>
          <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Click to try again</p>
        </>}
      </div>

      {times.length > 0 && (
        <div className="rounded-xl p-4 grid grid-cols-3 gap-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          {[["Best", `${best}ms`, "#10b981"], ["Average", `${avg}ms`, "#7c5af3"], ["Attempts", times.length, "#4f8ef7"]].map(([label, val, color]) => (
            <div key={label as string} className="text-center">
              <p className="text-xl font-extrabold" style={{ color: color as string }}>{val as string | number}</p>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
