"use client";

import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

type EncodingType = "url" | "base64" | "html" | "unicode";

const ENCODING_TYPES: { value: EncodingType; label: string }[] = [
  { value: "url", label: "URL Encode/Decode" },
  { value: "base64", label: "Base64 Encode/Decode" },
  { value: "html", label: "HTML Entities" },
  { value: "unicode", label: "Unicode Escape" },
];

function urlEncode(str: string): string {
  return encodeURIComponent(str);
}

function urlDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return "Error: Invalid URL-encoded string";
  }
}

function base64Encode(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return "Error: Could not encode to Base64";
  }
}

function base64Decode(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return "Error: Invalid Base64 string";
  }
}

function htmlEncode(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlDecode(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function unicodeEscape(str: string): string {
  return Array.from(str)
    .map((char) => {
      const code = char.codePointAt(0);
      if (code === undefined) return char;
      if (code > 127) {
        return `\\u${code.toString(16).padStart(4, "0")}`;
      }
      return char;
    })
    .join("");
}

function unicodeUnescape(str: string): string {
  try {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  } catch {
    return "Error: Invalid Unicode escape sequence";
  }
}

export default function StringEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encodingType, setEncodingType] = useState<EncodingType>("url");

  const handleEncode = () => {
    switch (encodingType) {
      case "url":
        setOutput(urlEncode(input));
        break;
      case "base64":
        setOutput(base64Encode(input));
        break;
      case "html":
        setOutput(htmlEncode(input));
        break;
      case "unicode":
        setOutput(unicodeEscape(input));
        break;
    }
  };

  const handleDecode = () => {
    switch (encodingType) {
      case "url":
        setOutput(urlDecode(input));
        break;
      case "base64":
        setOutput(base64Decode(input));
        break;
      case "html":
        setOutput(htmlDecode(input));
        break;
      case "unicode":
        setOutput(unicodeUnescape(input));
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="String Encoder/Decoder"
        description="Encode and decode strings using various encoding formats."
      />
      <div className="flex flex-wrap gap-2">
        {ENCODING_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setEncodingType(type.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              encodingType === type.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Input
        </label>
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="Enter text to encode or decode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleEncode}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Encode
        </button>
        <button
          onClick={handleDecode}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Decode
        </button>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Output
        </label>
        <div className="relative">
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Result will appear here..."
            value={output}
            readOnly
          />
          {output && <CopyButton text={output} className="absolute top-2 right-2" />}
        </div>
      </div>
    </div>
  );
}
