import { useRef, useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

export function MdxPre({ className, children, ...props }: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null)
  const [rawText, setRawText] = useState("")

  useEffect(() => {
    setRawText(ref.current?.textContent ?? "")
  }, [])

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
      <div className="relative">
        <pre
          ref={ref}
          className={cn(
            "overflow-x-auto p-4 text-sm bg-transparent!",
            className,
          )}
          {...props}
        >
          {children}
        </pre>
        <CopyButton value={rawText} className="absolute right-3 top-3" />
      </div>
    </div>
  )
}
