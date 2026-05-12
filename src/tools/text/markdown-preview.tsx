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
    return `<pre class="bg-black/10 dark:bg-black/40 p-4 rounded-lg overflow-x-auto my-2 border border-white/5 font-mono text-xs"><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-black/10 dark:bg-black/40 px-1.5 py-0.5 rounded text-xs border border-white/5 font-mono">$1</code>');

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-xs font-black uppercase tracking-widest mt-6 mb-2" style="color:var(--color-primary-light)">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-sm font-black uppercase tracking-widest mt-6 mb-2" style="color:var(--color-primary-light)">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-base font-black mt-6 mb-2">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-black mt-6 mb-2">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-black mt-6 mb-2">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-black mt-6 mb-2">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr style="border:0; border-top:1px solid var(--color-border); margin:2rem 0" />');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--color-primary-light); text-decoration:underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Blockquotes
  html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote style="border-left:4px solid var(--color-primary); padding-left:1.5rem; font-style:italic; color:var(--color-muted-foreground); margin:1.5rem 0">$1</blockquote>');

  // Unordered lists
  html = html.replace(/^-\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Wrap consecutive list items
  html = html.replace(/((?:<li class="ml-4 list-disc">.*<\/li>\n?)+)/g, '<ul class="my-4 space-y-1">$1</ul>');
  html = html.replace(/((?:<li class="ml-4 list-decimal">.*<\/li>\n?)+)/g, '<ol class="my-4 space-y-1">$1</ol>');

  // Paragraphs - wrap remaining lines
  html = html.replace(/^(?!<[a-z/])(.*\S.*)$/gm, '<p class="my-3 leading-relaxed">$1</p>');

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

&gt; This is a blockquote

Visit [Example](https://example.com) for more info.

---

1. First item
2. Second item
3. Third item
`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ToolHeader
        title="Markdown Preview"
        description="Write markdown on the left and see the rendered preview on the right."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-black uppercase tracking-widest px-1" style={{ color: "var(--color-muted-foreground)" }}>
            Markdown Input
          </label>
          <textarea
            className="input-base flex-1 min-h-[300px] lg:h-[600px] p-4 font-mono text-sm resize-none custom-scrollbar"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-black uppercase tracking-widest px-1" style={{ color: "var(--color-muted-foreground)" }}>
            Preview
          </label>
          <div
            className="input-base flex-1 min-h-[300px] lg:h-[600px] p-6 overflow-y-auto custom-scrollbar"
            style={{ background: "var(--color-surface)", cursor: "default" }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
          />
        </div>
      </div>
    </div>
  );
}
