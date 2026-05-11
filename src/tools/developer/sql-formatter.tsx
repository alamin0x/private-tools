import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
  "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "ON", "AND", "OR", "ORDER BY",
  "GROUP BY", "HAVING", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER",
  "DROP", "SET", "VALUES", "INTO", "LIMIT", "OFFSET", "UNION", "AS", "IN",
  "NOT", "NULL", "IS", "BETWEEN", "LIKE", "EXISTS", "CASE", "WHEN", "THEN",
  "ELSE", "END",
];

const MAJOR_CLAUSES = [
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
  "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "ON", "ORDER BY", "GROUP BY",
  "HAVING", "LIMIT", "OFFSET", "UNION", "SET", "VALUES", "INTO",
];

const SUB_CLAUSES = ["AND", "OR", "WHEN", "THEN", "ELSE"];

function formatSQL(sql: string): string {
  let formatted = sql.trim();

  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, " ");

  // Uppercase keywords (word boundary matching)
  KEYWORDS.forEach((kw) => {
    const regex = new RegExp(`\\b${kw.replace(" ", "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, kw);
  });

  // Add newlines before major clauses
  MAJOR_CLAUSES.forEach((clause) => {
    const regex = new RegExp(`\\s+${clause.replace(" ", "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${clause}`);
  });

  // Indent sub-clauses
  SUB_CLAUSES.forEach((clause) => {
    const regex = new RegExp(`\n${clause}\\b`, "g");
    formatted = formatted.replace(regex, `\n  ${clause}`);
  });

  // Indent ON clauses
  formatted = formatted.replace(/\nON\b/g, "\n  ON");

  return formatted.trim();
}

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function handleFormat() {
    setOutput(formatSQL(input));
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="SQL Formatter"
        description="Format SQL queries with proper indentation and keyword casing."
      />

      <div className="space-y-4">
        <textarea
          className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          placeholder="Paste your SQL query here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Format
        </button>

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
