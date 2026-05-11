import { useRef, useState, useEffect, useCallback } from "react"
import ToolHeader from "@/components/tool-header"
import { 
  Settings2, History, Trophy, Play, Volume2, VolumeX, 
  Trash2, Timer, Palette, Copy, Check, Type
} from "lucide-react"
import confetti from "canvas-confetti"

type Theme = "modern" | "neon" | "pastel" | "emerald" | "sunset"

const THEMES: Record<Theme, string[]> = {
  modern:  ["#7c5af3", "#4f8ef7", "#06b6d4", "#2dd4bf", "#6366f1"],
  neon:    ["#ff00ff", "#00ffff", "#ffff00", "#ff0000", "#00ff00"],
  pastel:  ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"],
  emerald: ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
  sunset:  ["#f43f5e", "#fb923c", "#facc15", "#d946ef", "#ec4899"]
}

export default function WheelOfNames() {
  const [title, setTitle] = useState("Lucky Draw")
  const [input, setInput] = useState("Alice\nBob\nCarol\nDave\nEve\nFrank")
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  
  const [theme, setTheme] = useState<Theme>("modern")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [removeWinner, setRemoveWinner] = useState(false)
  const [duration, setDuration] = useState(5)
  const [volume, setVolume] = useState(0.5)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ 
    angle: 0, 
    velocity: 0, 
    lastTickAngle: 0,
    frameReq: 0
  })
  const audioContextRef = useRef<AudioContext | null>(null)

  const names = input.split("\n").map(n => n.trim()).filter(Boolean)

  // Metallic Click Sound
  const playMetallicTick = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return
    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()
    
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    
    // High-pitched "ting"
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(1200, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03)
    
    // Noise-like metallic texture
    osc2.type = "square"
    osc2.frequency.setValueAtTime(800, ctx.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.02)
    
    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
    
    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)
    
    osc1.start()
    osc2.start()
    osc1.stop(ctx.currentTime + 0.03)
    osc2.stop(ctx.currentTime + 0.03)
  }, [soundEnabled, volume])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || names.length === 0) return
    const ctx = canvas.getContext("2d")!
    const dpr = window.devicePixelRatio || 1
    const size = canvas.width / dpr
    const cx = size / 2, cy = size / 2, r = size / 2 - 10
    
    ctx.clearRect(0, 0, size, size)
    const colors = THEMES[theme]
    const sliceAngle = (2 * Math.PI) / names.length
    const currentAngle = stateRef.current.angle

    names.forEach((name, i) => {
      const start = currentAngle + i * sliceAngle
      const end = start + sliceAngle
      
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      ctx.strokeStyle = "rgba(0,0,0,0.2)"
      ctx.lineWidth = 1
      ctx.stroke()
      
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + sliceAngle / 2)
      ctx.textAlign = "right"
      ctx.fillStyle = "white"
      const fontSize = Math.max(10, Math.min(20, 400 / names.length))
      ctx.font = `bold ${fontSize}px Inter`
      ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 4
      ctx.fillText(name.slice(0, 15), r - 20, fontSize / 3)
      ctx.restore()
    })

    // Hub
    ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI * 2); ctx.fillStyle = "#13131f"; ctx.fill()
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 3; ctx.stroke()
    
    // Pointer
    ctx.save(); ctx.translate(cx, 10); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-12, -12); ctx.lineTo(12, -12); ctx.closePath()
    ctx.fillStyle = "#f43f5e"; ctx.shadowColor = "rgba(244,63,94,0.5)"; ctx.shadowBlur = 10; ctx.fill(); ctx.restore()
  }, [names, theme])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const size = Math.min(window.innerHeight * 0.5, 450)
    canvas.width = size * dpr; canvas.height = size * dpr
    canvas.getContext("2d")!.scale(dpr, dpr)
    draw()
  }, [draw])

  const spin = () => {
    if (spinning || names.length < 2) return
    if (!audioContextRef.current) audioContextRef.current = new AudioContext()
    
    setSpinning(true); setWinner(null)
    const state = stateRef.current
    state.velocity = 0.4 + Math.random() * 0.2
    const friction = Math.pow(0.001 / state.velocity, 1 / (duration * 60))
    
    const animate = () => {
      state.angle += state.velocity
      state.velocity *= friction
      
      const slice = (2 * Math.PI) / names.length
      if (Math.floor(state.angle / slice) !== Math.floor(state.lastTickAngle / slice)) {
        playMetallicTick()
        state.lastTickAngle = state.angle
      }

      draw()
      if (state.velocity > 0.001) state.frameReq = requestAnimationFrame(animate)
      else finish()
    }
    state.frameReq = requestAnimationFrame(animate)
  }

  const finish = () => {
    setSpinning(false)
    const slice = (2 * Math.PI) / names.length
    const angle = (Math.PI * 1.5 - stateRef.current.angle) % (Math.PI * 2)
    const idx = Math.floor((angle < 0 ? angle + Math.PI * 2 : angle) / slice) % names.length
    const win = names[idx]
    setWinner(win); setHistory(h => [win, ...h].slice(0, 100))
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    if (removeWinner) setTimeout(() => setInput(i => i.split("\n").filter(n => n.trim() !== win).join("\n")), 1500)
  }

  const copyHistory = () => {
    navigator.clipboard.writeText(history.join("\n"))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-[calc(100vh-140px)] overflow-hidden flex flex-col px-4">
      <ToolHeader title="Pro Wheel Picker" description="" />
      
      <div className="flex-1 grid lg:grid-cols-12 gap-6 overflow-hidden min-h-0 py-2">
        {/* Left: Input & Config */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div className="glass rounded-2xl p-4 flex flex-col min-h-0 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-3.5 h-3.5 text-primary-light" />
              <input 
                className="bg-transparent text-sm font-bold border-none outline-none focus:ring-0 p-0 w-full" 
                value={title} onChange={e => setTitle(e.target.value)} placeholder="Wheel Title..." 
              />
            </div>
            <textarea 
              className="input-base flex-1 text-xs font-medium resize-none mb-3" 
              placeholder="Names..." value={input} onChange={e => setInput(e.target.value)} 
            />
            <button onClick={() => setInput("")} className="text-[10px] font-bold text-red-400 uppercase self-end flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>

          <div className="glass rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1"><Settings2 className="w-3.5 h-3.5 text-primary-light" /><span className="text-xs font-bold uppercase">Settings</span></div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                <span>Duration</span><span>{duration}s</span>
              </div>
              <input type="range" min="1" max="20" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
              <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase">
                <span>Theme</span>
                <div className="flex gap-1">
                  {(Object.keys(THEMES) as Theme[]).map(t => (
                    <button key={t} onClick={() => setTheme(t)} className={`w-3 h-3 rounded-full border border-white/20 ${theme === t ? "scale-125 border-white" : "opacity-40"}`} style={{ background: THEMES[t][0] }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Eliminate</span>
                <button onClick={() => setRemoveWinner(!removeWinner)} className={`w-7 h-3.5 rounded-full relative transition-colors ${removeWinner ? "bg-primary" : "bg-white/10"}`}>
                  <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all ${removeWinner ? "left-4" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Wheel */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="text-center mb-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-foreground">{title}</h2>
            <p className="text-[10px] font-bold text-primary-light uppercase tracking-tighter">{names.length} items ready</p>
          </div>
          <div className="relative group cursor-pointer mb-6" onClick={spin}>
            <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity ${spinning ? "opacity-30" : "opacity-10"}`} style={{ background: THEMES[theme][0] }} />
            <canvas ref={canvasRef} className={`relative z-10 transition-transform ${spinning ? "" : "hover:scale-[1.02]"}`} />
          </div>
          <button onClick={spin} disabled={spinning || names.length < 2} className="btn-primary px-10 py-3 text-sm flex items-center gap-2 rounded-xl group disabled:opacity-50">
            {spinning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            {spinning ? "Spinning..." : "Spin Now"}
          </button>

          {winner && !spinning && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
              <div className="glass p-8 rounded-3xl border border-primary-light text-center shadow-2xl space-y-4">
                <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
                <div><p className="text-[10px] font-black uppercase text-muted-foreground">Winner</p><h2 className="text-4xl font-black gradient-text">{winner}</h2></div>
                <button onClick={() => setWinner(null)} className="w-full py-3 rounded-xl bg-primary text-xs font-bold uppercase text-white hover:bg-primary-light transition-colors">Dismiss</button>
              </div>
            </div>
          )}
        </div>

        {/* Right: History */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden">
          <div className="glass rounded-2xl p-4 flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><History className="w-3.5 h-3.5 text-primary-light" /><span className="text-xs font-bold uppercase">History</span></div>
              {history.length > 0 && (
                <button onClick={copyHistory} className="text-[10px] font-bold text-muted-foreground hover:text-primary-light transition-colors flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? "Copied" : "Copy All"}
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-[11px]">
                  <span className="text-muted-foreground font-mono">#{history.length - i}</span>
                  <span className="font-bold truncate max-w-[120px]">{h}</span>
                </div>
              ))}
              {history.length === 0 && <p className="text-center text-muted-foreground text-[10px] mt-10">No winners yet</p>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type="range"] { -webkit-appearance: none; background: rgba(255,255,255,0.05); height: 4px; border-radius: 10px; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 14px; width: 14px; border-radius: 50%; background: #7c5af3; cursor: pointer; border: 2px solid #13131f; box-shadow: 0 0 10px rgba(124,90,243,0.3); }
      `}</style>
    </div>
  )
}

function RotateCcw(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
