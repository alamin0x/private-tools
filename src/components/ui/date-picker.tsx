import { useState, useRef, useEffect, useMemo } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  max?: string
  min?: string
}

type ViewMode = "calendar" | "month" | "year"

export function DatePicker({ value, onChange, label, placeholder, max, min }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value)
    return new Date()
  })

  // Close on click outside and reset view mode
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setViewMode("calendar")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  
  const currentYear = viewDate.getFullYear()
  const currentMonth = viewDate.getMonth()

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(currentYear, currentMonth)
    const firstDay = firstDayOfMonth(currentYear, currentMonth)
    const prevMonthDays = daysInMonth(currentYear, currentMonth - 1)
    
    const days = []
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: currentMonth - 1, year: currentYear, current: false })
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month: currentMonth, year: currentYear, current: true })
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: currentMonth + 1, year: currentYear, current: false })
    }
    return days
  }, [currentYear, currentMonth])

  // Year range for year selector
  const years = useMemo(() => {
    const startYear = 1900
    const endYear = new Date().getFullYear() + 20
    const list = []
    for (let i = endYear; i >= startYear; i--) {
      list.push(i)
    }
    return list
  }, [])

  const handleDateSelect = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day)
    const formatted = date.toISOString().split("T")[0]
    if (max && formatted > max) return
    if (min && formatted < min) return
    onChange(formatted)
    setIsOpen(false)
  }

  const navigateMonth = (direction: number) => {
    setViewDate(new Date(currentYear, currentMonth + direction, 1))
  }

  const isSelected = (day: number, month: number, year: number) => {
    if (!value) return false
    const d = new Date(value)
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>{label}</label>}
      
      <div 
        className="input-base flex items-center justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        style={{ paddingRight: "0.75rem" }}
      >
        <span style={{ color: value ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}>
          {value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'long' }) : placeholder || "Select date..."}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <X 
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400" 
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
            />
          )}
          <CalendarIcon className="w-4 h-4" style={{ color: "var(--color-muted-foreground)" }} />
        </div>
      </div>

      {isOpen && (
        <div 
          className="absolute z-50 top-full mt-2 left-0 w-72 rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
          style={{ 
            background: "var(--color-surface-2)", 
            border: "1px solid var(--color-border)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setViewMode(viewMode === "month" ? "calendar" : "month")}
                className="flex items-center gap-0.5 font-bold text-sm px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors"
                style={{ color: "var(--color-foreground)" }}
              >
                {months[currentMonth]} <ChevronDown className={`w-3 h-3 transition-transform ${viewMode === 'month' ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={() => setViewMode(viewMode === "year" ? "calendar" : "year")}
                className="flex items-center gap-0.5 font-bold text-sm px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors"
                style={{ color: "var(--color-foreground)" }}
              >
                {currentYear} <ChevronDown className={`w-3 h-3 transition-transform ${viewMode === 'year' ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {viewMode === "calendar" && (
              <div className="flex items-center gap-1">
                <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => navigateMonth(1)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </div>

          <div className="h-64 overflow-y-auto custom-scrollbar">
            {viewMode === "calendar" && (
              <>
                <div className="grid grid-cols-7 gap-px px-2 pt-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="text-[10px] font-bold text-center py-2" style={{ color: "var(--color-muted-foreground)" }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px p-2">
                  {calendarDays.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => handleDateSelect(d.day, d.month, d.year)}
                      className={`h-9 w-9 flex items-center justify-center text-xs rounded-lg transition-all ${!d.current ? "opacity-30" : "opacity-100"}`}
                      style={{
                        background: isSelected(d.day, d.month, d.year) ? "linear-gradient(135deg,#7c5af3,#06b6d4)" : "transparent",
                        color: isSelected(d.day, d.month, d.year) ? "white" : "var(--color-foreground)",
                      }}
                    >
                      {d.day}
                    </button>
                  ))}
                </div>
              </>
            )}

            {viewMode === "month" && (
              <div className="grid grid-cols-3 gap-2 p-3">
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => { setViewDate(new Date(currentYear, i, 1)); setViewMode("calendar"); }}
                    className="py-3 text-xs font-semibold rounded-xl transition-all"
                    style={{ 
                      background: currentMonth === i ? "var(--color-primary-light)" : "rgba(255,255,255,0.03)",
                      color: currentMonth === i ? "white" : "var(--color-foreground)",
                      border: "1px solid var(--color-border)"
                    }}
                  >
                    {m.substring(0, 3)}
                  </button>
                ))}
              </div>
            )}

            {viewMode === "year" && (
              <div className="grid grid-cols-3 gap-2 p-3">
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => { setViewDate(new Date(y, currentMonth, 1)); setViewMode("calendar"); }}
                    className="py-3 text-xs font-semibold rounded-xl transition-all"
                    style={{ 
                      background: currentYear === y ? "var(--color-primary-light)" : "rgba(255,255,255,0.03)",
                      color: currentYear === y ? "white" : "var(--color-foreground)",
                      border: "1px solid var(--color-border)"
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 grid grid-cols-2 gap-2" style={{ borderTop: "1px solid var(--color-border)" }}>
            <button 
              onClick={() => {
                const now = new Date()
                setViewDate(now)
                handleDateSelect(now.getDate(), now.getMonth(), now.getFullYear())
              }}
              className="text-[10px] font-bold py-2 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.03)", color: "var(--color-foreground)", border: "1px solid var(--color-border)" }}
            >
              Today
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold py-2 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.03)", color: "var(--color-foreground)", border: "1px solid var(--color-border)" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
