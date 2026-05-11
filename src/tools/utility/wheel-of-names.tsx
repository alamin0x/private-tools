import { useRef, useState, useEffect, useCallback } from "react"
import ToolHeader from "@/components/tool-header"
import { 
  Settings2, History, Trophy, Play, Volume2, VolumeX, 
  Sparkles, Trash2, Timer, Palette, Share2, Info
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
  // --- State ---
  const [input, setInput] = useState("Alice\nBob\nCarol\nDave\nEve\nFrank")
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  
  // --- Advanced Customization State ---
  const [theme, setTheme] = useState<Theme>("modern")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [removeWinner, setRemoveWinner] = useState(false)
  const [duration, setDuration] = useState(8) // 1-30 seconds
  const [volume, setVolume] = useState(0.5)
  const [showConfig, setShowConfig] = useState(true)

  // --- Refs for Animation Logic ---
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ 
    angle: 0, 
    velocity: 0, 
    isSpinning: false,
    lastTickAngle: 0
  })
  const audioContextRef = useRef<AudioContext | null>(null)

  const names = input.split("\n").map(n => n.trim()).filter(Boolean)

  // --- Professional Sound Synth ---
  const playTick = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = "sine"
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04)
    
    gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  }, [soundEnabled, volume])

  // --- High Performance Canvas Drawer ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || names.length === 0) return
    const ctx = canvas.getContext("2d", { alpha: true })!
    const dpr = window.devicePixelRatio || 1
    const size = canvas.width / dpr
    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 15

    ctx.clearRect(0, 0, size, size)
    
    const colors = THEMES[theme]
    const sliceAngle = (2 * Math.PI) / names.length
    const currentAngle = stateRef.current.angle

    // 1. Draw Outer Ring Shadow
    ctx.beginPath()
    ctx.arc(cx, cy, r + 5, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(0,0,0,0.3)"
    ctx.fill()

    // 2. Draw Slices
    names.forEach((name, i) => {
      const start = currentAngle + i * sliceAngle
      const end = start + sliceAngle
      
      // Slice Path
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      
      // Vibrant Gradient per Slice
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, colors[i % colors.length])
      grad.addColorStop(1, colors[i % colors.length])
      
      ctx.fillStyle = grad
      ctx.fill()
      
      // Slice Border
      ctx.strokeStyle = "rgba(255,255,255,0.15)"
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      // 3. Labels (Improved visibility)
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + sliceAngle / 2)
      
      ctx.textAlign = "right"
      ctx.fillStyle = "white"
      // Dynamic font sizing
      const fontSize = Math.max(12, Math.min(22, 450 / names.length))
      ctx.font = `900 ${fontSize}px Inter, system-ui`
      
      // Text Shadow for readability
      ctx.shadowColor = "rgba(0,0,0,0.4)"
      ctx.shadowBlur = 6
      
      const displayText = name.length > 18 ? name.slice(0, 16) + "..." : name
      ctx.fillText(displayText, r - 30, fontSize / 3)
      ctx.restore()
    })

    // 4. Center Hub (Premium look)
    const hubGrad = ctx.createLinearGradient(cx - 30, cy - 30, cx + 30, cy + 30)
    hubGrad.addColorStop(0, "#1e1e35")
    hubGrad.addColorStop(1, "#0d0d14")
    
    ctx.beginPath()
    ctx.arc(cx, cy, 35, 0, Math.PI * 2)
    ctx.fillStyle = hubGrad
    ctx.fill()
    ctx.strokeStyle = "rgba(255,255,255,0.1)"
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Hub Logo / Accent
    ctx.beginPath()
    ctx.arc(cx, cy, 10, 0, Math.PI * 2)
    ctx.fillStyle = colors[0]
    ctx.fill()

    // 5. Fixed Top Pointer
    ctx.save()
    ctx.translate(cx, 10)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-20, -20)
    ctx.lineTo(20, -20)
    ctx.closePath()
    ctx.fillStyle = "#f43f5e"
    ctx.shadowColor = "rgba(244,63,94,0.6)"
    ctx.shadowBlur = 15
    ctx.fill()
    ctx.restore()
  }, [names, theme])

  // Setup HiDPI Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const size = Math.min(window.innerWidth - 40, 600)
    canvas.width = size * dpr
    canvas.height = size * dpr
    const ctx = canvas.getContext("2d")!
    ctx.scale(dpr, dpr)
    draw()
  }, [draw])

  // --- Animation Engine ---
  const spin = () => {
    if (spinning || names.length < 2) return
    
    // Init Audio on first interaction
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    setSpinning(true)
    setWinner(null)
    stateRef.current.isSpinning = true
    
    // Physics Config
    const startVelocity = 0.4 + Math.random() * 0.2
    stateRef.current.velocity = startVelocity
    
    // Calculate friction to stop exactly at duration
    // v = v0 * f^t. We want v < 0.001 at t = duration * 60
    const totalFrames = duration * 60
    const friction = Math.pow(0.0005 / startVelocity, 1 / totalFrames)
    
    const animate = () => {
      const state = stateRef.current
      state.angle += state.velocity
      state.velocity *= friction
      
      // Precise Tick Sound Logic
      const sliceAngle = (2 * Math.PI) / names.length
      const normalizedAngle = state.angle % (Math.PI * 2)
      if (Math.abs(normalizedAngle - state.lastTickAngle) >= sliceAngle) {
        playTick()
        state.lastTickAngle = normalizedAngle
      }

      draw()

      if (state.velocity > 0.0008) {
        requestAnimationFrame(animate)
      } else {
        finishSpin()
      }
    }
    requestAnimationFrame(animate)
  }

  const finishSpin = () => {
    const state = stateRef.current
    state.isSpinning = false
    setSpinning(false)
    
    const sliceAngle = (2 * Math.PI) / names.length
    // Pointer is at -PI/2 relative to center
    const finalAngle = (Math.PI * 1.5 - state.angle) % (Math.PI * 2)
    const positiveAngle = finalAngle < 0 ? finalAngle + Math.PI * 2 : finalAngle
    const winIdx = Math.floor(positiveAngle / sliceAngle) % names.length
    
    const winName = names[winIdx]
    setWinner(winName)
    setHistory(prev => [winName, ...prev].slice(0, 50))
    
    // Pro Celebration
    const count = 200
    const defaults = { origin: { y: 0.7 }, colors: THEMES[theme] }

    function fire(particleRatio: number, opts: any) {
      confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    if (removeWinner) {
      setTimeout(() => {
        setInput(prev => prev.split("\n").filter(n => n.trim() !== winName).join("\n"))
      }, 2000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <ToolHeader 
        title="Pro Wheel Picker" 
        description="High-definition random selection with total control over physics, sound, and style."
      />

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* --- 1. Settings Sidebar (Pro Controls) --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Input */}
          <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-light flex items-center gap-2">
                <Palette className="w-4 h-4" /> Entry List
              </h3>
              <button 
                onClick={() => setInput("")}
                className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-red-400"
                title="Clear all names"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea 
              className="input-base h-56 text-sm font-medium leading-relaxed custom-scrollbar"
              placeholder="Enter names, one per line..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{names.length} Entries Loaded</span>
              <button className="text-[10px] font-bold text-primary-light uppercase hover:underline flex items-center gap-1">
                <Share2 className="w-3 h-3" /> Share List
              </button>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="glass rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowConfig(!showConfig)}>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-light flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Pro Settings
              </h3>
              <Info className="w-4 h-4 text-muted-foreground opacity-50" />
            </div>

            {showConfig && (
              <div className="space-y-6 animate-fade-in">
                {/* Theme Selector */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Visual Theme</label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(THEMES) as Theme[]).map(t => (
                      <button 
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border-2 transition-all capitalize
                          ${theme === t ? "border-primary-light bg-primary/10 text-white" : "border-white/5 bg-white/5 text-muted-foreground"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spin Duration */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5" /> Spin Duration
                    </label>
                    <span className="text-xs font-mono font-bold text-primary-light">{duration}s</span>
                  </div>
                  <input 
                    type="range" min="1" max="30" step="1"
                    value={duration} onChange={e => setDuration(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                {/* Volume */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />} Sound Volume
                    </label>
                    <span className="text-xs font-mono font-bold text-primary-light">{Math.round(volume * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`p-2 rounded-xl border transition-colors ${soundEnabled ? "border-primary/30 bg-primary/10 text-primary-light" : "border-white/5 bg-white/5 text-muted-foreground"}`}
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    <input 
                      type="range" min="0" max="1" step="0.01"
                      disabled={!soundEnabled}
                      value={volume} onChange={e => setVolume(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer disabled:opacity-30"
                    />
                  </div>
                </div>

                {/* Logic */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">Elimination Mode</p>
                    <p className="text-[10px] text-muted-foreground">Remove winner after selection</p>
                  </div>
                  <button 
                    onClick={() => setRemoveWinner(!removeWinner)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${removeWinner ? "bg-primary" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${removeWinner ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 2. The Main Stage --- */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center relative min-h-[650px]">
          
          {/* Background Glow */}
          <div 
            className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000 opacity-20
              ${spinning ? "scale-125 opacity-40 animate-pulse" : "scale-100"}`}
            style={{ background: THEMES[theme][0] }}
          />

          {/* The Wheel */}
          <div className="relative z-10 flex flex-col items-center gap-10">
            <div className="relative cursor-pointer select-none" onClick={spin}>
              <canvas 
                ref={canvasRef} 
                className={`max-w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500
                  ${spinning ? "" : "hover:scale-[1.02] active:scale-[0.98]"}`}
              />
              {!spinning && !winner && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 animate-bounce">
                    <p className="text-xs font-black uppercase tracking-tighter text-white">Click to Spin</p>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={spin}
              disabled={spinning || names.length < 2}
              className="btn-primary px-12 py-5 text-lg flex items-center gap-3 rounded-2xl group disabled:opacity-50"
            >
              {spinning ? (
                <>
                  <RotateCcw className="w-6 h-6 animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-white group-hover:scale-110 transition-transform" />
                  Spin Now
                </>
              )}
            </button>
          </div>

          {/* Winner Announcement Overlay */}
          {winner && !spinning && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-fade-in rounded-3xl">
              <div className="glass p-10 rounded-[3rem] border-2 border-primary-light shadow-[0_0_80px_rgba(124,90,243,0.3)] text-center max-w-sm w-full space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto rotate-12">
                  <Trophy className="w-10 h-10 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Winner Found</p>
                  <h2 className="text-5xl font-black gradient-text py-2">{winner}</h2>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setWinner(null)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase transition-colors"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={() => { setWinner(null); spin(); }}
                    className="flex-1 py-4 rounded-2xl bg-primary hover:bg-primary-light text-xs font-bold uppercase text-white transition-colors"
                  >
                    Spin Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* --- 3. History Section --- */}
      {history.length > 0 && (
        <div className="glass rounded-[2.5rem] p-10 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase tracking-widest text-foreground flex items-center gap-3">
              <History className="w-6 h-6 text-primary-light" /> Session History
            </h3>
            <button 
              onClick={() => setHistory([])}
              className="text-xs font-bold text-muted-foreground hover:text-red-400 transition-colors uppercase"
            >
              Clear History
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {history.map((name, i) => (
              <div key={i} className="group relative p-4 rounded-2xl bg-surface-2 border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trophy className="w-3 h-3 text-amber-400" />
                </div>
                <p className="text-xs font-bold text-muted-foreground mb-1">#{history.length - i}</p>
                <p className="text-sm font-black text-foreground truncate">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CSS Overrides for Canvas Interaction --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type="range"] { -webkit-appearance: none; background: rgba(255,255,255,0.05); height: 6px; border-radius: 10px; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #7c5af3; cursor: pointer; border: 3px solid #13131f; box-shadow: 0 0 10px rgba(124,90,243,0.5); }
      `}</style>
    </div>
  )
}

// Icons needed for the new build
function RotateCcw(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
