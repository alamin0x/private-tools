import { BrowserRouter, Routes, Route } from "react-router"
import { RootLayout } from "@/components/layout/root-layout"
import { tools } from "@/lib/tools-registry"
import Home from "@/pages/home"
import NotFound from "@/pages/not-found"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          {tools.map((tool) => (
            <Route key={tool.id} path={tool.id} element={<tool.component />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
