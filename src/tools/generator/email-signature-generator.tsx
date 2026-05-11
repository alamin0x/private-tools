import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function EmailSignatureGenerator() {
  const [name, setName] = useState("John Doe")
  const [title, setTitle] = useState("Software Engineer")
  const [company, setCompany] = useState("Acme Corp")
  const [email, setEmail] = useState("john@acme.com")
  const [phone, setPhone] = useState("+1 555 123 4567")
  const [website, setWebsite] = useState("https://acme.com")
  const [color, setColor] = useState("#7c5af3")

  const html = `<table cellpadding="0" cellspacing="0" style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#333;max-width:420px">
  <tr>
    <td style="padding-right:16px;border-right:3px solid ${color};vertical-align:top">
      <div style="font-size:18px;font-weight:700;color:#111;white-space:nowrap">${name}</div>
      <div style="font-size:12px;color:${color};font-weight:600;margin-top:2px">${title}</div>
      <div style="font-size:12px;color:#666;margin-top:2px">${company}</div>
    </td>
    <td style="padding-left:16px;vertical-align:top">
      ${email ? `<div style="margin-bottom:3px">📧 <a href="mailto:${email}" style="color:${color};text-decoration:none">${email}</a></div>` : ""}
      ${phone ? `<div style="margin-bottom:3px">📞 ${phone}</div>` : ""}
      ${website ? `<div>🌐 <a href="${website}" style="color:${color};text-decoration:none">${website}</a></div>` : ""}
    </td>
  </tr>
</table>`

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Email Signature Generator" description="Create a professional HTML email signature in seconds." />

      <div className="grid grid-cols-2 gap-4">
        {[["Full Name", name, setName], ["Job Title", title, setTitle], ["Company", company, setCompany], ["Email", email, setEmail], ["Phone", phone, setPhone], ["Website", website, setWebsite]].map(([label, val, setter]) => (
          <div key={label as string}>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</label>
            <input className="input-base text-sm" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>Accent Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            <input className="input-base text-sm font-mono flex-1" value={color} onChange={e => setColor(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid var(--color-border)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "#666" }}>Preview</p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>HTML Code</span>
          <CopyButton text={html} />
        </div>
        <pre className="text-xs font-mono overflow-x-auto max-h-40 whitespace-pre-wrap" style={{ color: "var(--color-foreground)" }}>{html}</pre>
      </div>
    </div>
  )
}
