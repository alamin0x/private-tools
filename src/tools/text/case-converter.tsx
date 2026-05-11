"use client";

import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toConstantCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const conversions = [
    { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
    { label: "lowercase", fn: (s: string) => s.toLowerCase() },
    { label: "Title Case", fn: toTitleCase },
    { label: "camelCase", fn: toCamelCase },
    { label: "snake_case", fn: toSnakeCase },
    { label: "kebab-case", fn: toKebabCase },
    { label: "CONSTANT_CASE", fn: toConstantCase },
  ];

  const handleConvert = (fn: (s: string) => string) => {
    setOutput(fn(input));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Case Converter"
        description="Convert text between different case formats."
      />
      <textarea
        className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        placeholder="Enter text to convert..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {conversions.map((conv) => (
          <button
            key={conv.label}
            onClick={() => handleConvert(conv.fn)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {conv.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="Converted text will appear here..."
          value={output}
          readOnly
        />
        {output && <CopyButton text={output} className="absolute top-2 right-2" />}
      </div>
    </div>
  );
}
