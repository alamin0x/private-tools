import { NavLink, useLocation } from "react-router"
import { tools, categories, type Category } from "@/lib/tools-registry"
import { Zap, Star, History } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"

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

export function Sidebar() {
  const location = useLocation()
  const categoryKeys = Object.keys(categories) as Category[]
  const { favorites, recents } = useFavorites()

  const favoriteTools = tools.filter(t => favorites.includes(t.id))
  const recentTools = recents
    .map(id => tools.find(t => t.id === id))
    .filter((t): t is typeof tools[0] => !!t)
    .slice(0, 5)

  return (
    <aside className="hidden md:flex w-60 flex-col h-screen overflow-hidden" style={{ background: "var(--color-sidebar)", borderRight: "1px solid var(--color-sidebar-border)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: "1px solid var(--color-sidebar-border)" }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg,#7c5af3,#06b6d4)", boxShadow: "0 0 16px rgba(124,90,243,0.5)" }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        <NavLink to="/" className="font-bold text-base" style={{ color: "var(--color-foreground)", textDecoration: "none", letterSpacing: "-0.01em" }}>
          Dev<span className="gradient-text">Toolbox</span>
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-7">
        {/* Favorites */}
        {favoriteTools.length > 0 && (
          <div>
            <div className="section-label flex items-center gap-1.5 mb-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Favorites
            </div>
            <ul className="space-y-0.5">
              {favoriteTools.map((tool) => {
                const isActive = location.pathname === `/${tool.id}`
                return (
                  <li key={tool.id}>
                    <NavLink to={`/${tool.id}`} className={`nav-item ${isActive ? "active" : ""}`}>
                      {tool.name}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Recents */}
        {recentTools.length > 0 && (
          <div>
            <div className="section-label flex items-center gap-1.5 mb-1.5">
              <History className="w-3.5 h-3.5 text-blue-400" />
              Recently Used
            </div>
            <ul className="space-y-0.5">
              {recentTools.map((tool) => {
                const isActive = location.pathname === `/${tool.id}`
                return (
                  <li key={tool.id}>
                    <NavLink to={`/${tool.id}`} className={`nav-item ${isActive ? "active" : ""}`}>
                      {tool.name}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Categories */}
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

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          {tools.length} tools · Always free
        </p>
      </div>
    </aside>
  )
}
