import { useState, useRef, useEffect } from "react"
import ToolHeader from "@/components/tool-header"

export default function TextToSpeech() {
  const [text, setText] = useState("Hello! This is a text to speech demo.")
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const synthRef = useRef(window.speechSynthesis)

  useEffect(() => {
    const synth = synthRef.current
    function loadVoices() {
      const v = synth.getVoices()
      if (v.length > 0) {
        setVoices(v)
        setVoice(prev => prev || v[0])
      }
    }

    loadVoices()
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices
    }

    return () => {
      synth.onvoiceschanged = null
      synth.cancel()
    }
  }, [])

  function speak() {
    if (!text.trim()) return
    synthRef.current.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    if (voice) utt.voice = voice
    utt.rate = rate; utt.pitch = pitch; utt.volume = volume
    utt.onstart = () => setSpeaking(true)
    utt.onend = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    synthRef.current.speak(utt)
  }

  function stop() { synthRef.current.cancel(); setSpeaking(false) }

  const supported = "speechSynthesis" in window

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Text to Speech" description="Convert text to spoken audio using your browser's built-in speech engine." />

      {!supported ? (
        <div className="text-center py-8" style={{ color: "var(--color-destructive)" }}>Your browser doesn't support Text to Speech.</div>
      ) : (
        <>
          <textarea className="input-base h-36" placeholder="Enter text to read aloud…" value={text} onChange={e => setText(e.target.value)} />

          {voices.length > 0 && (
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Voice</label>
              <select className="input-base" value={voice?.name || ""} onChange={e => setVoice(voices.find(v => v.name === e.target.value) || null)}>
                {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {([["Speed", rate, setRate, 0.5, 2, 0.1], ["Pitch", pitch, setPitch, 0, 2, 0.1], ["Volume", volume, setVolume, 0, 1, 0.05]] as const).map(([label, val, setter, min, max, step]) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{label}</label>
                  <span className="text-xs font-mono" style={{ color: "var(--color-primary-light)" }}>{(val as number).toFixed(1)}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={val as number}
                  onChange={e => (setter as (v: number) => void)(+e.target.value)} className="w-full" style={{ accentColor: "#7c5af3" }} />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={speak} disabled={speaking || !text.trim()} className="btn-primary flex-1 py-3">
              {speaking ? "🔊 Speaking…" : "▶ Speak"}
            </button>
            {speaking && (
              <button onClick={stop} className="px-5 py-3 rounded-lg font-semibold" style={{ background: "var(--color-destructive)", color: "#fff" }}>⏹ Stop</button>
            )}
          </div>

          <p className="text-xs text-center" style={{ color: "var(--color-muted-foreground)" }}>Uses your browser's built-in speech engine — no data sent to any server.</p>
        </>
      )}
    </div>
  )
}
