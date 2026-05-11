import { useState, useRef } from "react"
import ToolHeader from "@/components/tool-header"

export default function ImageCropper() {
  const [src, setSrc] = useState<string | null>(null)
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, w: 200, h: 150 })
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, bx: 0, by: 0, bw: 0, bh: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const [result, setResult] = useState<string | null>(null)

  function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => setSrc(ev.target?.result as string); r.readAsDataURL(f)
    setResult(null)
  }

  function mouseDown(e: React.MouseEvent, type: string) {
    e.preventDefault()
    setDragging(type)
    setDragStart({ mx: e.clientX, my: e.clientY, bx: cropBox.x, by: cropBox.y, bw: cropBox.w, bh: cropBox.h })
  }

  function mouseMove(e: React.MouseEvent) {
    if (!dragging) return
    const dx = e.clientX - dragStart.mx, dy = e.clientY - dragStart.my
    if (dragging === "move") setCropBox(b => ({ ...b, x: dragStart.bx + dx, y: dragStart.by + dy }))
    else if (dragging === "se") setCropBox(b => ({ ...b, w: Math.max(40, dragStart.bw + dx), h: Math.max(40, dragStart.bh + dy) }))
  }

  function crop() {
    if (!imgRef.current || !src) return
    const img = imgRef.current
    const scaleX = img.naturalWidth / img.width, scaleY = img.naturalHeight / img.height
    const canvas = document.createElement("canvas")
    canvas.width = cropBox.w * scaleX; canvas.height = cropBox.h * scaleY
    canvas.getContext("2d")!.drawImage(img, cropBox.x * scaleX, cropBox.y * scaleY, cropBox.w * scaleX, cropBox.h * scaleY, 0, 0, canvas.width, canvas.height)
    setResult(canvas.toDataURL("image/png"))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <ToolHeader title="Image Cropper" description="Drag to select and crop any region of your image." />

      {!src ? (
        <label className="block cursor-pointer">
          <div className="rounded-xl p-12 text-center border-2 border-dashed transition-colors" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
            <p className="text-3xl mb-2">✂️</p>
            <p className="font-semibold" style={{ color: "var(--color-foreground)" }}>Click to upload an image</p>
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>PNG, JPG, WebP supported</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={loadFile} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative inline-block select-none overflow-hidden rounded-xl" style={{ border: "1px solid var(--color-border)", cursor: dragging === "move" ? "grabbing" : "default" }}
            onMouseMove={mouseMove} onMouseUp={() => setDragging(null)} onMouseLeave={() => setDragging(null)}>
            <img ref={imgRef} src={src} alt="crop" style={{ display: "block", maxWidth: "100%", maxHeight: "400px" }} draggable={false} />
            <div onMouseDown={e => mouseDown(e, "move")}
              style={{ position: "absolute", left: cropBox.x, top: cropBox.y, width: cropBox.w, height: cropBox.h, border: "2px solid #7c5af3", boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)", cursor: "grab", background: "transparent" }}>
              <div onMouseDown={e => { e.stopPropagation(); mouseDown(e, "se") }}
                style={{ position: "absolute", right: -5, bottom: -5, width: 12, height: 12, background: "#7c5af3", cursor: "se-resize", borderRadius: 2 }} />
            </div>
          </div>
          <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Drag the box to move · Drag the corner to resize</p>
          <div className="flex gap-3">
            <button onClick={crop} className="btn-primary flex-1 py-2.5">✂️ Crop</button>
            <button onClick={() => { setSrc(null); setResult(null) }} className="px-4 py-2.5 rounded-lg text-sm font-semibold" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-muted-foreground)" }}>New Image</button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            <img src={result} alt="cropped" style={{ maxWidth: "100%" }} />
          </div>
          <a href={result} download="cropped.png" className="btn-primary block text-center py-2.5">⬇ Download Cropped Image</a>
        </div>
      )}
    </div>
  )
}
