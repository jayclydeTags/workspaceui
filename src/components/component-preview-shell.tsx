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
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-2.5 text-sm capitalize transition-colors",
              tab === t
                ? "border-b-2 border-foreground font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div
          className="flex min-h-[350px] items-center justify-center p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {children}
        </div>
      ) : (
        <div className="group relative">
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
