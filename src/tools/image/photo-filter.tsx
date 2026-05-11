import { useState } from "react"
import ToolHeader from "@/components/tool-header"

const FILTERS = [
  { name: "None", fn: "" },
  { name: "Grayscale", fn: "grayscale(100%)" },
  { name: "Sepia", fn: "sepia(100%)" },
  { name: "Vintage", fn: "sepia(60%) contrast(110%) brightness(90%)" },
  { name: "Cool", fn: "hue-rotate(180deg) saturate(80%)" },
  { name: "Warm", fn: "hue-rotate(-30deg) saturate(120%)" },
  { name: "Vivid", fn: "saturate(200%) contrast(110%)" },
  { name: "Fade", fn: "opacity(70%) brightness(110%)" },
  { name: "Dark", fn: "brightness(70%) contrast(120%)" },
  { name: "Invert", fn: "invert(100%)" },
  { name: "Blur", fn: "blur(2px)" },
  { name: "Sharpen", fn: "contrast(150%)" },
]

export default function PhotoFilter() {
  const [src, setSrc] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)

  function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => setSrc(ev.target?.result as string); r.readAsDataURL(f)
  }

  const filterStyle = `${FILTERS[activeFilter].fn} brightness(${brightness}%) contrast(${contrast}%)`

  function download() {
    if (!src) return
    const img = new Image(); img.onload = () => {
      const canvas = document.createElement("canvas"); canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext("2d")!; ctx.filter = filterStyle; ctx.drawImage(img, 0, 0)
      const a = document.createElement("a"); a.download = "filtered.png"; a.href = canvas.toDataURL(); a.click()
    }; img.src = src
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <ToolHeader title="Photo Filter Tool" description="Apply instant filters and adjustments to your images." />

      {!src ? (
        <label className="block cursor-pointer">
          <div className="rounded-xl p-12 text-center border-2 border-dashed" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
            <p className="text-3xl mb-2">🎨</p>
            <p className="font-semibold" style={{ color: "var(--color-foreground)" }}>Click to upload an image</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={loadFile} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", minHeight: "240px" }}>
            <img src={src} alt="filtered" style={{ maxHeight: "400px", maxWidth: "100%", filter: filterStyle, transition: "filter 0.2s" }} />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {FILTERS.map((f, i) => (
              <button key={f.name} onClick={() => setActiveFilter(i)}
                className="rounded-lg py-2 text-xs font-semibold transition-all"
                style={activeFilter === i ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" } : { background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
                {f.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[["Brightness", brightness, setBrightness], ["Contrast", contrast, setContrast]].map(([label, val, setter]) => (
              <div key={label as string} className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</label>
                  <span className="text-xs font-mono" style={{ color: "var(--color-primary-light)" }}>{val as number}%</span>
                </div>
                <input type="range" min={0} max={200} value={val as number} onChange={e => (setter as (v: number) => void)(+e.target.value)} className="w-full" style={{ accentColor: "#7c5af3" }} />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={download} className="btn-primary flex-1 py-2.5">⬇ Download</button>
            <button onClick={() => setSrc(null)} className="px-4 py-2.5 rounded-lg text-sm font-semibold" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-muted-foreground)" }}>New Image</button>
          </div>
        </div>
      )}
    </div>
  )
}
