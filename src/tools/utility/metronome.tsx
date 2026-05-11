import { useState, useRef, useEffect, useCallback } from "react"
import ToolHeader from "@/components/tool-header"

export default function Metronome() {
  const [bpm, setBpm] = useState(120)
  const [running, setRunning] = useState(false)
  const [timeSignature, setTimeSignature] = useState(4)
  const [currentBeat, setCurrentBeat] = useState(0)
  const audioCtx = useRef<AudioContext | null>(null)

  const tick = useCallback(() => {
    if (!audioCtx.current) audioCtx.current = new AudioContext()
    const ctx = audioCtx.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    setCurrentBeat(b => {
      const next = (b + 1) % timeSignature
      osc.frequency.value = next === 0 ? 1000 : 800
      return next
    })
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  }, [timeSignature])

  useEffect(() => {
    if (running) {
      tick()
      const interval = setInterval(tick, (60 / bpm) * 1000)
      return () => clearInterval(interval)
    }
  }, [running, bpm, tick])

  const toggle = () => {
    if (running) {
      setRunning(false)
      setCurrentBeat(0)
    } else {
      setRunning(true)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <ToolHeader title="Metronome" description="Keep perfect time with an audio metronome for practice." />

      <div className="rounded-xl p-8 text-center space-y-6" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex justify-center gap-2 mb-2">
          {Array.from({ length: timeSignature }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full transition-all duration-75"
              style={{ background: running && currentBeat === i ? (i === 0 ? "#f59e0b" : "#7c5af3") : "var(--color-surface-3)", boxShadow: running && currentBeat === i ? `0 0 12px ${i === 0 ? "#f59e0b" : "#7c5af3"}` : "none" }} />
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-6xl font-extrabold" style={{ color: "var(--color-foreground)" }}>{bpm}</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>BPM</p>
        </div>

        <input type="range" min={20} max={300} value={bpm} onChange={e => setBpm(+e.target.value)}
          className="w-full" style={{ accentColor: "#7c5af3" }} />

        <div className="flex gap-2 justify-center flex-wrap">
          {[60, 80, 100, 120, 140, 160].map(b => (
            <button key={b} onClick={() => setBpm(b)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={bpm === b ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" } : { background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              {b}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 justify-center">
          <label className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Time Signature:</label>
          {[2, 3, 4, 6].map(ts => (
            <button key={ts} onClick={() => setTimeSignature(ts)}
              className="px-3 py-1 rounded-lg text-sm font-bold transition-all"
              style={timeSignature === ts ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" } : { background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              {ts}/4
            </button>
          ))}
        </div>

        <button onClick={toggle} className="btn-primary w-full py-3 text-base">
          {running ? "⏹ Stop" : "▶ Start"}
        </button>
      </div>
    </div>
  )
}
