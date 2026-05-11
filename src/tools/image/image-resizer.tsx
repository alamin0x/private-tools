import { useState, useRef, useCallback, useEffect } from "react";
import ToolHeader from "@/components/tool-header";
import { Scaling, Upload, Download, Lock, Unlock, AlertCircle } from "lucide-react";

export default function ImageResizer() {
  const [src, setSrc] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [isDragging, setIsDragging] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Memory cleanup
  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (src) URL.revokeObjectURL(src);
    
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSrc(url); 
      setOrigW(img.naturalWidth); 
      setOrigH(img.naturalHeight);
      setWidth(img.naturalWidth); 
      setHeight(img.naturalHeight);
    };
    img.src = url;
  }, [src]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) loadFile(f);
  };

  const handleWidthChange = (v: number) => {
    setWidth(v);
    if (lockRatio && origW) setHeight(Math.round((v / origW) * origH));
  };
  const handleHeightChange = (v: number) => {
    setHeight(v);
    if (lockRatio && origH) setWidth(Math.round((v / origH) * origW));
  };

  const handleDownload = () => {
    const img = imgRef.current; if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    
    // Background for JPEG
    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    
    ctx.drawImage(img, 0, 0, width, height);
    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); 
      a.href = url; 
      a.download = `resized-${width}x${height}.${ext}`; 
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }, format, 0.92);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToolHeader title="Image Resizer" description="Resize images to exact dimensions with optional aspect-ratio lock." />

      {!src ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById("img-resize-input")?.click()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all"
          style={{ borderColor: isDragging ? "var(--color-primary)" : "var(--color-border)", background: isDragging ? "rgba(124,90,243,0.08)" : "var(--color-surface-2)" }}>
          <Scaling className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--color-primary)" }} />
          <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>Drop an image here</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>PNG, JPG, WEBP — Processed 100% locally</p>
          <input id="img-resize-input" type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-xl overflow-hidden flex items-center justify-center p-4 relative group"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", minHeight: "180px" }}>
            <img ref={imgRef} src={src} alt="Preview" className="max-w-full max-h-52 rounded-lg object-contain shadow-lg" />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] px-2 py-1 rounded-md bg-black/50 text-white backdrop-blur-sm">
                Original: {origW}×{origH}px
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-muted-foreground)" }}>Width (px)</label>
              <input type="number" min={1} max={10000} value={width} onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="input-base" />
            </div>
            <div className="flex flex-col items-center">
               <button onClick={() => setLockRatio(!lockRatio)} className="mb-0.5 p-2.5 rounded-lg transition-all"
                style={{ 
                  background: lockRatio ? "rgba(124,90,243,0.15)" : "var(--color-surface-3)", 
                  color: lockRatio ? "var(--color-primary-light)" : "var(--color-muted-foreground)", 
                  border: "1px solid var(--color-border)" 
                }}>
                {lockRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </button>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: "var(--color-muted-foreground)" }}>
                {lockRatio ? "Locked" : "Unlocked"}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-muted-foreground)" }}>Height (px)</label>
              <input type="number" min={1} max={10000} value={height} onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="input-base" />
            </div>
          </div>

          <div className="p-4 rounded-xl space-y-3" style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
            <label className="block text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Output Format</label>
            <div className="flex gap-2">
              {(["image/png", "image/jpeg", "image/webp"] as const).map((f) => (
                <button key={f} onClick={() => setFormat(f)}
                  className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                  style={format === f
                    ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" }
                    : { background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
                  {f.split("/")[1].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setSrc(""); }} className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              <Upload className="h-4 w-4 inline mr-2" />New
            </button>
            <button onClick={handleDownload} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
              <Download className="h-4 w-4" />
              Download {width}×{height}px
            </button>
          </div>
          
          <p className="text-[10px] text-center flex items-center justify-center gap-1" style={{ color: "var(--color-muted-foreground)" }}>
            <AlertCircle className="h-3 w-3" /> All processing happens in your browser memory for maximum privacy.
          </p>
        </div>
      )}
    </div>
  );
}
