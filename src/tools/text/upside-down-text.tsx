import { useState } from "react";
import ToolHeader from "@/components/tool-header";
import CopyButton from "@/components/copy-button";

const MAP: Record<string, string> = {
  a:"ɐ",b:"q",c:"ɔ",d:"p",e:"ǝ",f:"ɟ",g:"ƃ",h:"ɥ",i:"ᴉ",j:"ɾ",k:"ʞ",l:"l",m:"ɯ",n:"u",o:"o",p:"d",q:"b",r:"ɹ",s:"s",t:"ʇ",u:"n",v:"ʌ",w:"ʍ",x:"x",y:"ʎ",z:"z",
  A:"∀",B:"q",C:"Ɔ",D:"p",E:"Ǝ",F:"Ⅎ",G:"פ",H:"H",I:"I",J:"ɾ",K:"ʞ",L:"˥",M:"W",N:"N",O:"O",P:"Ԁ",Q:"Q",R:"ɹ",S:"S",T:"┴",U:"∩",V:"Λ",W:"M",X:"X",Y:"⅄",Z:"Z",
  "0":"0","1":"Ɩ","2":"ᄅ","3":"Ɛ","4":"ㄣ","5":"ϛ","6":"9","7":"ㄥ","8":"8","9":"6",
  ".":"˙",",":"'","?":"¿","!":"¡","\"":"„","'":"‚","(":")",")":"(","[":"]","]":"[","{":"}","}":"{","<":">",">":"<","&":"⅋"
};

export default function UpsideDownText() {
  const [input, setInput] = useState("");
  const result = input.split("").map(c => MAP[c] ?? c).reverse().join("");

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <ToolHeader title="Upside Down Text Generator" description="Flip your text upside down using Unicode characters." />
      <div>
        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-muted-foreground)" }}>Your Text</label>
        <textarea className="input-base h-28 text-lg resize-y" placeholder="Type something..." value={input} onChange={e => setInput(e.target.value)} />
      </div>
      {result && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Flipped</span>
            <CopyButton text={result} />
          </div>
          <p className="text-xl font-mono break-all" style={{ color: "var(--color-foreground)", direction: "ltr" }}>{result}</p>
        </div>
      )}
      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Works in most text fields, social media, and messaging apps.</p>
    </div>
  );
}
