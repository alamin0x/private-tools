import { useRef, useState, useEffect, useCallback } from "react"
import ToolHeader from "@/components/tool-header"
import { Settings2, History, Trophy, Play, Volume2, VolumeX, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

type Theme = "classic" | "neon" | "pastel" | "sunset" | "ocean"

const THEMES: Record<Theme, string[]> = {
  classic: ["#7c5af3", "#4f8ef7", "#10b981", "#f59e0b", "#f43f5e", "#06b6d4", "#e879f9", "#5eead4"],
  neon:    ["#ff00ff", "#00ffff", "#ffff00", "#ff0000", "#00ff00", "#ff8000", "#8000ff", "#0000ff"],
  pastel:  ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff", "#e1baff", "#ffbaff", "#baffff"],
  sunset:  ["#f43f5e", "#fb923c", "#facc15", "#8b5cf6", "#d946ef", "#ec4899", "#f472b6", "#fb7185"],
  ocean:   ["#0ea5e9", "#2dd4bf", "#10b981", "#3b82f6", "#6366f1", "#06b6d4", "#14b8a6", "#0891b2"]
}

export default function WheelOfNames() {
  const [input, setInput] = useState("Alice\nBob\nCarol\nDave\nEve\nFrank")
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [theme, setTheme] = useState<Theme>("classic")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [removeWinner, setRemoveWinner] = useState(false)
  const spinDuration = 5 // seconds
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spinRef = useRef({ angle: 0, velocity: 0, animId: 0 })
  const audioContextRef = useRef<AudioContext | null>(null)

  const names = input.split("\n").map(n => n.trim()).filter(Boolean)

  const playClick = useCallback(() => {
    if (!soundEnabled) return
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  }, [soundEnabled])

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current
    if (!canvas || names.length === 0) return
    const ctx = canvas.getContext("2d")!
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = canvas.width / 2 - 20
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const colors = THEMES[theme]
    const slice = (2 * Math.PI) / names.length

    names.forEach((name, i) => {
      const start = angle + i * slice
      const end = start + slice
      
      // Draw slice
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      
      // Draw border
      ctx.strokeStyle = "rgba(13, 13, 20, 0.4)"
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Draw text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + slice / 2)
      ctx.textAlign = "right"
      ctx.fillStyle = "#fff"
      ctx.font = `bold ${Math.min(16, 140 / names.length)}px Inter`
      ctx.shadowColor = "rgba(0,0,0,0.5)"
      ctx.shadowBlur = 4
      ctx.fillText(name.slice(0, 15), r - 25, 6)
      ctx.restore()
    })

    // Center hub
    ctx.beginPath()
    ctx.arc(cx, cy, 25, 0, 2 * Math.PI)
    ctx.fillStyle = "var(--color-surface)"
    ctx.fill()
    ctx.strokeStyle = "var(--color-border-bright)"
    ctx.lineWidth = 4
    ctx.stroke()
    
    // Pointer (top)
    ctx.save()
    ctx.translate(cx, 15)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-15, -15)
    ctx.lineTo(15, -15)
    ctx.closePath()
    ctx.fillStyle = "#f43f5e"
    ctx.shadowColor = "rgba(244,63,94,0.5)"
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.restore()

  }, [names, theme])

  useEffect(() => {
    drawWheel(spinRef.current.angle)
  }, [names.join(","), theme, drawWheel])

  function spin() {
    if (spinning || names.length < 2) return
    setSpinning(true)
    setWinner(null)
    
    // Random target based on duration
    const minSpins = 5
    spinRef.current.velocity = 0.25 + Math.random() * 0.15
    
    let lastSliceIdx = -1

    const animate = () => {
      spinRef.current.angle += spinRef.current.velocity
      spinRef.current.velocity *= (0.985 + (spinDuration / 1000)) // Adjust friction based on duration
      
      // Sound tick detection
      const slice = (2 * Math.PI) / names.length
      const currentSliceIdx = Math.floor(((spinRef.current.angle % (2 * Math.PI)) / slice))
      if (currentSliceIdx !== lastSliceIdx) {
        playClick()
        lastSliceIdx = currentSliceIdx
      }

      drawWheel(spinRef.current.angle)
      
      if (spinRef.current.velocity > 0.001) {
        spinRef.current.animId = requestAnimationFrame(animate)
      } else {
        const angle = (spinRef.current.angle % (2 * Math.PI))
        const slice = (2 * Math.PI) / names.length
        // Pointer is at the top (-Math.PI/2)
        const normalizedAngle = (Math.PI * 1.5 - angle) % (2 * Math.PI)
        const finalAngle = normalizedAngle < 0 ? normalizedAngle + 2 * Math.PI : normalizedAngle
        const winIdx = Math.floor(finalAngle / slice) % names.length
        
        const winName = names[winIdx]
        setWinner(winName)
        setHistory(prev => [winName, ...prev].slice(0, 20))
        setSpinning(false)
        
        // Celebration!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: THEMES[theme]
        })

        if (removeWinner) {
          setTimeout(() => {
            setInput(prev => prev.split("\n").filter(n => n.trim() !== winName).join("\n"))
          }, 1500)
        }
      }
    }
    spinRef.current.animId = requestAnimationFrame(animate)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ToolHeader 
        title="Wheel of Names" 
        description="A professional random name picker. Customize colors, sound, and spin behavior." 
      />

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Input & Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" /> Configuration
              </label>
              <button 
                onClick={() => setInput("")}
                className="text-[10px] uppercase font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <textarea 
              className="input-base h-40 text-sm font-mono leading-relaxed" 
              placeholder="Enter names, one per line..."
              value={input} 
              onChange={e => setInput(e.target.value)} 
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Color Theme</span>
                <div className="flex gap-1">
                  {(Object.keys(THEMES) as Theme[]).map(t => (
                    <button 
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`w-4 h-4 rounded-full border-2 transition-transform ${theme === t ? "scale-125 border-white" : "border-transparent opacity-50"}`}
                      style={{ background: THEMES[t][0] }}
                      title={t}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Remove Winner</span>
                <button 
                  onClick={() => setRemoveWinner(!removeWinner)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${removeWinner ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${removeWinner ? "left-4.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Sound Effects</span>
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-muted-foreground hover:text-foreground">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-primary-light" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              onClick={spin} 
              disabled={spinning || names.length < 2} 
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            >
              {spinning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Spin the Wheel
                </>
              )}
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="glass rounded-2xl p-5 space-y-3 animate-fade-in">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <History className="w-3.5 h-3.5" /> Winners History
              </label>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <div key={i} className="px-2 py-1 rounded-lg bg-surface-3 border border-border text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                    <Trophy className="w-3 h-3 text-amber-400" /> {h}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: The Wheel Visual */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[500px] relative">
          
          <div className="relative group">
            {/* Spinning Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-1000 ${spinning ? "opacity-40" : "opacity-10"}`}
              style={{ background: `conic-gradient(from 0deg, ${THEMES[theme].join(", ")})` }}
            />
            
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={600} 
              className={`relative z-10 w-full max-w-[500px] h-auto transition-transform ${spinning ? "" : "hover:scale-[1.02]"}`}
              style={{ cursor: spinning ? "default" : "pointer" }}
              onClick={spin} 
            />
          </div>

          {/* Winning Announcement */}
          {winner && !spinning && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-fade-in">
              <div className="glass px-8 py-6 rounded-3xl border-2 border-primary/50 shadow-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-light" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">We have a winner!</p>
                  <p className="text-4xl font-black gradient-text mt-1">{winner}</p>
                </div>
                <button 
                  onClick={() => setWinner(null)}
                  className="mt-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {names.length < 2 && (
            <div className="mt-8 text-center text-muted-foreground animate-pulse">
              <p className="text-sm">Add at least 2 names to start spinning</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
