import { useState, useRef } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

// Type definitions for Speech Recognition API
interface SpeechRecognitionResult {
  isFinal: boolean;
  [key: number]: { transcript: string };
}

interface SpeechRecognitionResults extends Array<SpeechRecognitionResult> {
  length: number;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResults;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export default function SpeechToText() {
  const [transcript, setTranscript] = useState("")
  const [listening, setListening] = useState(false)
  const [error, setError] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const supported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window

  function start() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-US"
    rec.onstart = () => { setListening(true); setError("") }
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let final = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
      }
      if (final) setTranscript(t => t + final + " ")
    }
    rec.onerror = (e: SpeechRecognitionErrorEvent) => { setError(e.error); setListening(false) }
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
  }

  function stop() { recognitionRef.current?.stop(); setListening(false) }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Speech to Text" description="Speak and convert your voice to text using your browser's speech recognition." />

      {!supported ? (
        <div className="text-center py-8 rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-destructive)" }}>
          Your browser doesn't support Speech Recognition. Try Chrome or Edge.
        </div>
      ) : (
        <>
          <div className="text-center space-y-4">
            <button onClick={listening ? stop : start}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto text-4xl transition-all"
              style={{
                background: listening ? "linear-gradient(135deg,#f43f5e,#f59e0b)" : "linear-gradient(135deg,#7c5af3,#4f8ef7)",
                boxShadow: listening ? "0 0 0 8px rgba(244,63,94,0.2), 0 0 32px rgba(244,63,94,0.4)" : "0 0 32px rgba(124,90,243,0.4)",
                animation: listening ? "pulse 1.5s ease-in-out infinite" : "none",
              }}>
              {listening ? "⏹" : "🎤"}
            </button>
            <p className="text-sm font-semibold" style={{ color: listening ? "var(--color-destructive)" : "var(--color-muted-foreground)" }}>
              {listening ? "Listening… click to stop" : "Click the mic to start speaking"}
            </p>
          </div>

          {error && <p className="text-sm text-center" style={{ color: "var(--color-destructive)" }}>Error: {error}</p>}

          <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Transcript ({transcript.trim().split(/\s+/).filter(Boolean).length} words)</span>
              <div className="flex gap-2">
                <CopyButton text={transcript} />
                <button onClick={() => setTranscript("")} className="text-xs px-2 py-1 rounded" style={{ color: "var(--color-destructive)" }}>Clear</button>
              </div>
            </div>
            <p className="text-sm leading-relaxed min-h-20" style={{ color: transcript ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}>
              {transcript || "Your spoken words will appear here…"}
            </p>
          </div>

          <p className="text-xs text-center" style={{ color: "var(--color-muted-foreground)" }}>Requires microphone permission. Works in Chrome and Edge. No audio is sent to any server.</p>
        </>
      )}
    </div>
  )
}
