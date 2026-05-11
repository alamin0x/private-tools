import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function BinaryTranslator() {
  const [mode, setMode] = useState<"textToBinary" | "binaryToText">("textToBinary")
  const [input, setInput] = useState("")

  const result = (() => {
    try {
      if (mode === "textToBinary") {
        return input.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ")
      } else {
        return input.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join("")
      }
    } catch {
      return "Invalid input"
    }
  })()

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Binary Translator" description="Convert text to binary (0s and 1s) and back to readable text." />

      <div className="flex gap-2">
        {([["textToBinary", "Text → Binary"], ["binaryToText", "Binary → Text"]] as const).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setInput("") }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={mode === m ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" } : { background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>
            {mode === "textToBinary" ? "Text Input" : "Binary Input (space-separated bytes)"}
          </label>
          <textarea className="input-base h-28 font-mono text-sm"
            placeholder={mode === "textToBinary" ? "Hello World" : "01001000 01100101 01101100 01101100 01101111"}
            value={input} onChange={e => setInput(e.target.value)} />
        </div>

        {input && (
          <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Result</span>
              <CopyButton text={result} />
            </div>
            <p className="font-mono text-sm break-all leading-7" style={{ color: "var(--color-primary-light)" }}>{result}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl p-4 space-y-2 text-xs" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <p className="font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Quick Reference</p>
        <div className="grid grid-cols-4 gap-2 font-mono">
          {[["A","01000001"],["B","01000010"],["0","00110000"],["1","00110001"]].map(([c, b]) => (
            <div key={c} className="text-center">
              <p style={{ color: "var(--color-foreground)" }}>{c}</p>
              <p style={{ color: "var(--color-muted-foreground)" }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
