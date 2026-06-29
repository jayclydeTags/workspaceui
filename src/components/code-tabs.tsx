import { useState } from "react"

import { cn } from "@/lib/utils"
import { InlineCode } from "@/components/code-block"

interface CodeTabsProps {
  cli: string
  manual: React.ReactNode
  className?: string
}

export function CodeTabs({ cli, manual, className }: CodeTabsProps) {
  const [tab, setTab] = useState<"cli" | "manual">("cli")

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-1 border-b border-border">
        {(["cli", "manual"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-2 text-sm capitalize transition-colors",
              tab === t
                ? "border-b-2 border-foreground font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "cli" ? "CLI" : "Manual"}
          </button>
        ))}
      </div>
      {tab === "cli" ? <InlineCode code={cli} /> : manual}
    </div>
  )
}
