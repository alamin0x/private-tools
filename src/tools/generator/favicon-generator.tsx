import { useState, useRef } from "react"
import ToolHeader from "@/components/tool-header"

export default function FaviconGenerator() {
  const [text, setText] = useState("A")
  const [bg, setBg] = useState("#7c5af3")
  const [textColor, setTextColor] = useState("#ffffff")
  const [shape, setShape] = useState<"square" | "circle" | "rounded">("rounded")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [preview, setPreview] = useState("")

  function generate() {
    const canvas = canvasRef.current!
    canvas.width = 256; canvas.height = 256
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, 256, 256)
    if (shape === "circle") {
      ctx.beginPath(); ctx.arc(128, 128, 128, 0, 2 * Math.PI); ctx.fillStyle = bg; ctx.fill()
    } else if (shape === "rounded") {
      ctx.beginPath(); ctx.roundRect(0, 0, 256, 256, 48); ctx.fillStyle = bg; ctx.fill()
    } else {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 256, 256)
    }
    ctx.fillStyle = textColor; ctx.textAlign = "center"; ctx.textBaseline = "middle"
    ctx.font = `bold ${text.length > 1 ? 80 : 120}px Inter, Arial`
    ctx.fillText(text.slice(0, 3), 128, 132)
    setPreview(canvas.toDataURL())
  }

  function download(size: number) {
    const off = document.createElement("canvas"); off.width = size; off.height = size
    const ctx = off.getContext("2d")!
    const img = new Image(); img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
      const a = document.createElement("a"); a.download = `favicon-${size}.png`; a.href = off.toDataURL(); a.click()
    }; img.src = preview
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <ToolHeader title="Favicon Generator" description="Create a custom favicon/app icon with text, color, and shape options." />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Text / Emoji (1-3 chars)</label>
          <input className="input-base text-2xl text-center font-bold" maxLength={3} value={text} onChange={e => setText(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Background</label>
          <div className="flex gap-2"><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input className="input-base font-mono flex-1 text-sm" value={bg} onChange={e => setBg(e.target.value)} /></div>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Text Color</label>
          <div className="flex gap-2"><input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input className="input-base font-mono flex-1 text-sm" value={textColor} onChange={e => setTextColor(e.target.value)} /></div>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Shape</label>
          <div className="flex gap-2">
            {(["square", "rounded", "circle"] as const).map(s => (
              <button key={s} onClick={() => setShape(s)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                style={shape === s ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" } : { background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={generate} className="btn-primary w-full py-3">Generate Favicon</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {preview && (
        <div className="space-y-4">
          <div className="rounded-xl p-6 flex items-center justify-center gap-6" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            {[256, 64, 32, 16].map(s => (
              <div key={s} className="text-center space-y-2">
                <img src={preview} width={s > 64 ? 64 : s} height={s > 64 ? 64 : s} alt="favicon" style={{ imageRendering: "pixelated" }} />
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{s}px</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[256, 64, 32].map(s => (
              <button key={s} onClick={() => download(s)} className="btn-primary py-2 text-sm">⬇ {s}px</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
