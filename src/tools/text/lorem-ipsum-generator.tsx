"use client";

import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam",
  "eius", "modi", "tempora", "magnam", "quaerat", "minima", "nostrum",
  "exercitationem", "ullam", "corporis", "suscipit", "laboriosam", "nihil",
  "commodi", "consequatur", "autem", "vel", "eum", "iure", "quam",
];

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";

function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(): string {
  const length = Math.floor(Math.random() * 10) + 5;
  const words = Array.from({ length }, () => getRandomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 3;
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(" ");
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    let result = "";

    switch (type) {
      case "paragraphs":
        result = Array.from({ length: count }, () => generateParagraph()).join("\n\n");
        break;
      case "sentences":
        result = Array.from({ length: count }, () => generateSentence()).join(" ");
        break;
      case "words":
        result = Array.from({ length: count }, () => getRandomWord()).join(" ");
        result = result.charAt(0).toUpperCase() + result.slice(1) + ".";
        break;
    }

    if (startWithLorem) {
      result = LOREM_START + result;
    }

    setOutput(result);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Lorem Ipsum Generator"
        description="Generate placeholder text for your designs and layouts."
      />
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Count:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "paragraphs" | "sentences" | "words")}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Start with &quot;Lorem ipsum&quot;
        </label>
        <button
          onClick={handleGenerate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Generate
        </button>
      </div>
      <div className="relative">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="Generated lorem ipsum text will appear here..."
          value={output}
          readOnly
        />
        {output && <CopyButton text={output} className="absolute top-2 right-2" />}
      </div>
    </div>
  );
}
