import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";
import { FileSearch, Upload } from "lucide-react";

interface PDFMeta {
  pages: number;
  title: string;
  author: string;
  subject: string;
  creator: string;
  producer: string;
  keywords: string;
  created: string;
  modified: string;
  fileSize: string;
}

function fmtDate(d: Date | undefined) {
  if (!d) return "—";
  try { return d.toLocaleString(); } catch { return "—"; }
}

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
}

export default function PdfMetadata() {
  const [meta, setMeta] = useState<PDFMeta | null>(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const loadFile = async (f: File) => {
    setError(""); setMeta(null); setFileName(f.name);
    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setMeta({
        pages: doc.getPageCount(),
        title: doc.getTitle() ?? "—",
        author: doc.getAuthor() ?? "—",
        subject: doc.getSubject() ?? "—",
        creator: doc.getCreator() ?? "—",
        producer: doc.getProducer() ?? "—",
        keywords: doc.getKeywords() ?? "—",
        created: fmtDate(doc.getCreationDate()),
        modified: fmtDate(doc.getModificationDate()),
        fileSize: fmtSize(f.size),
      });
    } catch {
      setError("Could not read PDF metadata. The file may be corrupted.");
    }
  };

  const rows: [string, string][] = meta ? [
    ["Pages", String(meta.pages)],
    ["File Size", meta.fileSize],
    ["Title", meta.title],
    ["Author", meta.author],
    ["Subject", meta.subject],
    ["Creator", meta.creator],
    ["PDF Producer", meta.producer],
    ["Keywords", meta.keywords],
    ["Created", meta.created],
    ["Last Modified", meta.modified],
  ] : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToolHeader title="PDF Metadata Viewer" description="Inspect a PDF file's properties: page count, author, creation date, and more." />

      <div
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => document.getElementById("pdf-meta-input")?.click()}
        className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all"
        style={{
          borderColor: isDragging ? "var(--color-primary)" : "var(--color-border)",
          background: isDragging ? "rgba(124,90,243,0.08)" : "var(--color-surface-2)",
        }}
      >
        <FileSearch className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--color-primary)" }} />
        <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>Drop a PDF here</p>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>or click to browse — no data leaves your browser</p>
        <input id="pdf-meta-input" type="file" accept=".pdf,application/pdf" className="hidden"
          onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </div>

      {error && <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(244,63,94,0.1)", color: "#fb7185" }}>{error}</p>}

      {meta && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: "var(--color-surface-3)", borderBottom: "1px solid var(--color-border)" }}>
            <Upload className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
            <span className="text-sm font-semibold truncate" style={{ color: "var(--color-foreground)" }}>{fileName}</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center px-4 py-3 gap-4">
                <span className="text-xs font-semibold w-32 flex-shrink-0" style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
                <span className="flex-1 text-sm font-mono truncate" style={{ color: "var(--color-foreground)" }}>{value}</span>
                {value !== "—" && <CopyButton text={value} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
