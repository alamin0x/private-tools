import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

function toHex(str: string): string {
  return Array.from(str)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [expStatus, setExpStatus] = useState<{ expired: boolean; date: string } | null>(null);
  const [error, setError] = useState("");

  function handleDecode() {
    setError("");
    setHeader("");
    setPayload("");
    setSignature("");
    setExpStatus(null);

    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT: must have 3 parts separated by dots.");
      return;
    }

    try {
      const decodedHeader = decodeBase64Url(parts[0]);
      setHeader(formatJson(decodedHeader));
    } catch {
      setError("Failed to decode header.");
      return;
    }

    try {
      const decodedPayload = decodeBase64Url(parts[1]);
      setPayload(formatJson(decodedPayload));

      const payloadObj = JSON.parse(decodedPayload);
      if (payloadObj.exp) {
        const expDate = new Date(payloadObj.exp * 1000);
        const isExpired = expDate.getTime() < Date.now();
        setExpStatus({ expired: isExpired, date: expDate.toLocaleString() });
      }
    } catch {
      setError("Failed to decode payload.");
      return;
    }

    try {
      const decodedSig = decodeBase64Url(parts[2]);
      setSignature(toHex(decodedSig));
    } catch {
      setError("Failed to decode signature.");
      return;
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="JWT Decoder"
        description="Decode and inspect JSON Web Tokens (JWT)."
      />

      <div className="space-y-4">
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          placeholder="Paste your JWT token here..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Decode
        </button>

        {error && <p className="text-red-500 text-sm font-mono">{error}</p>}

        {expStatus && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
              expStatus.expired
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${expStatus.expired ? "bg-red-500" : "bg-green-500"}`} />
            {expStatus.expired ? "Expired" : "Valid"} - {expStatus.date}
          </div>
        )}

        {header && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Header</h3>
            <div className="relative">
              <pre className="p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 overflow-x-auto dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                {header}
              </pre>
              <CopyButton text={header} className="absolute top-2 right-2" />
            </div>
          </div>
        )}

        {payload && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Payload</h3>
            <div className="relative">
              <pre className="p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 overflow-x-auto dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                {payload}
              </pre>
              <CopyButton text={payload} className="absolute top-2 right-2" />
            </div>
          </div>
        )}

        {signature && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Signature</h3>
            <div className="relative">
              <pre className="p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 overflow-x-auto break-all whitespace-pre-wrap dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                {signature}
              </pre>
              <CopyButton text={signature} className="absolute top-2 right-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
