import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function AsciiArtGenerator() {
  const [text, setText] = useState("HELLO")
  const [style, setStyle] = useState("block")

  function generateAscii(text: string, style: string): string {
    if (style === "block") {
      return text.toUpperCase().split("").map(c => {
        if (c === " ") return "   "
        const map: Record<string, string[]> = {
          A:["  █  "," █ █ ","█████","█   █","█   █"],
          B:["████ ","█   █","████ ","█   █","████ "],
          C:[" ████","█    ","█    ","█    "," ████"],
          D:["████ ","█   █","█   █","█   █","████ "],
          E:["█████","█    ","███  ","█    ","█████"],
          F:["█████","█    ","███  ","█    ","█    "],
          G:[" ████","█    ","█  ██","█   █"," ████"],
          H:["█   █","█   █","█████","█   █","█   █"],
          I:["█████","  █  ","  █  ","  █  ","█████"],
          J:["█████","    █","    █","█   █"," ███ "],
          K:["█   █","█  █ ","███  ","█  █ ","█   █"],
          L:["█    ","█    ","█    ","█    ","█████"],
          M:["█   █","██ ██","█ █ █","█   █","█   █"],
          N:["█   █","██  █","█ █ █","█  ██","█   █"],
          O:[" ███ ","█   █","█   █","█   █"," ███ "],
          P:["████ ","█   █","████ ","█    ","█    "],
          Q:[" ███ ","█   █","█ █ █","█  ██"," ████"],
          R:["████ ","█   █","████ ","█  █ ","█   █"],
          S:[" ████","█    "," ███ ","    █","████ "],
          T:["█████","  █  ","  █  ","  █  ","  █  "],
          U:["█   █","█   █","█   █","█   █"," ███ "],
          V:["█   █","█   █","█   █"," █ █ ","  █  "],
          W:["█   █","█   █","█ █ █","██ ██","█   █"],
          X:["█   █"," █ █ ","  █  "," █ █ ","█   █"],
          Y:["█   █"," █ █ ","  █  ","  █  ","  █  "],
          Z:["█████","   █ ","  █  "," █   ","█████"],
          "0":[" ███ ","█  ██","█ █ █","██  █"," ███ "],
          "1":["  █  "," ██  ","  █  ","  █  ","█████"],
          "!":[" █  "," █  "," █  ","    "," █  "],
          "?":["████ ","    █","  ██ ","     ","  █  "],
        }
        const rows = map[c] || ["     ","  █  ","     ","     ","     "]
        return rows
      }).reduce((acc: string[], charRows) => {
        if (!Array.isArray(charRows)) return acc
        for (let row = 0; row < 5; row++) {
          if (!acc[row]) acc[row] = ""
          acc[row] += (Array.isArray(charRows) ? charRows[row] : "") + " "
        }
        return acc
      }, []).join("\n")
    }
    if (style === "simple") return text.split("").map(c => `[${c.toUpperCase()}]`).join("")
    if (style === "dots") return text.toUpperCase().split("").join(" · ")
    if (style === "stars") return `✦ ${text.toUpperCase()} ✦`
    return text
  }

  const output = generateAscii(text, style)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="ASCII Art Generator" description="Convert text into ASCII art with different styles." />

      <div className="space-y-3">
        <input className="input-base text-lg font-bold" maxLength={12} placeholder="Type text…" value={text} onChange={e => setText(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {[["block", "Block Letters"], ["simple", "Simple Brackets"], ["dots", "Dot Separator"], ["stars", "Star Banner"]].map(([s, label]) => (
            <button key={s} onClick={() => setStyle(s)}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={style === s ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" } : { background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {output && (
        <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Output</span>
            <CopyButton text={output} />
          </div>
          <pre className="font-mono text-sm overflow-x-auto leading-tight" style={{ color: "var(--color-primary-light)" }}>{output}</pre>
        </div>
      )}
    </div>
  )
}
