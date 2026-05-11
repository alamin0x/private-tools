import { useState, useRef, useCallback } from "react";
import ToolHeader from "@/components/tool-header";
import { Minimize2, Download, Upload } from "lucide-react";

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const [src, setSrc] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressedUrl, setCompressedUrl] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const origName = useRef("image");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    origName.current = file.name.replace(/\.[^.]+$/, "");
    setOrigSize(file.size);
    setCompressedSize(null);
    setCompressedUrl("");
    const url = URL.createObjectURL(file);
    setSrc(url);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  };

  const compress = useCallback(() => {
    const img = imgRef.current; if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      setCompressedSize(blob.size);
      setCompressedUrl(URL.createObjectURL(blob));
    }, "image/jpeg", quality / 100);
  }, [quality]);

  const download = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl; a.download = `${origName.current}_compressed.jpg`; a.click();
  };

  const savings = compressedSize != null && origSize > 0
    ? Math.max(0, Math.round((1 - compressedSize / origSize) * 100))
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToolHeader title="Image Compressor" description="Reduce image file size with a quality slider. Output is JPEG." />

      {!src ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById("img-comp-input")?.click()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all"
          style={{ borderColor: isDragging ? "var(--color-primary)" : "var(--color-border)", background: isDragging ? "rgba(124,90,243,0.08)" : "var(--color-surface-2)" }}>
          <Minimize2 className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--color-primary)" }} />
          <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>Drop an image here</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>PNG, JPG, WEBP — compressed entirely in your browser</p>
          <input id="img-comp-input" type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-5">
          <img ref={imgRef} src={src} alt="Preview" onLoad={compress} className="hidden" />

          {/* Preview comparison */}
          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Original", size: origSize }, { label: "Compressed", size: compressedSize }].map(({ label, size }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-muted-foreground)" }}>{label}</p>
                <p className="text-lg font-bold" style={{ color: "var(--color-foreground)" }}>
                  {size != null ? fmtSize(size) : "—"}
                </p>
              </div>
            ))}
          </div>

          {savings != null && (
            <div className="text-center py-2 rounded-xl"
              style={{ background: savings > 0 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${savings > 0 ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}` }}>
              <p className="font-bold text-lg" style={{ color: savings > 0 ? "#34d399" : "#fbbf24" }}>
                {savings > 0 ? `${savings}% smaller` : "Same size (image was already optimal)"}
              </p>
            </div>
          )}

          {/* Quality slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>Quality</label>
              <span className="text-sm font-bold" style={{ color: "var(--color-primary-light)" }}>{quality}%</span>
            </div>
            <input type="range" min={1} max={100} value={quality}
              onChange={(e) => { setQuality(Number(e.target.value)); setTimeout(compress, 50); }}
              className="w-full accent-violet-500" />
            <div className="flex justify-between text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>
              <span>Smallest</span><span>Best quality</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setSrc("")} className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              <Upload className="h-4 w-4 inline mr-1.5" />New Image
            </button>
            <button onClick={download} disabled={!compressedUrl} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
              <Download className="h-4 w-4" />Download Compressed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
