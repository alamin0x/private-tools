import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

export default function BionicReading() {
  const [input, setInput] = useState("");

  const convert = (text: string) => text.split(" ").map(word => {
    const boldLen = Math.ceil(word.length / 2);
    return `**${word.slice(0, boldLen)}**${word.slice(boldLen)}`;
  }).join(" ");

  const renderBionic = (text: string) => text.split(" ").map((word, i) => {
    const boldLen = Math.ceil(word.length / 2);
    return <span key={i}><strong style={{ color: "var(--color-foreground)", fontWeight: 900 }}>{word.slice(0, boldLen)}</strong><span style={{ color: "var(--color-muted-foreground)" }}>{word.slice(boldLen)}</span>{" "}</span>;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <ToolHeader title="Bionic Reading Converter" description="Bold the first half of each word to guide your eyes for faster reading." />
      <textarea className="input-base h-36 resize-y" placeholder="Paste any text here to convert it to bionic reading format…" value={input} onChange={e => setInput(e.target.value)} />
      {input && (
        <div className="space-y-3">
          <div className="rounded-xl p-5 leading-relaxed text-base" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            {renderBionic(input)}
          </div>
          <div className="flex justify-end">
            <CopyButton text={convert(input)} />
          </div>
        </div>
      )}
      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Bionic Reading boldens the initial part of words, helping your brain complete the rest and read faster.</p>
    </div>
  );
}
