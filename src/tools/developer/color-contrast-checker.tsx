import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function ColorContrastChecker() {
  const [fg, setFg] = useState("#ffffff")
  const [bg, setBg] = useState("#7c5af3")

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  function luminance({ r, g, b }: { r: number; g: number; b: number }) {
    const sRGB = [r, g, b].map(v => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) })
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }

  function contrast(fg: string, bg: string) {
    const l1 = luminance(hexToRgb(fg)), l2 = luminance(hexToRgb(bg))
    const lighter = Math.max(l1, l2), darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  const ratio = contrast(fg, bg)
  const ratioStr = ratio.toFixed(2)

  function getLevel(r: number, type: "normal" | "large") {
    if (type === "large") return r >= 3 ? (r >= 4.5 ? "AAA" : "AA") : "Fail"
    return r >= 4.5 ? (r >= 7 ? "AAA" : "AA") : "Fail"
  }

  const levelNormal = getLevel(ratio, "normal")
  const levelLarge = getLevel(ratio, "large")

  function badge(level: string) {
    const color = level === "AAA" ? "#10b981" : level === "AA" ? "#f59e0b" : "#f43f5e"
    return <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: color + "22", color }}>{level}</span>
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <ToolHeader title="Color Contrast Checker" description="Check WCAG AA/AAA accessibility contrast ratios between two colors." />

      <div className="grid grid-cols-2 gap-4">
        {[["Foreground (Text)", fg, setFg], ["Background", bg, setBg]].map(([label, val, setter]) => (
          <div key={label as string} className="space-y-2">
            <label className="text-xs font-semibold block" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
              <input className="input-base font-mono text-sm flex-1" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        <div className="p-8 text-center space-y-2" style={{ background: bg, color: fg }}>
          <p className="text-2xl font-extrabold">The quick brown fox</p>
          <p className="text-base">Normal text sample</p>
          <p className="text-sm opacity-80">Small text sample</p>
        </div>
      </div>

      <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>Contrast Ratio</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-extrabold" style={{ color: ratio >= 4.5 ? "var(--color-success)" : ratio >= 3 ? "var(--color-warning)" : "var(--color-destructive)" }}>{ratioStr}:1</span>
            <CopyButton text={`${ratioStr}:1`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 space-y-1" style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Normal Text</span>
              {badge(levelNormal)}
            </div>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>AA requires 4.5:1 · AAA requires 7:1</p>
          </div>
          <div className="rounded-lg p-3 space-y-1" style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Large Text</span>
              {badge(levelLarge)}
            </div>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>AA requires 3:1 · AAA requires 4.5:1</p>
          </div>
        </div>
      </div>
    </div>
  )
}
