import { useState, useRef, useCallback } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";
import { Pipette, Upload } from "lucide-react";

interface PickedColor {
  hex: string;
  r: number; g: number; b: number;
  x: number; y: number;
}

function toHex(v: number) { return v.toString(16).padStart(2, "0"); }

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ImageColorPicker() {
  const [src, setSrc] = useState("");
  const [picked, setPicked] = useState<PickedColor | null>(null);
  const [history, setHistory] = useState<PickedColor[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setSrc(url); setPicked(null);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  };

  const drawToCanvas = () => {
    const img = imgRef.current; const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
  };

  const pickColor = (e: React.MouseEvent<HTMLImageElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.naturalWidth / rect.width;
    const scaleY = e.currentTarget.naturalHeight / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext("2d")!;
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const color = { hex, r, g, b, x, y };
    setPicked(color);
    setHistory((prev) => [color, ...prev.slice(0, 11)]);
  };

  const hsl = picked ? rgbToHsl(picked.r, picked.g, picked.b) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToolHeader title="Image Color Picker" description="Click anywhere on an image to pick its exact color — HEX, RGB, and HSL." />

      {!src ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById("img-color-input")?.click()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all"
          style={{ borderColor: isDragging ? "var(--color-primary)" : "var(--color-border)", background: isDragging ? "rgba(124,90,243,0.08)" : "var(--color-surface-2)" }}>
          <Pipette className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--color-primary)" }} />
          <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>Drop an image here</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Click anywhere on the image to pick a color</p>
          <input id="img-color-input" type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-5">
          <canvas ref={canvasRef} className="hidden" />
          <div className="relative rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            <img ref={imgRef} src={src} alt="Pick colors" onLoad={drawToCanvas}
              onClick={pickColor}
              className="w-full max-h-72 object-contain cursor-crosshair block"
              style={{ background: "repeating-conic-gradient(#444 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }} />
            <button onClick={() => { setSrc(""); setPicked(null); setHistory([]); }}
              className="absolute top-2 right-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "rgba(13,13,20,0.85)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              <Upload className="h-3 w-3 inline mr-1" />New
            </button>
          </div>

          {picked && (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
              {/* Color preview */}
              <div className="h-16" style={{ background: picked.hex }} />
              <div className="p-4 space-y-2" style={{ background: "var(--color-surface-2)" }}>
                {[
                  { label: "HEX", value: picked.hex.toUpperCase() },
                  { label: "RGB", value: `rgb(${picked.r}, ${picked.g}, ${picked.b})` },
                  { label: "HSL", value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-10" style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
                    <code className="flex-1 text-sm font-mono" style={{ color: "var(--color-foreground)" }}>{value}</code>
                    <CopyButton text={value} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {history.length > 1 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-muted-foreground)" }}>Color History</p>
              <div className="flex flex-wrap gap-2">
                {history.map((c, i) => (
                  <button key={i} onClick={() => setPicked(c)}
                    className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
                    style={{ background: c.hex, borderColor: picked?.hex === c.hex ? "var(--color-primary)" : "var(--color-border)" }}
                    title={c.hex} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
