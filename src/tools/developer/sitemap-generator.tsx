import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState("https://example.com")
  const [pages, setPages] = useState("/\n/about\n/contact\n/blog\n/services")
  const [changefreq, setChangefreq] = useState("weekly")
  const [priority, setPriority] = useState("0.8")

  const urls = pages.split("\n").map(p => p.trim()).filter(Boolean)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(path => `  <url>
    <loc>${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : "/" + path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${path === "/" ? "1.0" : priority}</priority>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`).join("\n")}
</urlset>`

  function download() {
    const blob = new Blob([sitemap], { type: "application/xml" })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sitemap.xml"; a.click()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Sitemap Generator" description="Generate an XML sitemap for better search engine crawling and indexing." />

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Base URL</label>
          <input className="input-base" placeholder="https://example.com" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Pages (one path per line)</label>
          <textarea className="input-base h-36 font-mono text-sm" value={pages} onChange={e => setPages(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Change Frequency</label>
            <select className="input-base" value={changefreq} onChange={e => setChangefreq(e.target.value)}>
              {["always","hourly","daily","weekly","monthly","yearly","never"].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Priority (0.0–1.0)</label>
            <select className="input-base" value={priority} onChange={e => setPriority(e.target.value)}>
              {["1.0","0.9","0.8","0.7","0.6","0.5","0.4","0.3","0.2","0.1"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>sitemap.xml Preview ({urls.length} URLs)</span>
          <div className="flex gap-2">
            <CopyButton text={sitemap} />
            <button onClick={download} className="btn-primary px-3 py-1 text-xs">⬇ Download</button>
          </div>
        </div>
        <pre className="text-xs font-mono overflow-x-auto max-h-64 whitespace-pre" style={{ color: "var(--color-foreground)" }}>{sitemap}</pre>
      </div>
    </div>
  )
}
