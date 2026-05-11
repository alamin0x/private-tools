import { useState } from "react"
import ToolHeader from "@/components/tool-header"

const PASSAGE = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly."

export default function TypingSpeedTest() {
  const [input, setInput] = useState("")
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)

  function handleChange(val: string) {
    if (!started) { setStarted(true); setStartTime(Date.now()) }
    setInput(val)
    if (val.length >= PASSAGE.length) {
      const elapsed = (Date.now() - startTime) / 60000
      const words = PASSAGE.split(" ").length
      setWpm(Math.round(words / elapsed))
      let correct = 0
      for (let i = 0; i < val.length; i++) if (val[i] === PASSAGE[i]) correct++
      setAccuracy(Math.round((correct / PASSAGE.length) * 100))
      setFinished(true)
    }
  }

  function reset() { setInput(""); setStarted(false); setFinished(false); setWpm(0); setAccuracy(100) }

  const progress = Math.min((input.length / PASSAGE.length) * 100, 100)
  const currentErrors = input.split("").filter((c, i) => c !== PASSAGE[i]).length

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Typing Speed Test" description="Test your typing speed in WPM and accuracy." />

      {!finished ? (
        <div className="space-y-4">
          <div className="rounded-xl p-5 font-mono text-sm leading-7" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            {PASSAGE.split("").map((char, i) => {
              let color = "var(--color-muted-foreground)"
              if (i < input.length) color = input[i] === char ? "var(--color-success)" : "var(--color-destructive)"
              else if (i === input.length) color = "var(--color-primary-light)"
              return <span key={i} style={{ color, textDecoration: i < input.length && input[i] !== char ? "underline" : "none" }}>{char}</span>
            })}
          </div>

          <textarea className="input-base h-24 font-mono text-sm resize-none" value={input}
            onChange={e => handleChange(e.target.value)} placeholder="Start typing to begin the test…"
            disabled={finished} autoFocus />

          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#7c5af3,#06b6d4)" }} />
            </div>
            <span className="text-xs font-mono" style={{ color: currentErrors > 0 ? "var(--color-destructive)" : "var(--color-muted-foreground)" }}>{currentErrors} errors</span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-8 text-center space-y-6" style={{ background: "linear-gradient(135deg,rgba(124,90,243,0.1),rgba(6,182,212,0.05))", border: "1px solid var(--color-border)" }}>
          <p className="text-2xl font-extrabold" style={{ color: "var(--color-foreground)" }}>🎉 Test Complete!</p>
          <div className="grid grid-cols-2 gap-4">
            {[["WPM", wpm, wpm >= 60 ? "#10b981" : wpm >= 40 ? "#f59e0b" : "#f43f5e"], ["Accuracy", `${accuracy}%`, accuracy >= 95 ? "#10b981" : accuracy >= 80 ? "#f59e0b" : "#f43f5e"]].map(([label, val, color]) => (
              <div key={label as string} className="rounded-xl p-4" style={{ background: "var(--color-surface-2)" }}>
                <p className="text-4xl font-extrabold" style={{ color: color as string }}>{val as string | number}</p>
                <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</p>
              </div>
            ))}
          </div>
          <button onClick={reset} className="btn-primary px-8 py-2">Try Again</button>
        </div>
      )}
    </div>
  )
}
