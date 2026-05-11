"use client";

import { useState, useCallback, useRef } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

function md5(input: Uint8Array): string {
  function leftRotate(x: number, c: number) {
    return (x << c) | (x >>> (32 - c));
  }

  const s = [
    7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
    5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
    4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
    6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21,
  ];

  const K = Array.from({ length: 64 }, (_, i) =>
    Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0
  );

  let a0 = 0x67452301 >>> 0;
  let b0 = 0xefcdab89 >>> 0;
  let c0 = 0x98badcfe >>> 0;
  let d0 = 0x10325476 >>> 0;

  const origLen = input.length;
  const bitLen = origLen * 8;

  const padded = new Uint8Array(Math.ceil((origLen + 9) / 64) * 64);
  padded.set(input);
  padded[origLen] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, bitLen >>> 0, true);
  view.setUint32(padded.length - 4, Math.floor(bitLen / 0x100000000), true);

  for (let offset = 0; offset < padded.length; offset += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(offset + j * 4, true);
    }

    let A = a0, B = b0, C = c0, D = d0;

    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }

      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + leftRotate(F, s[i])) >>> 0;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  const result = new DataView(new ArrayBuffer(16));
  result.setUint32(0, a0, true);
  result.setUint32(4, b0, true);
  result.setUint32(8, c0, true);
  result.setUint32(12, d0, true);

  return Array.from(new Uint8Array(result.buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeHash(data: Uint8Array, algorithm: string): Promise<string> {
  if (algorithm === "MD5") {
    return md5(data);
  }

  const algoMap: Record<string, string> = {
    "SHA-1": "SHA-1",
    "SHA-256": "SHA-256",
    "SHA-512": "SHA-512",
  };

  const hashBuffer = await crypto.subtle.digest(algoMap[algorithm], data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGenerator() {
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [hash, setHash] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleHash = useCallback(async (data: Uint8Array) => {
    const result = await computeHash(data, algorithm);
    setHash(result);
  }, [algorithm]);

  const handleTextHash = useCallback(async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    await handleHash(data);
  }, [text, handleHash]);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    await handleHash(new Uint8Array(buffer));
  }, [handleHash]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Hash Generator"
        description="Generate cryptographic hashes from text or files."
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="MD5">MD5</option>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Input</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Enter text to hash..."
            className="w-full border rounded p-3 text-sm resize-y"
          />
          <button
            onClick={handleTextHash}
            disabled={!text}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hash Text
          </button>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {fileName ? `File: ${fileName}` : "Drop a file here or click to select"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {hash && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{algorithm} Hash</span>
              <CopyButton text={hash} className="text-sm" />
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
              <code className="text-sm break-all font-mono">{hash}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}