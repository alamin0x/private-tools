import { Check, Copy } from "lucide-react"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

interface CopyButtonProps {
  text: string
  className?: string
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <button
      onClick={() => copy(text)}
      className={`copy-btn ${copied ? "copied" : ""} ${className}`}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied
        ? <Check className="h-3 w-3" />
        : <Copy className="h-3 w-3" />
      }
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

export { CopyButton }
