import * as React from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

/**
 * Contextual toolbar shown while rows are selected. Renders nothing when
 * `count` is 0. Pass your bulk-action buttons as children.
 */
export function BulkToolbar({
  count,
  onClear,
  children,
}: {
  count: number
  onClear: () => void
  children: React.ReactNode
}) {
  if (count === 0) return null

  return (
    <div
      role="toolbar"
      aria-label={`${count} selected`}
      className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Clear selection"
        onClick={onClear}
      >
        <XIcon />
      </Button>
      <span className="text-sm font-medium">{count} selected</span>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}
