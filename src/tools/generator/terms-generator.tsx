import { useState } from "react"
import ToolHeader from "@/components/tool-header"
import CopyButton from "@/components/copy-button"

export default function TermsGenerator() {
  const [company, setCompany] = useState("Acme Corp")
  const [website, setWebsite] = useState("https://acme.com")
  const [email, setEmail] = useState("legal@acme.com")
  const [jurisdiction, setJurisdiction] = useState("California, USA")
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  const terms = `Terms and Conditions for ${company}

Last updated: ${date}

Please read these Terms and Conditions carefully before using ${website}.

1. Acceptance of Terms
By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.

2. Use of Service
You agree to use ${company}'s services only for lawful purposes and in compliance with all applicable laws. You must not:
- Violate any laws or regulations
- Infringe on intellectual property rights
- Transmit harmful or malicious content
- Attempt unauthorized access to our systems

3. Intellectual Property
All content, trademarks, and intellectual property on ${website} belong to ${company} unless otherwise stated. You may not copy, reproduce, or distribute our content without written permission.

4. User Accounts
If you create an account, you are responsible for:
- Maintaining confidentiality of your credentials
- All activities that occur under your account
- Notifying us immediately of unauthorized access

5. Limitation of Liability
${company} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services, to the maximum extent permitted by law.

6. Disclaimer of Warranties
Our services are provided "as is" without warranties of any kind, either express or implied.

7. Termination
We reserve the right to suspend or terminate your access to our services at our sole discretion, with or without notice.

8. Governing Law
These Terms shall be governed by the laws of ${jurisdiction}, without regard to conflict of law principles.

9. Changes to Terms
We may modify these Terms at any time. Continued use of our services after changes constitutes acceptance.

10. Contact Us
For questions about these Terms, contact us at: ${email}
Website: ${website}

© ${new Date().getFullYear()} ${company}. All rights reserved.`

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Terms & Conditions Generator" description="Generate basic terms and conditions for your website or app." />

      <div className="grid grid-cols-2 gap-4">
        {[["Company Name", company, setCompany], ["Website URL", website, setWebsite], ["Legal Email", email, setEmail], ["Jurisdiction", jurisdiction, setJurisdiction]].map(([label, val, setter]) => (
          <div key={label as string}>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--color-muted-foreground)" }}>{label as string}</label>
            <input className="input-base text-sm" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Generated Terms</span>
          <CopyButton text={terms} />
        </div>
        <pre className="text-xs font-mono whitespace-pre-wrap overflow-y-auto max-h-72 leading-relaxed" style={{ color: "var(--color-foreground)" }}>{terms}</pre>
      </div>

      <p className="text-xs text-center" style={{ color: "var(--color-muted-foreground)" }}>⚠ This is a template only. Consult a legal professional for legally binding terms.</p>
    </div>
  )
}
