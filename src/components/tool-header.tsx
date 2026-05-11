import { useLocation } from "react-router"
import { useFavorites } from "@/hooks/use-favorites"
import { Star } from "lucide-react"

interface ToolHeaderProps {
  title: string
  description: string
}

export default function ToolHeader({ title, description }: ToolHeaderProps) {
  const location = useLocation()
  const { favorites, toggleFavorite } = useFavorites()
  const toolId = location.pathname.slice(1)
  const isFavorite = favorites.includes(toolId)

  return (
    <div
      className="mb-7 pb-6 flex justify-between items-start"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <div className="flex-1 pr-4">
        <h1
          className="text-2xl font-extrabold mb-1.5"
          style={{
            color: "var(--color-foreground)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--color-muted-foreground)", lineHeight: 1.6 }}
        >
          {description}
        </p>
      </div>

      <button
        onClick={() => toggleFavorite(toolId)}
        className="p-2.5 rounded-xl transition-all group hover:scale-110 active:scale-95"
        style={{ 
          background: isFavorite ? "rgba(245,158,11,0.1)" : "var(--color-surface-2)",
          border: `1px solid ${isFavorite ? "rgba(245,158,11,0.3)" : "var(--color-border)"}`,
          color: isFavorite ? "#f59e0b" : "var(--color-muted-foreground)"
        }}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star className={`h-5 w-5 ${isFavorite ? "fill-amber-400" : "group-hover:text-amber-400 transition-colors"}`} />
      </button>
    </div>
  )
}

export { ToolHeader }
