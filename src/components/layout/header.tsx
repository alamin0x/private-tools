import { useState } from "react"
import { NavLink, useLocation } from "react-router"
import { useTheme } from "@/hooks/use-theme"
import { tools, categories, type Category } from "@/lib/tools-registry"
import { Menu, Moon, Sun, X, Zap, Search, Command } from "lucide-react"

const categoryDots: Record<Category, string> = {
  text:      "bg-blue-400",
  developer: "bg-emerald-400",
  converter: "bg-amber-400",
  generator: "bg-violet-400",
  encoding:  "bg-rose-400",
  pdf:       "bg-red-400",
  image:     "bg-fuchsia-400",
  utility:   "bg-teal-400",
  calculator: "bg-orange-400",
}

interface HeaderProps {
  onSearchClick: () => void
}

export function Header({ onSearchClick }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const categoryKeys = Object.keys(categories) as Category[]

  const currentTool = tools.find((t) => location.pathname === `/${t.id}`)

  return (
    <>
      <header
        className="flex items-center justify-between px-4 py-3 relative z-10"
        style={{
          background: "var(--color-header-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--color-muted-foreground)" }}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile brand */}
          <NavLink to="/" className="md:hidden flex items-center gap-2" style={{ textDecoration: "none" }}>
            <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "linear-gradient(135deg,#7c5af3,#06b6d4)", boxShadow: "0 0 12px rgba(124,90,243,0.5)" }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--color-foreground)" }}>
              Dev<span className="gradient-text">Toolbox</span>
            </span>
          </NavLink>

          {/* Desktop: current tool breadcrumb */}
          {currentTool && (
            <div className="hidden md:flex items-center gap-2">
              <span
                className="text-xs font-semibold px-2 py-1 rounded-md"
                style={{ color: "var(--color-muted-foreground)", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
              >
                {categories[currentTool.category].label}
              </span>
              <span style={{ color: "var(--color-border-bright)", fontWeight: 600 }}>/</span>
              <h1 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{currentTool.name}</h1>
            </div>
          )}
        </div>


        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium"
            style={{
              color: "var(--color-muted-foreground)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search tools...</span>
            <div className="flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 opacity-60">
              <Command className="h-2.5 w-2.5" />
              <span className="text-[10px]">K</span>
            </div>
          </button>

          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg transition-all"
            style={{
              color: "var(--color-muted-foreground)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
            }}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark"
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 h-full w-72 overflow-y-auto animate-slide-left"
            style={{ background: "var(--color-sidebar)", borderRight: "1px solid var(--color-sidebar-border)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid var(--color-sidebar-border)" }}>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg,#7c5af3,#06b6d4)", boxShadow: "0 0 16px rgba(124,90,243,0.5)" }}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-base" style={{ color: "var(--color-foreground)" }}>
                  Dev<span className="gradient-text">Toolbox</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="p-3 space-y-5">
              {categoryKeys.map((cat) => (
                <div key={cat}>
                  <div className="section-label flex items-center gap-1.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${categoryDots[cat]}`} />
                    {categories[cat].label}
                  </div>
                  <ul className="space-y-0.5 mt-1">
                    {tools
                      .filter((t) => t.category === cat)
                      .map((tool) => {
                        const isActive = location.pathname === `/${tool.id}`
                        return (
                          <li key={tool.id}>
                            <NavLink
                              to={`/${tool.id}`}
                              onClick={() => setMobileOpen(false)}
                              className={`nav-item ${isActive ? "active" : ""}`}
                            >
                              {tool.name}
                            </NavLink>
                          </li>
                        )
                      })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
