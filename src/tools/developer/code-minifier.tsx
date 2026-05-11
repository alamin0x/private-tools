import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

type Language = "html" | "css" | "javascript";

function minifyHTML(code: string): string {
  let result = code;
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  result = result.replace(/>\s+</g, "><");
  result = result.replace(/\s{2,}/g, " ");
  result = result.trim();
  return result;
}

function minifyCSS(code: string): string {
  let result = code;
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  result = result.replace(/\s{2,}/g, " ");
  result = result.replace(/\s*([{}:;,])\s*/g, "$1");
  result = result.replace(/;}/g, "}");
  result = result.replace(/\n/g, "");
  result = result.trim();
  return result;
}

function minifyJS(code: string): string {
  let result = code;
  result = result.replace(/\/\/.*$/gm, "");
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  result = result.replace(/\n\s*\n/g, "\n");
  result = result.replace(/\s{2,}/g, " ");
  result = result.replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, "$1");
  result = result.replace(/\n/g, "");
  result = result.trim();
  return result;
}

export default function CodeMinifier() {
  const [language, setLanguage] = useState<Language>("javascript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; minified: number; saved: number } | null>(null);

  function handleMinify() {
    let result = "";
    switch (language) {
      case "html":
        result = minifyHTML(input);
        break;
      case "css":
        result = minifyCSS(input);
        break;
      case "javascript":
        result = minifyJS(input);
        break;
    }
    setOutput(result);
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([result]).size;
    const saved = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;
    setStats({ original: originalSize, minified: minifiedSize, saved });
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Code Minifier"
        description="Minify HTML, CSS, and JavaScript by removing comments and whitespace."
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        <textarea
          className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          placeholder={`Paste your ${language.toUpperCase()} code here...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleMinify}
          className="btn-primary px-4 py-2"
        >
          Minify
        </button>

        {stats && (
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Original: <strong>{stats.original}</strong> bytes
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Minified: <strong>{stats.minified}</strong> bytes
            </span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              Saved: {stats.saved}%
            </span>
          </div>
        )}

        {output && (
          <div className="relative">
            <textarea
              className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              value={output}
              readOnly
            />
            <CopyButton text={output} className="absolute top-2 right-2" />
          </div>
        )}
      </div>
    </div>
  );
}
