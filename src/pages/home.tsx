import { useState, useMemo } from "react"
import { Link } from "react-router"
import { tools, categories, type Category } from "@/lib/tools-registry"
import { Search, Zap, ArrowRight } from "lucide-react"
import * as Icons from "lucide-react"
import type React from "react"

const categoryConfig: Record<Category, { dot: string; badge: string }> = {
  text:      { dot: "#4f8ef7", badge: "cat-text" },
  developer: { dot: "#10b981", badge: "cat-developer" },
  converter: { dot: "#f59e0b", badge: "cat-converter" },
  generator: { dot: "#7c5af3", badge: "cat-generator" },
  encoding:  { dot: "#f43f5e", badge: "cat-encoding" },
  pdf:       { dot: "#fb7185", badge: "cat-pdf" },
  image:     { dot: "#e879f9", badge: "cat-image" },
  utility:   { dot: "#5eead4", badge: "cat-utility" },
  calculator: { dot: "#ff5733", badge: "cat-calculator" },
}

export default function Home() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all")

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory
      const matchesSearch =
        search === "" ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  const categoryKeys = Object.keys(categories) as Category[]

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="text-center mb-10">
        {/* Glowing icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
          style={{
            background: "linear-gradient(135deg,#7c5af3,#06b6d4)",
            boxShadow: "0 0 48px rgba(124,90,243,0.45), 0 0 96px rgba(6,182,212,0.2)",
          }}
        >
          <Zap className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          <span style={{ color: "var(--color-foreground)" }}>Private</span>
          <span className="gradient-text">Tools</span>
        </h1>

        <p className="text-base md:text-lg mb-6" style={{ color: "var(--color-muted-foreground)" }}>
          {tools.length} powerful tools for your daily tasks — all free, all instant.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { val: tools.length.toString(), label: "Tools" },
            { val: categoryKeys.length.toString(), label: "Categories" },
            { val: "100%", label: "Free" },
            { val: "0", label: "Sign-ups" },
          ].map((s) => (
            <div key={s.label} className="stat-pill">
              <span className="font-bold" style={{ color: "var(--color-primary-light)" }}>{s.val}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div className="relative max-w-lg mx-auto mb-6">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: "var(--color-muted-foreground)" }}
        />
        <input
          type="search"
          id="tool-search"
          placeholder="Search tools by name or keyword…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-10 pr-4"
          style={{ borderRadius: "999px", paddingLeft: "2.75rem" }}
        />
      </div>

      {/* ── Category Filters ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          id="filter-all"
          onClick={() => setActiveCategory("all")}
          className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={
            activeCategory === "all"
              ? {
                  background: "linear-gradient(135deg,#7c5af3,#4f8ef7)",
                  color: "white",
                  boxShadow: "0 0 16px rgba(124,90,243,0.35)",
                }
              : {
                  background: "var(--color-surface-2)",
                  color: "var(--color-muted-foreground)",
                  border: "1px solid var(--color-border)",
                }
          }
        >
          All Tools
        </button>

        {categoryKeys.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={
              activeCategory === cat
                ? {
                    background: "linear-gradient(135deg,#7c5af3,#4f8ef7)",
                    color: "white",
                    boxShadow: "0 0 16px rgba(124,90,243,0.35)",
                  }
                : {
                    background: "var(--color-surface-2)",
                    color: "var(--color-muted-foreground)",
                    border: "1px solid var(--color-border)",
                  }
            }
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: categoryConfig[cat].dot }}
            />
            {categories[cat].label}
          </button>
        ))}
      </div>

      {/* ── Tool Grid ────────────────────────────────────────────────────── */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filteredTools.map((tool) => {
            const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.icon]
            const cfg = categoryConfig[tool.category]

            return (
              <Link
                key={tool.id}
                to={`/${tool.id}`}
                className="tool-card animate-fade-in group"
                style={{ padding: "1.25rem", textDecoration: "none", display: "block" }}
              >
                {/* Top row: icon + arrow */}
                <div className="flex items-start justify-between mb-3">
                  <div className="icon-wrap icon-wrap-primary">
                    {IconComponent
                      ? <IconComponent className="h-5 w-5" />
                      : <Zap className="h-5 w-5" />
                    }
                  </div>
                  <ArrowRight
                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
                    style={{ color: "var(--color-primary-light)", marginTop: "0.25rem" }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-semibold text-sm mb-1 transition-colors group-hover:gradient-text"
                  style={{ color: "var(--color-foreground)", lineHeight: 1.3 }}
                >
                  {tool.name}
                </h3>

                {/* Description */}
                <p
                  className="text-xs mb-3 line-clamp-2"
                  style={{ color: "var(--color-muted-foreground)", lineHeight: 1.5 }}
                >
                  {tool.description}
                </p>

                {/* Category badge */}
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}
                  style={{ letterSpacing: "0.01em" }}
                >
                  <span className="w-1 h-1 rounded-full inline-block" style={{ background: cfg.dot }} />
                  {categories[tool.category].label}
                </span>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
          >
            <Search className="h-6 w-6" style={{ color: "var(--color-muted-foreground)" }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>No tools found</p>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Try a different search or category filter.</p>
        </div>
      )}
    </div>
  )
}
