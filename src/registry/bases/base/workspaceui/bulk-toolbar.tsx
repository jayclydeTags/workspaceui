import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export interface BulkToolbarProps {
  count: number
  onClear: () => void
  children: React.ReactNode
  className?: string
}

/**
 * Contextual toolbar shown while rows are selected. Renders nothing when
 * `count` is 0, animating in/out via `motion`. Pass your bulk-action
 * buttons as children; pass `className` to control placement (e.g. floating
 * over a table) — it defaults to sitting inline wherever it's rendered.
 */
export function BulkToolbar({
  count,
  onClear,
  children,
  className,
}: BulkToolbarProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          role="toolbar"
          aria-label={`${count} selected`}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
          className={cn(
            "flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 shadow-lg",
            className
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear selection"
            onClick={onClear}
            className="text-background hover:bg-background/10 hover:text-background"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </Button>
          <span className="text-sm font-medium text-background">
            {count} selected
          </span>
          <Separator
            orientation="vertical"
            className="mx-1 h-5 bg-background/20 data-vertical:self-center"
          />
          <div className="flex items-center gap-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
