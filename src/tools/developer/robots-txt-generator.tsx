import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState([{ userAgent: "*", allow: "/", disallow: "" }])
  const [sitemap, setSitemap] = useState("")
  const [crawlDelay, setCrawlDelay] = useState("")

  function addRule() { setRules(r => [...r, { userAgent: "*", allow: "", disallow: "" }]) }
  function updateRule(i: number, key: string, val: string) { setRules(r => r.map((x, idx) => idx === i ? { ...x, [key]: val } : x)) }
  function removeRule(i: number) { setRules(r => r.filter((_, idx) => idx !== i)) }

  const output = rules.map(r => {
    let block = `User-agent: ${r.userAgent || "*"}`
    if (crawlDelay) block += `\nCrawl-delay: ${crawlDelay}`
    if (r.disallow) block += `\nDisallow: ${r.disallow}`
    if (r.allow) block += `\nAllow: ${r.allow}`
    return block
  }).join("\n\n") + (sitemap ? `\n\nSitemap: ${sitemap}` : "")

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Robots.txt Generator" description="Generate a valid robots.txt file for your website's SEO crawling rules." />

      <div className="space-y-3">
        {rules.map((rule, i) => (
          <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Rule {i + 1}</span>
              {rules.length > 1 && <button onClick={() => removeRule(i)} className="text-xs" style={{ color: "var(--color-destructive)" }}>Remove</button>}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[["User-agent", "userAgent", "e.g. * or Googlebot"], ["Disallow", "disallow", "e.g. /admin/"], ["Allow", "allow", "e.g. /public/"]].map(([label, key, placeholder]) => (
                <div key={key} className="flex items-center gap-3">
                  <label className="text-xs font-semibold w-24 flex-shrink-0" style={{ color: "var(--color-muted-foreground)" }}>{label}:</label>
                  <input className="input-base flex-1 text-sm font-mono" placeholder={placeholder}
                    value={(rule as Record<string, string>)[key]} onChange={e => updateRule(i, key, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Crawl Delay (seconds)</label>
          <input className="input-base text-sm" placeholder="10" value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Sitemap URL</label>
          <input className="input-base text-sm" placeholder="https://example.com/sitemap.xml" value={sitemap} onChange={e => setSitemap(e.target.value)} />
        </div>
      </div>

      <button onClick={addRule} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-primary-light)" }}>+ Add Rule</button>

      <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>robots.txt Output</span>
          <CopyButton text={output} />
        </div>
        <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: "var(--color-foreground)" }}>{output}</pre>
      </div>
    </div>
  )
}
