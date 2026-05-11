"use client";

import { useState, useCallback } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

function encodeHtmlEntities(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

function decodeHtmlEntities(text: string): string {
  const namedEntities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&hellip;": "…",
    "&mdash;": "—",
    "&ndash;": "–",
  };

  let result = text;

  // Replace named entities
  for (const [entity, char] of Object.entries(namedEntities)) {
    result = result.replaceAll(entity, char);
  }

  // Replace decimal numeric entities (&#60;)
  result = result.replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)));

  // Replace hex numeric entities (&#x3C;)
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );

  return result;
}

export default function HtmlEntityEncoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      if (mode === "encode") {
        setOutput(encodeHtmlEntities(value));
      } else {
        setOutput(decodeHtmlEntities(value));
      }
    },
    [mode]
  );

  const handleModeChange = useCallback(
    (newMode: "encode" | "decode") => {
      setMode(newMode);
      if (input) {
        if (newMode === "encode") {
          setOutput(encodeHtmlEntities(input));
        } else {
          setOutput(decodeHtmlEntities(input));
        }
      }
    },
    [input]
  );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="HTML Entity Encoder/Decoder"
        description="Encode special characters to HTML entities or decode them back."
      />

      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange("encode")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              mode === "encode"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => handleModeChange("decode")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              mode === "decode"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Decode
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Input</label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            rows={5}
            placeholder={
              mode === "encode"
                ? 'Enter text with special characters (e.g., <div class="test">)'
                : "Enter HTML entities (e.g., &lt;div class=&quot;test&quot;&gt;)"
            }
            className="w-full border rounded p-3 text-sm font-mono resize-y"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium">Output</label>
            <CopyButton text={output} className="text-sm" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={5}
            className="w-full border rounded p-3 text-sm font-mono bg-gray-50 dark:bg-gray-800 resize-y"
          />
        </div>
      </div>
    </div>
  );
}