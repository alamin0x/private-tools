import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { tools, categories } from "@/lib/tools-registry"
import { Search, Zap } from "lucide-react"

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim() === ""
    ? []
    : tools.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || 
        t.category.toLowerCase().includes(query.toLowerCase()) ||
        t.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(0)
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose()
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (filtered.length) setSelectedIndex(i => (i + 1) % filtered.length)
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (filtered.length) setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length)
    }
    if (e.key === "Enter" && filtered[selectedIndex]) {
      navigate(`/${filtered[selectedIndex].id}`)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ 
          background: "var(--color-surface-2)", 
          border: "1px solid var(--color-border)",
          boxShadow: "0 0 40px rgba(124,90,243,0.2)"
        }}
      >
        <div className="flex items-center px-4 py-4 gap-3 border-b border-white/5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground text-foreground"
            placeholder="Search tools, categories, or keywords..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-muted-foreground">ESC</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              {filtered.map((tool, i) => (
                <div
                  key={tool.id}
                  onClick={() => { navigate(`/${tool.id}`); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                    selectedIndex === i ? "bg-primary/10 border-primary/20" : "bg-transparent border-transparent"
                  }`}
                  style={{ 
                    border: "1px solid transparent",
                    background: selectedIndex === i ? "rgba(124,90,243,0.1)" : "transparent",
                    borderColor: selectedIndex === i ? "rgba(124,90,243,0.2)" : "transparent"
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
                    <Zap className="h-4 w-4" style={{ color: "var(--color-primary-light)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "var(--color-foreground)" }}>{tool.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>{tool.description}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 font-bold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
                    {categories[tool.category].label}
                  </span>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center space-y-2">
              <Search className="h-8 w-8 mx-auto opacity-20" />
              <p className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>No tools found for "{query}"</p>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--color-muted-foreground)" }}>
                Start typing to find a tool
              </p>
              <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-white/5 text-[10px] border border-white/10">↑↓</span>
                  <span className="text-[10px] text-muted-foreground">Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-white/5 text-[10px] border border-white/10">Enter</span>
                  <span className="text-[10px] text-muted-foreground">Select</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
