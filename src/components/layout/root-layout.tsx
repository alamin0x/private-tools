import { Suspense, useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { CommandPalette } from "./command-palette"
import { useFavorites } from "@/hooks/use-favorites"

export function RootLayout() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const location = useLocation()
  const { addRecent } = useFavorites()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsPaletteOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const toolId = location.pathname.slice(1)
    if (toolId && toolId !== "not-found") {
      addRecent(toolId)
    }
  }, [location.pathname, addRecent])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-background)", position: "relative" }}>
      {/* Ambient background glows */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-20%",
          left: "10%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,90,243,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "5%",
          width: "35vw",
          height: "35vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden" style={{ position: "relative", zIndex: 1 }}>
        <Header onSearchClick={() => setIsPaletteOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 md:p-7 lg:p-9">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="spinner" />
              </div>
            }
          >
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  )
}
