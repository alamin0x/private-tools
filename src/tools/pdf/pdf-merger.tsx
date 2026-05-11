import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import ToolHeader from "@/components/tool-header";
import { FilePlus2, X, ArrowUp, ArrowDown, Download, FileText, AlertTriangle } from "lucide-react";

interface PDFFile {
  id: string;
  name: string;
  buffer: ArrayBuffer;
  pages: number;
  size: number;
}

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB limit for safety

export default function PdfMerger() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const loadFiles = useCallback(async (fileList: FileList) => {
    setError("");
    const pdfs = Array.from(fileList).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    
    const loaded: PDFFile[] = [];
    let currentTotal = files.reduce((s, f) => s + f.size, 0);

    for (const f of pdfs) {
      if (currentTotal + f.size > MAX_TOTAL_SIZE) {
        setError("Total size exceeds 100MB. Please use fewer or smaller files to prevent browser crash.");
        break;
      }
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        loaded.push({ 
          id: Math.random().toString(36).substr(2, 9),
          name: f.name, 
          buffer, 
          pages: doc.getPageCount(), 
          size: f.size 
        });
        currentTotal += f.size;
      } catch {
        setError(`Failed to load "${f.name}". File may be corrupted or encrypted.`);
      }
    }
    setFiles((prev) => [...prev, ...loaded]);
  }, [files]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) loadFiles(e.dataTransfer.files);
  };

  const move = (i: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      return next;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setError("");
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const doc = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "merged.pdf"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError("Merge failed. One or more files may be encrypted or too large.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = files.reduce((s, f) => s + f.pages, 0);
  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToolHeader title="PDF Merger" description="Combine multiple PDF files into one. Drag to reorder before merging." />

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => document.getElementById("pdf-merge-input")?.click()}
        className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all"
        style={{
          borderColor: isDragging ? "var(--color-primary)" : "var(--color-border)",
          background: isDragging ? "rgba(124,90,243,0.08)" : "var(--color-surface-2)",
        }}
      >
        <FilePlus2 className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--color-primary)" }} />
        <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>Drop PDF files here</p>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>or click to browse — 100MB total limit</p>
        <input id="pdf-merge-input" type="file" accept=".pdf,application/pdf" multiple className="hidden"
          onChange={(e) => e.target.files && loadFiles(e.target.files)} />
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: "rgba(244,63,94,0.1)", color: "#fb7185" }}>
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
              {files.length} files · {totalPages} pages · {fmtSize(totalSize)}
            </span>
            <button onClick={() => setFiles([])} className="text-xs transition-colors" style={{ color: "var(--color-muted-foreground)" }}>
              Clear all
            </button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {files.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                  style={{ background: "rgba(244,63,94,0.12)", color: "#fb7185" }}>
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-foreground)" }}>{f.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    {f.pages} page{f.pages !== 1 ? "s" : ""} · {fmtSize(f.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => move(i, -1)} disabled={i === 0}
                    className="p-1.5 rounded-lg disabled:opacity-25"
                    style={{ color: "var(--color-muted-foreground)" }}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === files.length - 1}
                    className="p-1.5 rounded-lg disabled:opacity-25"
                    style={{ color: "var(--color-muted-foreground)" }}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setFiles((p) => p.filter((file) => file.id !== f.id))}
                    className="p-1.5 rounded-lg" style={{ color: "#fb7185" }}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleMerge} disabled={files.length < 2 || isProcessing}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-40">
        <Download className="h-4 w-4" />
        {isProcessing ? "Merging PDFs…" : `Merge ${files.length > 0 ? files.length : ""} PDFs & Download`}
      </button>
    </div>
  );
}
