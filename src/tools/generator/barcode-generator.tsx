import { useRef, useState } from "react"
import ToolHeader from "@/components/tool-header"

export default function BarcodeGenerator() {
  const [value, setValue] = useState("123456789012")
  const [format, setFormat] = useState("EAN13")
  const svgRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState("")
  const [hasGenerated, setHasGenerated] = useState(false)

  async function generate() {
    setError("")
    setHasGenerated(false)
    const JsBarcode = (await import("jsbarcode")).default
    if (!svgRef.current) return
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    try {
      JsBarcode(svg, value, {
        format, lineColor: "#e8e8f0", background: "transparent",
        width: 2, height: 80, displayValue: true, fontOptions: "bold",
        font: "Inter", textAlign: "center", textMargin: 6, fontSize: 14
      })
      svgRef.current.innerHTML = ""
      svgRef.current.appendChild(svg)
      setHasGenerated(true)
    } catch (e: unknown) {
      setError((e as Error).message || "Invalid barcode value for this format")
    }
  }

  function download() {
    if (!svgRef.current) return
    const svg = svgRef.current.querySelector("svg")
    if (!svg) return
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svg)
    img.onload = () => {
      canvas.width = img.width * 2; canvas.height = img.height * 2
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const a = document.createElement("a"); a.download = `barcode-${value}.png`; a.href = canvas.toDataURL(); a.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <ToolHeader title="Barcode Generator" description="Generate barcodes in EAN, Code 128, UPC, and other standard formats." />

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Format</label>
          <select className="input-base" value={format} onChange={e => setFormat(e.target.value)}>
            {["EAN13","EAN8","CODE128","CODE39","UPC","ITF14","MSI","pharmacode"].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Value</label>
          <input className="input-base font-mono" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter barcode value…" />
        </div>
        <button onClick={generate} className="btn-primary w-full py-2.5">Generate Barcode</button>
      </div>

      {error && <p className="text-sm text-center" style={{ color: "var(--color-destructive)" }}>{error}</p>}

      <div className="rounded-xl p-6 flex flex-col items-center gap-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div ref={svgRef} style={{ filter: "invert(0)" }} />
        {hasGenerated && (
          <button onClick={download} className="btn-primary px-6 py-2">⬇ Download PNG</button>
        )}
      </div>
    </div>
  )
}
