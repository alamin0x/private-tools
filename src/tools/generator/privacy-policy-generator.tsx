import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function PrivacyPolicyGenerator() {
  const [company, setCompany] = useState("Acme Corp")
  const [website, setWebsite] = useState("https://acme.com")
  const [email, setEmail] = useState("privacy@acme.com")
  const [collectsData, setCollectsData] = useState(["analytics", "cookies"])
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  const toggleItem = (item: string) => setCollectsData(d => d.includes(item) ? d.filter(x => x !== item) : [...d, item])

  const policy = `Privacy Policy for ${company}

Last updated: ${date}

1. Introduction
${company} ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit ${website}.

2. Information We Collect
${collectsData.includes("analytics") ? "- Usage data and analytics (pages visited, time on site)\n" : ""}${collectsData.includes("cookies") ? "- Cookies and similar tracking technologies\n" : ""}${collectsData.includes("email") ? "- Email address when you subscribe or contact us\n" : ""}${collectsData.includes("account") ? "- Account information (name, email, password)\n" : ""}- Technical data (IP address, browser type, device information)

3. How We Use Your Information
We use your information to:
- Provide and improve our services
- Analyze website performance
- Respond to your inquiries
- Send you relevant communications (with your consent)

4. Data Sharing
We do not sell your personal data. We may share data with:
- Service providers who assist our operations
- Legal authorities when required by law

5. Data Retention
We retain your data for as long as necessary to provide our services or as required by law.

6. Your Rights
You have the right to:
- Access your personal data
- Request correction or deletion
- Opt-out of marketing communications
- Lodge a complaint with a supervisory authority

7. Security
We implement appropriate technical and organizational measures to protect your data.

8. Contact Us
For privacy-related inquiries, contact us at: ${email}
Website: ${website}

© ${new Date().getFullYear()} ${company}. All rights reserved.`

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Privacy Policy Generator" description="Generate a basic privacy policy for your website in seconds." />

      <div className="grid grid-cols-2 gap-4">
        {[["Company Name", company, setCompany], ["Website URL", website, setWebsite], ["Privacy Email", email, setEmail]].map(([label, val, setter]) => (
          <div key={label as string} className="col-span-1">
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</label>
            <input className="input-base text-sm" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-muted-foreground)" }}>Data You Collect</p>
        <div className="flex flex-wrap gap-2">
          {[["analytics", "Analytics"], ["cookies", "Cookies"], ["email", "Email Addresses"], ["account", "Account Data"]].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-all"
              style={{ background: collectsData.includes(key) ? "rgba(124,90,243,0.15)" : "var(--color-surface-2)", border: `1px solid ${collectsData.includes(key) ? "#7c5af3" : "var(--color-border)"}`, color: collectsData.includes(key) ? "var(--color-primary-light)" : "var(--color-muted-foreground)" }}>
              <input type="checkbox" checked={collectsData.includes(key)} onChange={() => toggleItem(key)} className="hidden" />
              {collectsData.includes(key) ? "✓" : "+"} {label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Generated Policy</span>
          <CopyButton text={policy} />
        </div>
        <pre className="text-xs font-mono whitespace-pre-wrap overflow-y-auto max-h-72 leading-relaxed" style={{ color: "var(--color-foreground)" }}>{policy}</pre>
      </div>

      <p className="text-xs text-center" style={{ color: "var(--color-muted-foreground)" }}>⚠ This is a template only. Consult a legal professional for a legally binding privacy policy.</p>
    </div>
  )
}
