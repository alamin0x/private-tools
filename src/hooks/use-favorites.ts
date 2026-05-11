import { useState, useCallback } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("fav-tools")
    return saved ? JSON.parse(saved) : []
  })

  const [recents, setRecents] = useState<string[]>(() => {
    const saved = localStorage.getItem("recent-tools")
    return saved ? JSON.parse(saved) : []
  })

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      localStorage.setItem("fav-tools", JSON.stringify(next))
      return next
    })
  }

  const addRecent = useCallback((id: string) => {
    setRecents(prev => {
      const filtered = prev.filter(i => i !== id)
      const next = [id, ...filtered].slice(0, 10) // Keep last 10
      localStorage.setItem("recent-tools", JSON.stringify(next))
      return next
    })
  }, [])

  return { favorites, recents, toggleFavorite, addRecent }
}
