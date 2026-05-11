import { useState, useRef } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function DummyImagePlaceholder() {
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(300)
  const [bg, setBg] = useState("#1a1a2e")
  const [textColor, setTextColor] = useState("#9d7fff")
  const [label, setLabel] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dataUrl, setDataUrl] = useState("")

  function generate() {
    const canvas = canvasRef.current!
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = textColor; ctx.lineWidth = 2; ctx.setLineDash([8, 4])
    ctx.strokeRect(4, 4, width - 8, height - 8)
    ctx.fillStyle = textColor; ctx.textAlign = "center"; ctx.textBaseline = "middle"
    const text = label || `${width} × ${height}`
    ctx.font = `bold ${Math.min(32, width / 8)}px Inter, Arial`
    ctx.fillText(text, width / 2, height / 2)
    setDataUrl(canvas.toDataURL())
  }

  const markdown = `![placeholder](${dataUrl || ""})`
  const html = `<img src="${dataUrl || `data:...`}" alt="${label || `${width}x${height} placeholder`}" width="${width}" height="${height}" />`

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Dummy Image Placeholder" description="Generate placeholder images with custom dimensions, colors, and labels." />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Width (px)</label>
          <input type="number" min={1} max={4000} className="input-base" value={width} onChange={e => setWidth(+e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Height (px)</label>
          <input type="number" min={1} max={4000} className="input-base" value={height} onChange={e => setHeight(+e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Background Color</label>
          <div className="flex gap-2"><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input className="input-base font-mono flex-1" value={bg} onChange={e => setBg(e.target.value)} /></div>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Text Color</label>
          <div className="flex gap-2"><input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input className="input-base font-mono flex-1" value={textColor} onChange={e => setTextColor(e.target.value)} /></div>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Custom Label (optional)</label>
          <input className="input-base" placeholder="Leave blank for dimensions" value={label} onChange={e => setLabel(e.target.value)} />
        </div>
      </div>

      <button onClick={generate} className="btn-primary w-full py-3">Generate Image</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {dataUrl && (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            <img src={dataUrl} alt="placeholder" style={{ maxWidth: "100%", maxHeight: "300px" }} />
          </div>
          <div className="flex gap-3">
            <a href={dataUrl} download={`placeholder-${width}x${height}.png`} className="btn-primary flex-1 text-center py-2">⬇ Download PNG</a>
          </div>
          {[["HTML", html], ["Markdown", markdown]].map(([label, val]) => (
            <div key={label} className="rounded-xl p-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
                <CopyButton text={val} />
              </div>
              <code className="text-xs font-mono break-all" style={{ color: "var(--color-primary-light)" }}>{val.slice(0, 100)}{val.length > 100 ? "…" : ""}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
