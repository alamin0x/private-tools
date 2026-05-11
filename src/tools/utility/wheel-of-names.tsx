import { useRef, useState, useEffect, useCallback } from "react"
import ToolHeader from "@/components/tool-header"

export default function WheelOfNames() {
  const [input, setInput] = useState("Alice\nBob\nCarol\nDave\nEve\nFrank")
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spinRef = useRef({ angle: 0, velocity: 0, animId: 0 })

  const COLORS = ["#7c5af3","#4f8ef7","#10b981","#f59e0b","#f43f5e","#06b6d4","#e879f9","#5eead4"]

  const names = input.split("\n").map(n => n.trim()).filter(Boolean)

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current; if (!canvas || names.length === 0) return
    const ctx = canvas.getContext("2d")!; const cx = 200, cy = 200, r = 185
    ctx.clearRect(0, 0, 400, 400)
    const slice = (2 * Math.PI) / names.length
    names.forEach((name, i) => {
      const start = angle + i * slice, end = start + slice
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill()
      ctx.strokeStyle = "#0d0d14"; ctx.lineWidth = 2; ctx.stroke()
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + slice / 2)
      ctx.textAlign = "right"; ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.min(14, 120 / names.length)}px Inter`
      ctx.fillText(name.slice(0, 12), r - 12, 5); ctx.restore()
    })
    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, 2 * Math.PI)
    ctx.fillStyle = "#0d0d14"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx + r + 10, cy); ctx.lineTo(cx + r - 20, cy - 12); ctx.lineTo(cx + r - 20, cy + 12)
    ctx.closePath(); ctx.fillStyle = "#f43f5e"; ctx.fill()
  }, [names])

  const namesString = names.join(",")
  useEffect(() => {
    drawWheel(spinRef.current.angle)
  }, [namesString, drawWheel])

  function spin() {
    if (spinning || names.length < 2) return
    setSpinning(true); setWinner(null)
    spinRef.current.velocity = 0.3 + Math.random() * 0.2
    const animate = () => {
      spinRef.current.angle += spinRef.current.velocity
      spinRef.current.velocity *= 0.987
      drawWheel(spinRef.current.angle)
      if (spinRef.current.velocity > 0.002) { spinRef.current.animId = requestAnimationFrame(animate) }
      else {
        const angle = spinRef.current.angle % (2 * Math.PI)
        const slice = (2 * Math.PI) / names.length
        const winIdx = names.length - 1 - Math.floor(((angle % (2 * Math.PI)) / slice) % names.length)
        setWinner(names[Math.abs(winIdx) % names.length])
        setSpinning(false)
      }
    }
    spinRef.current.animId = requestAnimationFrame(animate)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Wheel of Names" description="Add names and spin the wheel to pick a random winner!" />
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <label className="text-xs font-semibold block" style={{ color: "var(--color-muted-foreground)" }}>Names (one per line)</label>
          <textarea className="input-base h-48 text-sm font-mono" value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={spin} disabled={spinning || names.length < 2} className="btn-primary w-full py-3">
            {spinning ? "Spinning…" : "🎡 Spin the Wheel!"}
          </button>
          {winner && !spinning && (
            <div className="rounded-xl p-4 text-center" style={{ background: "linear-gradient(135deg,rgba(124,90,243,0.15),rgba(6,182,212,0.1))", border: "1px solid var(--color-border)" }}>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>🏆 Winner</p>
              <p className="text-2xl font-extrabold" style={{ color: "var(--color-primary-light)" }}>{winner}</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <canvas ref={canvasRef} width={400} height={400} style={{ width: "100%", maxWidth: "300px", cursor: "pointer", borderRadius: "50%" }} onClick={spin} />
        </div>
      </div>
    </div>
  )
}
