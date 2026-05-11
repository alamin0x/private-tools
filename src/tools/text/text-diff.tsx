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
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Text Diff"
        description="Compare two texts and highlight the differences between them."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Original Text
          </label>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Paste original text here..."
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Modified Text
          </label>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Paste modified text here..."
            value={modified}
            onChange={(e) => setModified(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          className="btn-primary px-6 py-2"
        >
          Compare
        </button>
      </div>
      {hasCompared && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Diff Result
          </div>
          <div className="p-4 font-mono text-sm overflow-x-auto">
            {diffResult.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No differences found.</p>
            ) : (
              diffResult.map((part, index) => {
                const lines = part.value.split("\n").filter((line, i, arr) =>
                  i < arr.length - 1 || line !== ""
                );
                return lines.map((line, lineIndex) => (
                  <div
                    key={`${index}-${lineIndex}`}
                    className="px-2 py-0.5"
                    style={
                      part.added
                        ? { background: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)" }
                        : part.removed
                        ? { background: "rgba(244, 63, 94, 0.15)", color: "var(--color-destructive)" }
                        : { color: "var(--color-foreground)" }
                    }
                  >
                    <span className="select-none mr-2">
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