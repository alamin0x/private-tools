import { useState, useEffect } from "react"
import ToolHeader from "@/components/tool-header"

interface Habit { id: number; name: string; color: string; checks: string[] }

const COLORS = ["#7c5af3", "#10b981", "#f59e0b", "#f43f5e", "#06b6d4", "#e879f9"]
const today = () => new Date().toISOString().split("T")[0]
const pastDays = (n: number) => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (n - 1 - i)); return d.toISOString().split("T")[0] })

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(() => JSON.parse(localStorage.getItem("habits") ?? "[]"))
  const [name, setName] = useState("")
  const [color, setColor] = useState(COLORS[0])
  const days = pastDays(14)

  useEffect(() => { localStorage.setItem("habits", JSON.stringify(habits)) }, [habits])

  function add() {
    if (!name.trim()) return
    setHabits(h => [...h, { id: Date.now(), name: name.trim(), color, checks: [] }])
    setName("")
  }

  function toggle(id: number, day: string) {
    setHabits(h => h.map(x => x.id === id
      ? { ...x, checks: x.checks.includes(day) ? x.checks.filter(d => d !== day) : [...x.checks, day] }
      : x))
  }

  function remove(id: number) { if (confirm("Delete this habit?")) setHabits(h => h.filter(x => x.id !== id)) }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <ToolHeader title="Habit Tracker" description="Track your daily habits. Data saved locally in your browser." />

      <div className="flex gap-2 flex-wrap">
        <input className="input-base flex-1 min-w-40" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()} placeholder="New habit name…" />
        <div className="flex gap-1">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)} className="w-7 h-7 rounded-full transition-all"
              style={{ background: c, border: color === c ? "3px solid white" : "2px solid transparent", boxShadow: color === c ? "0 0 0 2px " + c : "none" }} />
          ))}
        </div>
        <button onClick={add} className="btn-primary px-4">Add</button>
      </div>

      {habits.length > 0 ? (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="text-left px-4 py-2.5 font-semibold" style={{ color: "var(--color-muted-foreground)", minWidth: "140px" }}>Habit</th>
                  {days.map(d => (
                    <th key={d} className="px-1.5 py-2.5 text-center font-semibold" style={{ color: d === today() ? "var(--color-primary-light)" : "var(--color-muted-foreground)" }}>
                      {new Date(d + "T00:00:00").toLocaleDateString("en", { weekday: "short" })[0]}<br />{d.slice(-2)}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 font-semibold text-center" style={{ color: "var(--color-muted-foreground)" }}>%</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {habits.map(h => {
                  const pct = Math.round((h.checks.filter(d => days.includes(d)).length / days.length) * 100)
                  return (
                    <tr key={h.id} style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                      <td className="px-4 py-2.5 font-semibold flex items-center gap-2" style={{ color: "var(--color-foreground)" }}>
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: h.color }} />
                        {h.name}
                      </td>
                      {days.map(d => (
                        <td key={d} className="px-1.5 py-2.5 text-center">
                          <button onClick={() => toggle(h.id, d)}
                            className="w-5 h-5 rounded transition-all mx-auto block"
                            style={{ background: h.checks.includes(d) ? h.color : "var(--color-surface-2)", border: `1.5px solid ${h.checks.includes(d) ? h.color : "var(--color-border)"}` }}>
                            {h.checks.includes(d) && <span className="text-white text-xs font-bold block">✓</span>}
                          </button>
                        </td>
                      ))}
                      <td className="px-3 py-2.5 text-center font-bold" style={{ color: pct >= 80 ? "var(--color-success)" : pct >= 50 ? "var(--color-warning)" : "var(--color-destructive)" }}>
                        {pct}%
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button onClick={() => remove(h.id)} className="text-xs opacity-30 hover:opacity-100 transition-opacity" style={{ color: "var(--color-destructive)" }}>✕</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-3xl mb-2">🎯</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Add your first habit to start tracking!</p>
        </div>
      )}
    </div>
  )
}
