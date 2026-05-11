import { useState, useCallback } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";
import { Braces, Code, CheckCircle2, AlertCircle } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const processJson = useCallback((mode: "format" | "minify" | "validate") => {
    if (!input.trim()) {
      setError("Please enter some JSON data");
      setStatus("error");
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setStatus("success");
      setError("");

      if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (mode === "minify") {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput(""); // Validation only
      }
    } catch (e) {
      const msg = (e as Error).message;
      setStatus("error");
      setOutput("");
      
      // Try to find line/column in error message
      // Example: "Unexpected token 'b', ... at line 1 column 10"
      setError(msg);
    }
  }, [input]);

  const stats = input.trim() ? {
    size: (new Blob([input]).size / 1024).toFixed(2) + " KB",
    lines: input.split("\n").length
  } : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ToolHeader
        title="JSON Formatter & Validator"
        description="Clean, minify, and verify your JSON data with instant error feedback."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-muted-foreground)" }}>Input</label>
            {stats && <span className="text-[10px] font-medium" style={{ color: "var(--color-muted-foreground)" }}>{stats.lines} lines · {stats.size}</span>}
          </div>
          <textarea
            className="input-base h-[450px] font-mono text-sm leading-relaxed resize-none"
            placeholder='{ "key": "value" }'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => processJson("format")} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
              <Braces className="h-4 w-4" /> Format
            </button>
            <button onClick={() => processJson("minify")} className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
              style={{ background: "var(--color-surface-3)", color: "var(--color-foreground)", border: "1px solid var(--color-border)" }}>
              <Code className="h-4 w-4" /> Minify
            </button>
            <button onClick={() => processJson("validate")} className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
              style={{ background: "var(--color-surface-3)", color: "#34d399", border: "1px solid var(--color-border)" }}>
              <CheckCircle2 className="h-4 w-4" /> Validate
            </button>
            <button onClick={() => { setInput(""); setOutput(""); setError(""); setStatus("idle"); }} 
              className="ml-auto text-xs font-bold uppercase" style={{ color: "var(--color-muted-foreground)" }}>
              Clear
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-muted-foreground)" }}>Output / Feedback</label>
            {status === "success" && !output && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Valid JSON</span>}
          </div>
          
          <div className="relative h-[450px] rounded-xl overflow-hidden group" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            {status === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-2">
                <Braces className="h-10 w-10 opacity-10" />
                <p className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>Processed JSON will appear here</p>
              </div>
            )}

            {status === "error" && (
              <div className="absolute inset-0 p-6 overflow-y-auto">
                <div className="flex items-start gap-3 p-4 rounded-xl border-l-4" style={{ background: "rgba(244,63,94,0.1)", borderColor: "#fb7185" }}>
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#fb7185" }} />
                  <div className="space-y-1">
                    <p className="font-bold text-sm" style={{ color: "#fb7185" }}>Invalid JSON</p>
                    <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--color-foreground)" }}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {output && (
              <>
                <textarea
                  className="w-full h-full p-4 bg-transparent font-mono text-sm leading-relaxed resize-none focus:outline-none"
                  value={output}
                  readOnly
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={output} />
                </div>
              </>
            )}
          </div>
          
          <p className="text-[10px] text-center italic" style={{ color: "var(--color-muted-foreground)" }}>
            No data is sent to any server. Your JSON remains private in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
