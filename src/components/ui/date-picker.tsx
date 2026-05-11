import { useState, useRef, useEffect, useMemo } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  max?: string
  min?: string
}

export function DatePicker({ value, onChange, label, placeholder, max, min }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Current view state (month/year)
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value)
    return new Date()
  })

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
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
    
    // Previous month's padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: currentMonth - 1, year: currentYear, current: false })
    }
    
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month: currentMonth, year: currentYear, current: true })
    }
    
    // Next month's padding
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: currentMonth + 1, year: currentYear, current: false })
    }
    
    return days
  }, [currentYear, currentMonth])

  const handleDateSelect = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day)
    const formatted = date.toISOString().split("T")[0]
    
    // Check constraints
    if (max && formatted > max) return
    if (min && formatted < min) return
    
    onChange(formatted)
    setIsOpen(false)
  }

  const navigateMonth = (direction: number) => {
    const next = new Date(currentYear, currentMonth + direction, 1)
    setViewDate(next)
  }

  const isSelected = (day: number, month: number, year: number) => {
    if (!value) return false
    const d = new Date(value)
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
  }

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const isDisabled = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day).toISOString().split("T")[0]
    if (max && date > max) return true
    if (min && date < min) return true
    return false
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
            <div className="font-bold text-sm" style={{ color: "var(--color-foreground)" }}>
              {months[currentMonth]} {currentYear}
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigateMonth(1)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-px px-2 pt-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
              <div key={d} className="text-[10px] font-bold text-center py-2" style={{ color: "var(--color-muted-foreground)" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-px p-2">
            {calendarDays.map((d, i) => {
              const selected = isSelected(d.day, d.month, d.year)
              const today = isToday(d.day, d.month, d.year)
              const disabled = isDisabled(d.day, d.month, d.year)
              
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => handleDateSelect(d.day, d.month, d.year)}
                  className={`
                    relative h-9 w-9 flex items-center justify-center text-xs rounded-lg transition-all
                    ${!d.current ? "opacity-30" : "opacity-100"}
                    ${disabled ? "cursor-not-allowed opacity-10" : "cursor-pointer"}
                  `}
                  style={{
                    background: selected ? "linear-gradient(135deg,#7c5af3,#06b6d4)" : "transparent",
                    color: selected ? "white" : today ? "var(--color-primary-light)" : "var(--color-foreground)",
                    fontWeight: selected || today ? "700" : "400",
                  }}
                >
                  {d.day}
                  {today && !selected && (
                    <div className="absolute bottom-1.5 w-1 h-1 rounded-full" style={{ background: "var(--color-primary-light)" }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="p-3 grid grid-cols-2 gap-2" style={{ borderTop: "1px solid var(--color-border)" }}>
            <button 
              onClick={() => {
                const now = new Date()
                handleDateSelect(now.getDate(), now.getMonth(), now.getFullYear())
              }}
              className="text-[10px] font-bold py-2 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.03)", color: "var(--color-foreground)", border: "1px solid var(--color-border)" }}
            >
              Select Today
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
