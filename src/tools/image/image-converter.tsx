import { useState, useCallback, useRef } from "react";
import ToolHeader from "@/components/tool-header";
import { ImageDown, Upload } from "lucide-react";

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
}

type Format = "image/png" | "image/jpeg" | "image/webp";

export default function ImageConverter() {
  const [src, setSrc] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [origType, setOrigType] = useState("");
  const [targetFormat, setTargetFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState(90);
  const [isDragging, setIsDragging] = useState(false);
  const origNameRef = useRef("image");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    origNameRef.current = file.name.replace(/\.[^.]+$/, "");
    setOrigSize(file.size);
    setOrigType(file.type || "unknown");
    setSrc(URL.createObjectURL(file));
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  };

  const convert = () => {
    if (!src) return;
    const img = new Image(); img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      if (targetFormat !== "image/png") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const ext = targetFormat === "image/jpeg" ? "jpg" : targetFormat === "image/webp" ? "webp" : "png";
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${origNameRef.current}.${ext}`; a.click();
        URL.revokeObjectURL(url);
      }, targetFormat, quality / 100);
    };
  };

  const formats: { f: Format; label: string; desc: string }[] = [
    { f: "image/png", label: "PNG", desc: "Lossless, supports transparency" },
    { f: "image/jpeg", label: "JPEG", desc: "Lossy, smallest file size" },
    { f: "image/webp", label: "WebP", desc: "Modern, best compression" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToolHeader title="Image Converter" description="Convert images between PNG, JPEG, and WebP formats — instantly in your browser." />

      {!src ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById("img-conv-input")?.click()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all"
          style={{ borderColor: isDragging ? "var(--color-primary)" : "var(--color-border)", background: isDragging ? "rgba(124,90,243,0.08)" : "var(--color-surface-2)" }}>
          <ImageDown className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--color-primary)" }} />
          <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>Drop an image here</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Supports PNG, JPG, WEBP, GIF, BMP, SVG</p>
          <input id="img-conv-input" type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Image preview */}
          <div className="rounded-xl overflow-hidden flex items-center justify-center p-4"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", minHeight: "180px" }}>
            <img src={src} alt="Preview" className="max-w-full max-h-52 rounded-lg object-contain" />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg"
            style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
            <div className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
              Source: <strong style={{ color: "var(--color-foreground)" }}>{origType.split("/")[1]?.toUpperCase() ?? "Unknown"}</strong>
              {" · "}{fmtSize(origSize)}
            </div>
            <button onClick={() => setSrc("")} className="ml-auto text-xs px-2.5 py-1 rounded-lg"
              style={{ background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              <Upload className="h-3 w-3 inline mr-1" />Change
            </button>
          </div>

          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>Convert to</label>
            {formats.map(({ f, label, desc }) => (
              <label key={f} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: targetFormat === f ? "rgba(124,90,243,0.1)" : "var(--color-surface-2)",
                  border: `1px solid ${targetFormat === f ? "rgba(124,90,243,0.4)" : "var(--color-border)"}`,
                }}>
                <input type="radio" name="format" checked={targetFormat === f} onChange={() => setTargetFormat(f)} className="accent-violet-500" />
                <span>
                  <span className="font-bold text-sm mr-2" style={{ color: "var(--color-foreground)" }}>{label}</span>
                  <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{desc}</span>
                </span>
              </label>
            ))}
          </div>

          {targetFormat !== "image/png" && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>Quality</label>
                <span className="text-sm font-bold" style={{ color: "var(--color-primary-light)" }}>{quality}%</span>
              </div>
              <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-violet-500" />
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={convert} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
              <ImageDown className="h-4 w-4" />
              Convert & Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
