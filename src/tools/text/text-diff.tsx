"use client";

import { useState } from "react";
import { diffLines } from "diff";
import ToolHeader from "@/components/tool-header";

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export default function TextDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffResult, setDiffResult] = useState<DiffPart[]>([]);
  const [hasCompared, setHasCompared] = useState(false);

  const handleCompare = () => {
    const result = diffLines(original, modified);
    setDiffResult(result);
    setHasCompared(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ToolHeader
        title="Text Diff"
        description="Compare two texts and highlight the differences between them."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
            Original Text
          </label>
          <textarea
            className="input-base w-full h-48 sm:h-64 p-4 resize-y font-mono text-sm"
            placeholder="Paste original text here..."
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
            Modified Text
          </label>
          <textarea
            className="input-base w-full h-48 sm:h-64 p-4 resize-y font-mono text-sm"
            placeholder="Paste modified text here..."
            value={modified}
            onChange={(e) => setModified(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          className="btn-primary px-8 py-3 font-bold uppercase tracking-wider"
        >
          Compare Texts
        </button>
      </div>
      {hasCompared && (
        <div className="rounded-xl overflow-hidden shadow-2xl" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <div className="px-4 py-3 text-xs font-black uppercase tracking-widest" style={{ background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)", color: "var(--color-muted-foreground)" }}>
            Diff Result
          </div>
          <div className="p-4 font-mono text-sm overflow-x-auto custom-scrollbar">
            {diffResult.length === 0 ? (
              <p style={{ color: "var(--color-muted-foreground)" }}>No differences found.</p>
            ) : (
              diffResult.map((part, index) => {
                const lines = part.value.split("\n").filter((line, i, arr) =>
                  i < arr.length - 1 || line !== ""
                );
                return lines.map((line, lineIndex) => (
                  <div
                    key={`${index}-${lineIndex}`}
                    className="px-2 py-0.5 whitespace-pre"
                    style={
                      part.added
                        ? { background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }
                        : part.removed
                        ? { background: "rgba(244, 63, 94, 0.1)", color: "#f43f5e" }
                        : { color: "var(--color-foreground)" }
                    }
                  >
                    <span className="select-none mr-3 opacity-50">
                      {part.added ? "+" : part.removed ? "-" : " "}
                    </span>
                    {line}
                  </div>
                ));
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}