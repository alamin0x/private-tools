import { useState } from "react"
import ToolHeader from "@/components/tool-header"

const EMOJIS: Record<string, string[]> = {
  "😀 Smileys": ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","💫","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  "🙌 Gestures": ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🫀","🫁","🧠","🦷","🦴","👀","👁️","👅","👄","💋"],
  "🐶 Animals": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐒","🦆","🐦","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🦭","🐊","🐅","🐆","🦓","🦍","🦧","🦣","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🪶","🐓","🦃","🦤","🦚","🦜","🦢","🦩","🕊️","🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿️","🦔"],
  "🍕 Food": ["🍎","🍊","🍋","🍇","🍓","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🫛","🥦","🥬","🥒","🌶️","🫑","🌽","🥕","🧄","🧅","🥔","🍠","🫘","🌰","🥜","🍞","🥐","🥖","🥨","🥯","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🥘","🫕","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥮","🍢","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🧃","🥤","🧋","☕","🫖","🍵","🧉","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧊"],
  "⚽ Sports": ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🏓","🏸","🏒","🥍","🏑","🥅","⛳","🪃","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🏇","⛷️","🏄","🚣","🧘","🛤️"],
  "💻 Tech": ["💻","🖥️","🖨️","⌨️","🖱️","🖲️","💽","💾","💿","📀","📱","☎️","📞","📟","📠","📺","📷","📸","📹","🎥","📡","🔋","🪫","🔌","💡","🔦","🕯️","🪔","🧲","🔭","🔬","🩺","💊","🩹","🩻","🧪","🧫","🧬","⚗️","🔮","🧿","🪬","🪄","🎭","🎪","🎨","🖼️","🎬","🎤","🎧","🎼","🎵","🎶","🎷","🎸","🎹","🎺","🎻","🥁","🪘","🎲","♟️","🎯","🎳","🎮","🕹️"],
}

export default function EmojiPicker() {
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState("")
  const [activeGroup, setActiveGroup] = useState(Object.keys(EMOJIS)[0])

  const filtered = search
    ? Array.from(new Set(
        Object.entries(EMOJIS).reduce((acc, [group, list]) => {
          if (group.toLowerCase().includes(search.toLowerCase())) {
            return [...acc, ...list]
          }
          return [...acc, ...list.filter(e => e.includes(search))]
        }, [] as string[])
      ))
    : EMOJIS[activeGroup] || []

  function copy(emoji: string) {
    navigator.clipboard.writeText(emoji)
    setCopied(emoji)
    setTimeout(() => setCopied(""), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="Emoji Picker" description="Browse and copy emojis from any category." />

      <input className="input-base" placeholder="Search emojis…" value={search} onChange={e => setSearch(e.target.value)} />

      {!search && (
        <div className="flex flex-wrap gap-2">
          {Object.keys(EMOJIS).map(group => (
            <button key={group} onClick={() => setActiveGroup(group)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={activeGroup === group ? { background: "linear-gradient(135deg,#7c5af3,#4f8ef7)", color: "#fff" } : { background: "var(--color-surface-2)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
              {group}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="grid grid-cols-10 gap-1 max-h-64 overflow-y-auto">
          {filtered.map((emoji, i) => (
            <button key={i} onClick={() => copy(emoji)}
              className="text-2xl p-1.5 rounded-lg text-center hover:scale-125 transition-all duration-150"
              style={{ background: copied === emoji ? "rgba(124,90,243,0.2)" : "transparent" }}
              title={emoji}>
              {emoji}
            </button>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-sm py-8" style={{ color: "var(--color-muted-foreground)" }}>No emojis found</p>}
      </div>

      {copied && (
        <div className="text-center py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(124,90,243,0.15)", color: "var(--color-primary-light)" }}>
          ✓ Copied {copied} to clipboard!
        </div>
      )}
    </div>
  )
}
