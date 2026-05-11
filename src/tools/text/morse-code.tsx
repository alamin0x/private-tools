import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

const MORSE: Record<string, string> = {
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----.",".":".-.-.-",",":"--..--","?":"..--..","!":"-.-.--","/":"-..-.","@":".--.-.","(":"-.--.",")":"-.--.-",
};
const RMORSE = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v,k]));

export default function MorseCode() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"encode"|"decode">("encode");

  const encode = (s: string) => s.toUpperCase().split("").map(c => c === " " ? "/" : (MORSE[c] || "?")).join(" ");
  const decode = (s: string) => s.trim().split(" / ").map(word => word.split(" ").map(c => RMORSE[c] || "?").join("")).join(" ");
  const result = mode === "encode" ? encode(text) : decode(text);

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <ToolHeader title="Morse Code Converter" description="Convert text to Morse code and back. Use / to separate words when decoding." />
      <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        {(["encode","decode"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setText(""); }} className="flex-1 py-2.5 text-sm font-semibold transition-all"
            style={mode === m ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "white" } : { color: "var(--color-muted-foreground)" }}>
            {m === "encode" ? "Text → Morse" : "Morse → Text"}
          </button>
        ))}
      </div>
      <textarea className="input-base h-28 font-mono text-sm resize-y" placeholder={mode === "encode" ? "Type text to encode…" : "Paste Morse code (use / for word breaks)…"} value={text} onChange={e => setText(e.target.value)} />
      {result && (
        <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Result</span>
            <CopyButton text={result} />
          </div>
          <p className="font-mono text-sm break-all" style={{ color: "var(--color-primary-light)" }}>{result}</p>
        </div>
      )}
      <div className="grid grid-cols-6 gap-1 mt-2">
        {Object.entries(MORSE).slice(0,26).map(([c,m]) => (
          <div key={c} className="text-center p-1 rounded" style={{ background: "var(--color-surface-2)" }}>
            <div className="text-xs font-bold" style={{ color: "var(--color-primary-light)" }}>{c}</div>
            <div className="text-xs font-mono" style={{ color: "var(--color-muted-foreground)" }}>{m}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
