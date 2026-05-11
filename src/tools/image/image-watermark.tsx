import { useState } from "react"
import ToolHeader from "@/components/tool-header"

export default function ImageWatermark() {
  const [src, setSrc] = useState<string | null>(null)
  const [text, setText] = useState("© My Brand")
  const [pos, setPos] = useState("bottom-right")
  const [opacity, setOpacity] = useState(70)
  const [size, setSize] = useState(32)
  const [color, setColor] = useState("#ffffff")
  const [result, setResult] = useState<string | null>(null)

  function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => setSrc(ev.target?.result as string); r.readAsDataURL(f)
    setResult(null)
  }

  function apply() {
    if (!src) return
    const img = new Image(); img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)
      ctx.globalAlpha = opacity / 100
      ctx.fillStyle = color
      ctx.font = `bold ${size}px Inter, Arial`
      ctx.textAlign = "right"
      const pad = 20
      const positions: Record<string, [number, number, CanvasTextAlign]> = {
        "top-left": [pad, pad + size, "left"],
        "top-right": [img.width - pad, pad + size, "right"],
        "bottom-left": [pad, img.height - pad, "left"],
        "bottom-right": [img.width - pad, img.height - pad, "right"],
        "center": [img.width / 2, img.height / 2, "center"],
      }
      const [x, y, align] = positions[pos] || positions["bottom-right"]
      ctx.textAlign = align
      ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 3
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
      setResult(canvas.toDataURL("image/png"))
    }
    img.src = src
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Watermark Adder" description="Add a text watermark to any image with custom position and style." />

      {!src ? (
        <label className="block cursor-pointer">
          <div className="rounded-xl p-12 text-center border-2 border-dashed" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
            <p className="text-3xl mb-2">💧</p>
            <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>Click to upload an image</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={loadFile} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Watermark Text</label>
              <input className="input-base" value={text} onChange={e => setText(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Position</label>
              <select className="input-base" value={pos} onChange={e => setPos(e.target.value)}>
                {[["top-left","Top Left"],["top-right","Top Right"],["bottom-left","Bottom Left"],["bottom-right","Bottom Right"],["center","Center"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Text Color</label>
              <div className="flex gap-2"><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded" /><input className="input-base font-mono flex-1 text-sm" value={color} onChange={e => setColor(e.target.value)} /></div>
            </div>
            <div>
              <label className="text-xs font-semibold flex justify-between mb-1"><span style={{ color: "var(--color-muted-foreground)" }}>Font Size</span><span style={{ color: "var(--color-primary-light)" }}>{size}px</span></label>
              <input type="range" min={12} max={120} value={size} onChange={e => setSize(+e.target.value)} className="w-full" style={{ accentColor: "#7c5af3" }} />
            </div>
            <div>
              <label className="text-xs font-semibold flex justify-between mb-1"><span style={{ color: "var(--color-muted-foreground)" }}>Opacity</span><span style={{ color: "var(--color-primary-light)" }}>{opacity}%</span></label>
              <input type="range" min={10} max={100} value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full" style={{ accentColor: "#7c5af3" }} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={apply} className="btn-primary flex-1 py-2.5">Apply Watermark</button>
            <button onClick={() => { setSrc(null); setResult(null) }} className="px-4 py-2.5 rounded-lg text-sm" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-muted-foreground)" }}>New Image</button>
          </div>
          {result && <>
            <img src={result} alt="watermarked" style={{ maxWidth: "100%", borderRadius: "0.75rem", border: "1px solid var(--color-border)" }} />
            <a href={result} download="watermarked.png" className="btn-primary block text-center py-2.5">⬇ Download</a>
          </>}
        </div>
      )}
    </div>
  )
}
