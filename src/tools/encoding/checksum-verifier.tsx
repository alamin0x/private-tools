"use client";

import { useState, useCallback, useRef } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

interface HashResults {
  md5: string;
  "sha-1": string;
  "sha-256": string;
  "sha-512": string;
}

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

async function computeWebCryptoHash(data: Uint8Array, algorithm: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeAllHashes(data: Uint8Array): Promise<HashResults> {
  const [sha1, sha256, sha512] = await Promise.all([
    computeWebCryptoHash(data, "SHA-1"),
    computeWebCryptoHash(data, "SHA-256"),
    computeWebCryptoHash(data, "SHA-512"),
  ]);

  return {
    md5: md5(data),
    "sha-1": sha1,
    "sha-256": sha256,
    "sha-512": sha512,
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function ChecksumVerifier() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [hashes, setHashes] = useState<HashResults | null>(null);
  const [expectedHash, setExpectedHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<"match" | "mismatch" | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    setHashes(null);
    setVerifyResult(null);
    setIsComputing(true);

    try {
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      const results = await computeAllHashes(data);
      setHashes(results);
    } catch (err) {
      console.error("Hash computation failed:", err);
    } finally {
      setIsComputing(false);
    }
  }, []);

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

  const handleVerify = useCallback(() => {
    if (!hashes || !expectedHash.trim()) return;
    const normalized = expectedHash.trim().toLowerCase().replace(/\s/g, "");
    const allValues = Object.values(hashes);
    const match = allValues.some((h) => h === normalized);
    setVerifyResult(match ? "match" : "mismatch");
  }, [hashes, expectedHash]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Checksum Verifier"
        description="Compute file checksums and verify integrity."
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300"
        }`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {fileName
            ? `${fileName} (${formatFileSize(fileSize)})`
            : "Drop a file here or click to select"}
        </p>
        {isComputing && (
          <p className="text-sm text-blue-600 mt-2">Computing hashes...</p>
        )}
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

      {hashes && (
        <div className="space-y-3">
          {(Object.entries(hashes) as [string, string][]).map(([algo, hash]) => (
            <div key={algo} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium uppercase">{algo}</span>
                <CopyButton text={hash} className="text-sm" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-2">
                <code className="text-xs break-all font-mono">{hash}</code>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Expected Hash</label>
              <input
                type="text"
                value={expectedHash}
                onChange={(e) => {
                  setExpectedHash(e.target.value);
                  setVerifyResult(null);
                }}
                placeholder="Paste expected hash to verify..."
                className="w-full border rounded px-3 py-2 text-sm font-mono"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={!expectedHash.trim()}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify
            </button>
            {verifyResult === "match" && (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Hash matches!</span>
              </div>
            )}
            {verifyResult === "mismatch" && (
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm font-medium">Hash does not match!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}