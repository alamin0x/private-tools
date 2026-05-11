import { useRef, useState } from "react"
import ToolHeader from "@/components/tool-header"

export default function OnlineSignatureMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [color, setColor] = useState("#9d7fff")
  const [size, setSize] = useState(3)
  const [hasDrawn, setHasDrawn] = useState(false)

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height
    if ("touches" in e) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  function start(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current!.getContext("2d")!
    const pos = getPos(e)
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y)
    setHasDrawn(true)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext("2d")!
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = "round"; ctx.lineJoin = "round"
    ctx.stroke()
  }

  function stop() { drawing.current = false }

  function clear() {
    const canvas = canvasRef.current!
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  function download() {
    const link = document.createElement("a")
    link.download = "signature.png"
    link.href = canvasRef.current!.toDataURL()
    link.click()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Online Signature Maker" description="Draw your signature on the canvas and download as PNG." />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Color:</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Size:</label>
          <input type="range" min={1} max={10} value={size} onChange={e => setSize(+e.target.value)} style={{ accentColor: "#7c5af3", width: "80px" }} />
          <span className="text-xs w-4" style={{ color: "var(--color-muted-foreground)" }}>{size}</span>
        </div>
        <button onClick={clear} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-muted-foreground)" }}>Clear</button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "#fff", cursor: "crosshair" }}>
        <canvas ref={canvasRef} width={700} height={280} style={{ width: "100%", display: "block", touchAction: "none" }}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} />
      </div>
      <p className="text-center text-xs" style={{ color: "var(--color-muted-foreground)" }}>Draw your signature above</p>

      <div className="flex gap-2 justify-center">
        <button onClick={download} disabled={!hasDrawn} className="btn-primary px-6 py-2" style={{ opacity: hasDrawn ? 1 : 0.5 }}>
          ⬇ Download PNG
        </button>
      </div>
    </div>
  )
}
