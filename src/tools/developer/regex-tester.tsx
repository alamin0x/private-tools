import { useState, useMemo } from "react";
import ToolHeader from "@/components/tool-header";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState("");

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join("");
  }, [flags]);

  const results = useMemo(() => {
    if (!pattern || !testString) return null;
    try {
      const regex = new RegExp(pattern, flagString);
      const matches: { match: string; index: number }[] = [];
      let m: RegExpExecArray | null;

      if (flagString.includes("g")) {
        while ((m = regex.exec(testString)) !== null) {
          matches.push({ match: m[0], index: m.index });
          if (m[0].length === 0) regex.lastIndex++;
        }
      } else {
        m = regex.exec(testString);
        if (m) {
          matches.push({ match: m[0], index: m.index });
        }
      }

      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, testString, flagString]);

  const highlightedText = useMemo(() => {
    if (!results || results.error || results.matches.length === 0) {
      return testString;
    }
    try {
      const regex = new RegExp(pattern, flagString.includes("g") ? flagString : flagString + "g");
      const parts: { text: string; highlighted: boolean }[] = [];
      let lastIndex = 0;
      let m: RegExpExecArray | null;

      while ((m = regex.exec(testString)) !== null) {
        if (m.index > lastIndex) {
          parts.push({ text: testString.slice(lastIndex, m.index), highlighted: false });
        }
        parts.push({ text: m[0], highlighted: true });
        lastIndex = m.index + m[0].length;
        if (m[0].length === 0) {
          regex.lastIndex++;
          if (regex.lastIndex > testString.length) break;
        }
      }
      if (lastIndex < testString.length) {
        parts.push({ text: testString.slice(lastIndex), highlighted: false });
      }
      return parts;
    } catch {
      return testString;
    }
  }, [pattern, testString, flagString, results]);

  function toggleFlag(flag: keyof typeof flags) {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToolHeader
        title="Regex Tester"
        description="Test regular expressions with real-time matching and highlighting."
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pattern
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              placeholder="Enter regex pattern..."
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Flags:</span>
          {(["g", "i", "m", "s"] as const).map((flag) => (
            <label key={flag} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags[flag]}
                onChange={() => toggleFlag(flag)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{flag}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Test String
          </label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            placeholder="Enter test string..."
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
          />
        </div>

        {results?.error && (
          <p className="text-sm font-mono" style={{ color: "var(--color-destructive)" }}>{results.error}</p>
        )}

        {testString && pattern && !results?.error && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Highlighted Matches ({results?.matches.length ?? 0} found)
              </h3>
              <div className="p-3 border border-gray-300 rounded-lg font-mono text-sm whitespace-pre-wrap break-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                {Array.isArray(highlightedText)
                  ? highlightedText.map((part, i) =>
                      part.highlighted ? (
                        <span 
                          key={i} 
                          className="rounded px-0.5"
                          style={{ background: "rgba(245, 158, 11, 0.4)", color: "inherit" }}
                        >
                          {part.text}
                        </span>
                      ) : (
                        <span key={i}>{part.text}</span>
                      )
                    )
                  : highlightedText}
              </div>
            </div>

            {results && results.matches.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Match Details
                </h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">#</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Match</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Index</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.matches.map((m, i) => (
                        <tr key={i} className="border-t border-gray-200 dark:border-gray-600">
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{i + 1}</td>
                          <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100">{m.match}</td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{m.index}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
