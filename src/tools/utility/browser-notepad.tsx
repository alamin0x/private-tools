import { useState, useEffect } from "react"
import ToolHeader from "@/components/tool-header"

export default function BrowserNotepad() {
  const [text, setText] = useState(() => localStorage.getItem("notepad") ?? "")
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { localStorage.setItem("notepad", text); setSaved(true) }, 800)
    return () => clearTimeout(t)
  }, [text])

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <ToolHeader title="Browser Notepad" description="A simple, persistent notepad that saves automatically to your browser." />

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          <span>{words} words</span>
          <span>·</span>
          <span>{chars} chars</span>
        </div>
        <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: saved ? "var(--color-success)" : "var(--color-muted-foreground)" }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: saved ? "var(--color-success)" : "var(--color-muted-foreground)" }} />
          {saved ? "Saved" : "Saving…"}
        </span>
      </div>

      <textarea
        className="input-base font-mono text-sm leading-relaxed resize-none"
        style={{ minHeight: "60vh" }}
        value={text}
        onChange={e => { setText(e.target.value); setSaved(false) }}
        placeholder="Start typing… your notes are saved automatically."
        autoFocus
        spellCheck
      />

      <div className="flex gap-2 justify-end">
        <button onClick={() => { navigator.clipboard.writeText(text) }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-muted-foreground)" }}>
          📋 Copy All
        </button>
        <button onClick={() => { if (confirm("Clear all notes?")) setText("") }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-destructive)" }}>
          🗑 Clear
        </button>
      </div>
    </div>
  )
}
