"use client";

import { useState } from "react";
import ToolHeader from "@/components/tool-header";

export default function WordCounter() {
  const [text, setText] = useState("");

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const readingTime = Math.ceil(words / 200);

  const stats = [
    { label: "Characters", value: characters },
    { label: "Characters (no spaces)", value: charactersNoSpaces },
    { label: "Words", value: words },
    { label: "Sentences", value: sentences },
    { label: "Paragraphs", value: paragraphs },
    { label: "Reading Time", value: `${readingTime} min` },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Word Counter"
        description="Count characters, words, sentences, paragraphs, and estimate reading time."
      />
      <textarea
        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
