import { useState } from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

interface ComponentPreviewShellProps {
  children: React.ReactNode
  codeHtml: string
  code: string
  className?: string
}

export function ComponentPreviewShell({
  children,
  codeHtml,
  code,
  className,
}: ComponentPreviewShellProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview")

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-3">
        <button
          onClick={() => setTab("preview")}
          className={cn(
            "px-3 py-2.5 text-sm transition-colors",
            tab === "preview"
              ? "border-b-2 border-foreground font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Preview
        </button>
        <button
          onClick={() => setTab("code")}
          className={cn(
            "px-3 py-2.5 text-sm transition-colors",
            tab === "code"
              ? "border-b-2 border-foreground font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Code
        </button>
      </div>

      {tab === "preview" ? (
        <div className="flex min-h-[350px] items-center justify-center bg-background p-8">
          {children}
        </div>
      ) : (
        <div className="relative">
          <div
            className="max-h-[500px] overflow-auto p-4 text-sm [&_.shiki]:bg-transparent! [&_pre]:bg-transparent!"
            dangerouslySetInnerHTML={{ __html: codeHtml }}
          />
          <CopyButton value={code} className="absolute right-3 top-3" />
        </div>
      )}
    </div>
  )
}
