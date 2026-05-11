import { useState, useEffect } from "react"
import ToolHeader from "@/components/tool-header"

interface Todo { id: number; text: string; done: boolean }

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => JSON.parse(localStorage.getItem("todos") ?? "[]"))
  const [input, setInput] = useState("")

  useEffect(() => { localStorage.setItem("todos", JSON.stringify(todos)) }, [todos])

  function add() {
    if (!input.trim()) return
    setTodos(t => [...t, { id: Date.now(), text: input.trim(), done: false }])
    setInput("")
  }

  function toggle(id: number) { setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x)) }
  function remove(id: number) { setTodos(t => t.filter(x => x.id !== id)) }
  function clearDone() { setTodos(t => t.filter(x => !x.done)) }

  const done = todos.filter(t => t.done).length

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <ToolHeader title="To-Do List" description="Manage your tasks. Data is saved locally in your browser." />

      <div className="flex gap-2">
        <input className="input-base flex-1" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()} placeholder="Add a new task…" />
        <button onClick={add} className="btn-primary px-4">Add</button>
      </div>

      {todos.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
            <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>
              {done}/{todos.length} completed
            </span>
            {done > 0 && <button onClick={clearDone} className="text-xs font-semibold" style={{ color: "var(--color-destructive)" }}>Clear done</button>}
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {todos.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3 transition-colors"
                style={{ background: t.done ? "rgba(16,185,129,0.04)" : "var(--color-surface)" }}>
                <button onClick={() => toggle(t.id)}
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ border: `2px solid ${t.done ? "var(--color-success)" : "var(--color-border)"}`, background: t.done ? "var(--color-success)" : "transparent" }}>
                  {t.done && <span className="text-white text-xs font-bold">✓</span>}
                </button>
                <span className="flex-1 text-sm" style={{ color: t.done ? "var(--color-muted-foreground)" : "var(--color-foreground)", textDecoration: t.done ? "line-through" : "none" }}>
                  {t.text}
                </span>
                <button onClick={() => remove(t.id)} className="text-xs opacity-40 hover:opacity-100 transition-opacity" style={{ color: "var(--color-destructive)" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {todos.length === 0 && (
        <div className="text-center py-12 rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-3xl mb-2">✅</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>All clear! Add a task to get started.</p>
        </div>
      )}
    </div>
  )
}
