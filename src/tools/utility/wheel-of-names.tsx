import React, { useRef, useState, useEffect, useCallback } from "react"
import ToolHeader from "@/components/tool-header"
import { 
  Settings2, History, Trophy, Play, 
  Trash2, Copy, Check, Type, Sparkles, X
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
  const soundEnabled = true
  const [removeWinner, setRemoveWinner] = useState(false)
  const [duration, setDuration] = useState(5)
  const volume = 0.5

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ 
    angle: 0, 
    velocity: 0, 
    lastTickAngle: 0,
    frameReq: 0
  })
  const audioContextRef = useRef<AudioContext | null>(null)

  const names = input.split("\n").map(n => n.trim()).filter(Boolean)

  const playMetallicTick = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return
    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()
    const osc1 = ctx.createOscillator(); const osc2 = ctx.createOscillator(); const gain = ctx.createGain()
    osc1.type = "sine"; osc1.frequency.setValueAtTime(1200, ctx.currentTime); osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03)
    osc2.type = "square"; osc2.frequency.setValueAtTime(800, ctx.currentTime); osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.02)
    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
    osc1.connect(gain); osc2.connect(gain); gain.connect(ctx.destination)
    osc1.start(); osc2.start(); osc1.stop(ctx.currentTime + 0.03); osc2.stop(ctx.currentTime + 0.03)
  }, [soundEnabled, volume])

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d")!; const dpr = window.devicePixelRatio || 1
    const size = canvas.width / dpr; const cx = size / 2, cy = size / 2, r = size / 2 - 15
    ctx.clearRect(0, 0, size, size)

    // Draw Wheel Body
    if (names.length === 0) {
      // "Ghost" Wheel when empty
      for (let i = 0; i < 8; i++) {
        const start = (i * Math.PI * 2) / 8, end = ((i + 1) * Math.PI * 2) / 8
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath()
        ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)"
        ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.stroke()
      }
      ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.font = "bold 12px Inter"
      ctx.fillText("Enter names to begin", cx, cy + 5)
    } else {
      const colors = THEMES[theme], sliceAngle = (2 * Math.PI) / names.length, currentAngle = stateRef.current.angle
      names.forEach((name, i) => {
        const start = currentAngle + i * sliceAngle, end = start + sliceAngle
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath()
        ctx.fillStyle = colors[i % colors.length]; ctx.fill()
        ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 1; ctx.stroke()
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + sliceAngle / 2); ctx.textAlign = "right"; ctx.fillStyle = "white"
        const txt = name.length > 15 ? name.slice(0, 12) + "..." : name
        const fSize = Math.max(10, Math.min(18, 380 / names.length))
        ctx.font = `900 ${fSize}px Inter`; ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 4
        ctx.fillText(txt, r - 25, fSize / 3); ctx.restore()
      })
    }

    // Static Hub & Pointer
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fillStyle = "#13131f"; ctx.fill()
    ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 4; ctx.stroke()
    ctx.save(); ctx.translate(cx, 10); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-15, -15); ctx.lineTo(15, -15); ctx.closePath()
    ctx.fillStyle = "#f43f5e"; ctx.shadowColor = "rgba(244,63,94,0.6)"; ctx.shadowBlur = 12; ctx.fill(); ctx.restore()
  }, [names, theme])

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current; if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      const size = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.5, 500)
      canvas.width = size * dpr; canvas.height = size * dpr; canvas.getContext("2d")!.scale(dpr, dpr); draw()
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [draw])

  const finish = useCallback((win: string) => {
    setSpinning(false); setWinner(win); setHistory(h => [win, ...h].slice(0, 100))
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: THEMES[theme] })
    if (removeWinner) setTimeout(() => setInput(i => i.split("\n").filter(n => n.trim() !== win).join("\n")), 2000)
  }, [theme, removeWinner])

  const spin = useCallback(() => {
    if (spinning || names.length < 2) return
    if (!audioContextRef.current) audioContextRef.current = new AudioContext()
    setSpinning(true); setWinner(null)
    const state = stateRef.current; state.velocity = 0.5 + Math.random() * 0.2
    const friction = Math.pow(0.0005 / state.velocity, 1 / (duration * 60))
    const animate = () => {
      state.angle += state.velocity; state.velocity *= friction
      const slice = (2 * Math.PI) / names.length
      if (Math.floor(state.angle / slice) !== Math.floor(state.lastTickAngle / slice)) { playMetallicTick(); state.lastTickAngle = state.angle }
      draw()
      if (state.velocity > 0.0008) state.frameReq = requestAnimationFrame(animate)
      else {
        const finalSlice = (2 * Math.PI) / names.length; const angle = (Math.PI * 1.5 - stateRef.current.angle) % (Math.PI * 2)
        const idx = Math.floor((angle < 0 ? angle + Math.PI * 2 : angle) / finalSlice) % names.length; const win = names[idx]
        finish(win)
      }
    }
    state.frameReq = requestAnimationFrame(animate)
  }, [spinning, names, duration, playMetallicTick, draw, finish])

  const copyHistory = () => { navigator.clipboard.writeText(history.join("\n")); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="flex flex-col px-4 lg:px-6 select-none">
      <ToolHeader title="Pro Wheel Picker" description="" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
        {/* Left Col - Input & Controls */}
        <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-6">
          <div className="glass rounded-[2rem] p-6 flex flex-col min-h-[300px] lg:h-[400px] relative shadow-2xl">
            <div className="flex items-center gap-2.5 mb-4 px-1">
              <Type className="w-4 h-4 text-primary-light" />
              <input className="bg-transparent text-sm font-black uppercase tracking-wider border-none outline-none focus:ring-0 p-0 w-full" value={title} onChange={e => setTitle(e.target.value)} placeholder="WHEEL TITLE..." />
            </div>
            <textarea className="input-base flex-1 text-xs font-bold resize-none mb-4 custom-scrollbar tracking-wide leading-relaxed bg-black/20" placeholder="Enter names..." value={input} onChange={e => setInput(e.target.value)} />
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-muted-foreground/50 uppercase">{names.length} Entries</span>
              <button onClick={() => setInput("")} className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="glass rounded-[2rem] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-1 px-1"><Settings2 className="w-4 h-4 text-primary-light" /><span className="text-xs font-black uppercase tracking-widest">Controls</span></div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-tighter"><span>Spin Time</span><span className="text-primary-light">{duration}s</span></div>
                <input type="range" min="1" max="20" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary" />
              </div>
              <div className="flex items-center justify-between"><span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Theme</span>
                <div className="flex gap-1.5">{(Object.keys(THEMES) as Theme[]).map(t => (
                  <button key={t} onClick={() => setTheme(t)} className={`w-4 h-4 rounded-full border-2 transition-all ${theme === t ? "scale-125 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "border-transparent opacity-40 hover:opacity-100"}`} style={{ background: THEMES[t][0] }} />
                ))}</div>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5"><span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Eliminate</span>
                <button onClick={() => setRemoveWinner(!removeWinner)} className={`w-9 h-4.5 rounded-full relative transition-colors ${removeWinner ? "bg-primary" : "bg-white/10"}`}>
                  <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all shadow-sm ${removeWinner ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Col - Wheel */}
        <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center justify-center relative py-8 lg:py-0">
          <div className="text-center mb-8"><h2 className="text-3xl font-black uppercase tracking-[0.2em] text-foreground drop-shadow-2xl">{title}</h2><div className="h-1 w-12 bg-primary mx-auto mt-2 rounded-full opacity-50" /></div>
          <div className="relative group cursor-pointer mb-10" onClick={spin}>
            <div className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-1000 ${spinning ? "opacity-40 scale-110" : "opacity-10 scale-100"}`} style={{ background: THEMES[theme][0] }} />
            <canvas ref={canvasRef} className={`relative z-10 transition-transform duration-500 ${spinning ? "" : "hover:scale-[1.03] active:scale-95"}`} />
            {!spinning && !winner && (<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"><div className="glass px-6 py-2.5 rounded-full border border-white/10 shadow-2xl animate-bounce"><p className="text-[10px] font-black uppercase tracking-widest text-white">Click to Spin</p></div></div>)}
          </div>
          <button onClick={spin} disabled={spinning || names.length < 2} className="btn-primary px-16 py-4.5 text-base font-black uppercase tracking-widest flex items-center gap-3 rounded-[1.5rem] group disabled:opacity-30 shadow-[0_20px_40px_rgba(124,90,243,0.3)]">
            {spinning ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white" />} {spinning ? "Spinning..." : "Spin Now"}
          </button>
        </div>

        {/* Right Col - History */}
        <div className="order-3 lg:order-3 lg:col-span-3 flex flex-col">
          <div className="glass rounded-[2rem] p-6 flex flex-col h-[400px] shadow-2xl">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2.5"><History className="w-4 h-4 text-primary-light" /><span className="text-xs font-black uppercase tracking-widest">Winners</span></div>
              {history.length > 0 && (<div className="flex gap-2">
                <button onClick={copyHistory} className="p-2 hover:bg-white/5 rounded-xl transition-all text-muted-foreground hover:text-primary-light" title="Copy all winners">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                <button onClick={() => setHistory([])} className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-muted-foreground hover:text-red-400" title="Clear history"><Trash2 className="w-4 h-4" /></button>
              </div>)}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {history.map((h, i) => (
                <div key={i} className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.03] hover:border-primary/30 transition-all">
                  <span className="text-[10px] font-black text-muted-foreground/30">#{history.length - i}</span>
                  <span className="text-xs font-black truncate max-w-[140px] tracking-wide">{h}</span>
                </div>
              ))}
              {history.length === 0 && (<div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 mt-10"><Trophy className="w-10 h-10 mb-2" /><p className="text-[10px] font-black uppercase">No winners yet</p></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Winner Overlay */}
      {winner && !spinning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="relative glass p-12 rounded-[4rem] border-2 border-primary-light shadow-[0_0_120px_rgba(124,90,243,0.5)] text-center max-w-sm w-full space-y-8 overflow-hidden group">
            <button onClick={() => setWinner(null)} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto rotate-12 group-hover:rotate-0 transition-transform duration-700 shadow-2xl border border-white/10">
              <Trophy className="w-14 h-14 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-light animate-pulse">Winner Selected</p>
              <h2 className="text-6xl font-black gradient-text tracking-tighter leading-tight drop-shadow-sm">{winner}</h2>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => { setWinner(null); spin(); }} className="flex-1 py-5 rounded-[1.5rem] bg-primary hover:bg-primary-light text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(124,90,243,0.4)]">
                <Sparkles className="w-4 h-4" /> Spin Again
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type="range"] { -webkit-appearance: none; background: rgba(255,255,255,0.05); height: 6px; border-radius: 10px; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #7c5af3; cursor: pointer; border: 3px solid #13131f; box-shadow: 0 0 15px rgba(124,90,243,0.5); }
      `}</style>
    </div>
  )
}

function RotateCcw(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
