import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

export default function Base64Encoder() {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [fileOutput, setFileOutput] = useState("");
  const [error, setError] = useState("");

  function encodeText() {
    try {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(textInput);
      const binary = Array.from(bytes)
        .map((b) => String.fromCharCode(b))
        .join("");
      setTextOutput(btoa(binary));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setTextOutput("");
    }
  }

  function decodeText() {
    try {
      const binary = atob(textInput);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoder = new TextDecoder();
      setTextOutput(decoder.decode(bytes));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setTextOutput("");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || "";
      setFileOutput(base64);
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Base64 Encoder/Decoder"
        description="Encode and decode text or files to and from Base64."
      />

      <div className="flex border-b border-gray-300 dark:border-gray-600">
        <button
          onClick={() => setActiveTab("text")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "text"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setActiveTab("file")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "file"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          File
        </button>
      </div>

      {activeTab === "text" && (
        <div className="space-y-4">
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            placeholder="Enter text to encode, or base64 string to decode..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={encodeText}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Encode
            </button>
            <button
              onClick={decodeText}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Decode
            </button>
          </div>

          {error && <p className="text-red-500 text-sm font-mono">{error}</p>}

          {textOutput && (
            <div className="relative">
              <textarea
                className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                value={textOutput}
                readOnly
              />
              <CopyButton text={textOutput} className="absolute top-2 right-2" />
            </div>
          )}
        </div>
      )}

      {activeTab === "file" && (
        <div className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-gray-700 dark:file:text-gray-200"
          />

          {error && <p className="text-red-500 text-sm font-mono">{error}</p>}

          {fileOutput && (
            <div className="relative">
              <textarea
                className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                value={fileOutput}
                readOnly
              />
              <CopyButton text={fileOutput} className="absolute top-2 right-2" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
