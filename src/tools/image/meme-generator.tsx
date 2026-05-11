import { useState, useRef } from "react"
import ToolHeader from "@/components/tool-header"

export default function MemeGenerator() {
  const [src, setSrc] = useState<string | null>(null)
  const [topText, setTopText] = useState("WHEN YOU FINALLY")
  const [bottomText, setBottomText] = useState("FIX THE BUG")
  const [fontSize, setFontSize] = useState(48)
  const [result, setResult] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => { setSrc(ev.target?.result as string); setResult(null) }; r.readAsDataURL(f)
  }

  function generate() {
    if (!src) return
    const img = new Image(); img.onload = () => {
      const canvas = canvasRef.current!; canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)
      ctx.font = `bold ${fontSize}px Impact, Arial Black`
      ctx.textAlign = "center"; ctx.lineWidth = fontSize / 6
      ctx.strokeStyle = "black"; ctx.fillStyle = "white"
      function drawText(text: string, y: number) {
        const x = canvas.width / 2
        ctx.strokeText(text.toUpperCase(), x, y)
        ctx.fillText(text.toUpperCase(), x, y)
      }
      if (topText) drawText(topText, fontSize + 10)
      if (bottomText) drawText(bottomText, canvas.height - 20)
      setResult(canvas.toDataURL("image/png"))
    }; img.src = src
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Meme Generator" description="Add classic top/bottom impact text to any image." />

      {!src ? (
        <label className="block cursor-pointer">
          <div className="rounded-xl p-12 text-center border-2 border-dashed" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
            <p className="text-3xl mb-2">😂</p>
            <p className="font-semibold" style={{ color: "var(--color-foreground)" }}>Click to upload an image</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={loadFile} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Top Text</label>
              <input className="input-base font-bold uppercase" value={topText} onChange={e => setTopText(e.target.value)} placeholder="Top text…" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Bottom Text</label>
              <input className="input-base font-bold uppercase" value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="Bottom text…" />
            </div>
            <div>
              <label className="text-xs font-semibold flex justify-between mb-1"><span style={{ color: "var(--color-muted-foreground)" }}>Font Size</span><span style={{ color: "var(--color-primary-light)" }}>{fontSize}px</span></label>
              <input type="range" min={20} max={100} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full" style={{ accentColor: "#7c5af3" }} />
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="flex gap-3">
            <button onClick={generate} className="btn-primary flex-1 py-2.5">Generate Meme</button>
            <button onClick={() => { setSrc(null); setResult(null) }} className="px-4 py-2.5 rounded-lg text-sm font-semibold" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-muted-foreground)" }}>New Image</button>
          </div>
          {result && (
            <div className="space-y-3">
              <img src={result} alt="meme" style={{ maxWidth: "100%", borderRadius: "0.75rem", border: "1px solid var(--color-border)" }} />
              <a href={result} download="meme.png" className="btn-primary block text-center py-2.5">⬇ Download Meme</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
