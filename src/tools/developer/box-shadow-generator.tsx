import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function BoxShadowGenerator() {
  const [x, setX] = useState(4)
  const [y, setY] = useState(8)
  const [blur, setBlur] = useState(24)
  const [spread, setSpread] = useState(0)
  const [color, setColor] = useState("#7c5af3")
  const [opacity, setOpacity] = useState(40)
  const [inset, setInset] = useState(false)

  const hex2rgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha / 100})`
  }

  const shadowVal = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${hex2rgba(color, opacity)}`
  const css = `box-shadow: ${shadowVal};`

  const sliders = [
    ["Horizontal (X)", x, setX, -50, 50],
    ["Vertical (Y)", y, setY, -50, 50],
    ["Blur", blur, setBlur, 0, 100],
    ["Spread", spread, setSpread, -50, 50],
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Box Shadow Generator" description="Visually build CSS box-shadow values with live preview." />

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          {sliders.map(([label, val, setter, min, max]) => (
            <div key={label as string} className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</label>
                <span className="text-xs font-mono" style={{ color: "var(--color-primary-light)" }}>{val as number}px</span>
              </div>
              <input type="range" min={min as number} max={max as number} value={val as number}
                onChange={e => (setter as (v: number) => void)(+e.target.value)}
                className="w-full" style={{ accentColor: "#7c5af3" }} />
            </div>
          ))}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Opacity</label>
              <span className="text-xs font-mono" style={{ color: "var(--color-primary-light)" }}>{opacity}%</span>
            </div>
            <input type="range" min={0} max={100} value={opacity} onChange={e => setOpacity(+e.target.value)}
              className="w-full" style={{ accentColor: "#7c5af3" }} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Color:</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--color-muted-foreground)" }}>
              <input type="checkbox" checked={inset} onChange={e => setInset(e.target.checked)} />
              Inset
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-xl flex items-center justify-center min-h-48" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            <div className="w-32 h-32 rounded-xl" style={{ background: "var(--color-surface-3)", boxShadow: shadowVal }} />
          </div>
          <div className="relative rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>CSS Output</span>
              <CopyButton text={css} />
            </div>
            <code className="text-xs font-mono break-all" style={{ color: "var(--color-primary-light)" }}>{css}</code>
          </div>
        </div>
      </div>
    </div>
  )
}
