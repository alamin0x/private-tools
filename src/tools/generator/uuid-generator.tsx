"use client";

import { useState, useCallback } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

function generateUUIDv4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const generated = Array.from({ length: count }, () => {
      let uuid = generateUUIDv4();
      if (!hyphens) uuid = uuid.replace(/-/g, "");
      if (uppercase) uuid = uuid.toUpperCase();
      return uuid;
    });
    setUuids(generated);
  }, [count, uppercase, hyphens]);

  const allText = uuids.join("\n");

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="UUID Generator"
        description="Generate random UUID v4 identifiers."
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Count (1-100)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            className="w-24 border rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Uppercase</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include hyphens</span>
          </label>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Generate UUIDs
        </button>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Generated UUIDs</span>
            <CopyButton text={allText} className="text-sm" />
          </div>
          <textarea
            readOnly
            value={allText}
            rows={Math.min(uuids.length, 10)}
            className="w-full font-mono text-sm border rounded p-3 bg-gray-50 dark:bg-gray-800 resize-y"
          />
        </div>
      )}
    </div>
  );
}