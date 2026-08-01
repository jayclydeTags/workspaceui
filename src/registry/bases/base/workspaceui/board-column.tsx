"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface BoardColumnProps<TItem> {
  columnId: string
  label: string
  items: TItem[]
  getItemId: (item: TItem) => string
  renderItem: (item: TItem) => React.ReactNode
  emptyLabel?: string
  /** Rendered in the header after the count badge, before it's pushed right. */
  headerExtra?: React.ReactNode
  className?: string
}

// Drop handling lives one level up, in the DndContext.onDragEnd that wraps every
// BoardColumn — this only registers the drop target (columnId) and reflects hover.
export function BoardColumn<TItem>({
  columnId,
  label,
  items,
  getItemId,
  renderItem,
  emptyLabel = "Drop an item here",
  headerExtra,
  className,
}: BoardColumnProps<TItem>) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-transparent bg-muted/30 p-3",
        isOver && "border-primary/50 bg-muted/60",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="secondary">{items.length}</Badge>
        {headerExtra}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {items.map((item) => (
          <React.Fragment key={getItemId(item)}>
            {renderItem(item)}
          </React.Fragment>
        ))}
        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  )
}
