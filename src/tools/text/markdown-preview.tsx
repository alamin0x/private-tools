"use client";

import { useState } from "react";
import ToolHeader from "@/components/tool-header";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseMarkdown(markdown: string): string {
  let html = escapeHtml(markdown);

  // Code blocks (must be before other transforms)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-2"><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">$1</code>');

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-sm font-bold mt-4 mb-2">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-base font-bold mt-4 mb-2">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold mt-4 mb-2">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold mt-4 mb-2">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-gray-300 dark:border-gray-600 my-4" />');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Blockquotes
  html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-2">$1</blockquote>');

  // Unordered lists
  html = html.replace(/^-\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Wrap consecutive list items
  html = html.replace(/((?:<li class="ml-4 list-disc">.*<\/li>\n?)+)/g, '<ul class="my-2">$1</ul>');
  html = html.replace(/((?:<li class="ml-4 list-decimal">.*<\/li>\n?)+)/g, '<ol class="my-2">$1</ol>');

  // Paragraphs - wrap remaining lines
  html = html.replace(/^(?!<[a-z/])(.*\S.*)$/gm, '<p class="my-1">$1</p>');

  return html;
}

const DEFAULT_MARKDOWN = `# Markdown Preview

This is a **bold** and *italic* text example.

## Features

- Headings
- **Bold** and *italic*
- Links and lists
- Code blocks

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

> This is a blockquote

Visit [Example](https://example.com) for more info.

---

1. First item
2. Second item
3. Third item
`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Markdown Preview"
        description="Write markdown on the left and see the rendered preview on the right."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[500px]">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Markdown Input
          </label>
          <textarea
            className="w-full h-[500px] p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div
            className="w-full h-[500px] p-4 border border-gray-300 rounded-lg overflow-y-auto prose dark:prose-invert max-w-none dark:bg-gray-800 dark:border-gray-600"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
          />
        </div>
      </div>
    </div>
  );
}
