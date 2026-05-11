import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolHeader from "@/components/tool-header";
import { Scissors, Upload, Download, FileText } from "lucide-react";

function parseRanges(input: string, maxPage: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = Math.max(1, a); i <= Math.min(maxPage, b); i++) pages.add(i);
    } else {
      const n = Number(part);
      if (n >= 1 && n <= maxPage) pages.add(n);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export default function PdfSplitter() {
  const [file, setFile] = useState<{ name: string; buffer: ArrayBuffer; pages: number } | null>(null);
  const [range, setRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const loadFile = async (f: File) => {
    setError("");
    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile({ name: f.name, buffer, pages: doc.getPageCount() });
      setRange(`1-${doc.getPageCount()}`);
    } catch {
      setError("Could not read this PDF. It may be corrupted or encrypted.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");
    try {
      const pages = parseRanges(range, file.pages);
      if (pages.length === 0) { setError("No valid pages in range."); setIsProcessing(false); return; }
      const src = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((p) => newDoc.addPage(p));
      const bytes = await newDoc.save();
      const blob = new Blob([new Uint8Array(bytes) as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `split_pages_${pages.join("-")}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Extraction failed."); console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const previewPages = file ? parseRanges(range, file.pages) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToolHeader title="PDF Splitter" description="Extract specific pages or page ranges from a PDF into a new file." />

      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById("pdf-split-input")?.click()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all"
          style={{
            borderColor: isDragging ? "var(--color-primary)" : "var(--color-border)",
            background: isDragging ? "rgba(124,90,243,0.08)" : "var(--color-surface-2)",
          }}
        >
          <Scissors className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--color-primary)" }} />
          <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>Drop a PDF here</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>or click to browse</p>
          <input id="pdf-split-input" type="file" accept=".pdf,application/pdf" className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="p-4 rounded-xl flex items-center gap-3"
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ background: "rgba(244,63,94,0.12)", color: "#fb7185" }}>
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: "var(--color-foreground)" }}>{file.name}</p>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{file.pages} pages total</p>
          </div>
          <button onClick={() => setFile(null)} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "var(--color-surface-3)", color: "var(--color-muted-foreground)" }}>
            <Upload className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {file && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>
              Page Range <span style={{ color: "var(--color-muted-foreground)", fontWeight: 400 }}>(e.g. 1-3, 5, 7-9)</span>
            </label>
            <input
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder={`1-${file.pages}`}
              className="input-base"
            />
            {previewPages.length > 0 && (
              <p className="text-xs mt-2" style={{ color: "var(--color-muted-foreground)" }}>
                Will extract <strong style={{ color: "var(--color-primary-light)" }}>{previewPages.length}</strong> page{previewPages.length !== 1 ? "s" : ""}: {previewPages.slice(0, 20).join(", ")}{previewPages.length > 20 ? "…" : ""}
              </p>
            )}
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "First half", val: `1-${Math.floor(file.pages / 2)}` },
              { label: "Second half", val: `${Math.floor(file.pages / 2) + 1}-${file.pages}` },
              { label: "First page", val: "1" },
              { label: "Last page", val: `${file.pages}` },
              { label: "All", val: `1-${file.pages}` },
            ].map((p) => (
              <button key={p.label} onClick={() => setRange(p.val)}
                className="px-3 py-1 text-xs rounded-full transition-all"
                style={{ background: "var(--color-surface-3)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(244,63,94,0.1)", color: "#fb7185" }}>{error}</p>}

      <button onClick={handleExtract} disabled={!file || previewPages.length === 0 || isProcessing}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
        <Download className="h-4 w-4" />
        {isProcessing ? "Extracting…" : `Extract ${previewPages.length > 0 ? previewPages.length : ""} Pages & Download`}
      </button>
    </div>
  );
}
