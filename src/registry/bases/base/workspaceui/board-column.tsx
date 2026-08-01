"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface BoardColumnProps<TItem> {
  columnId: string
  label: string
  items: TItem[]
  getItemId: (item: TItem) => string
  renderItem: (item: TItem) => React.ReactNode
  onDropItem: (itemId: string, columnId: string) => void
  emptyLabel?: string
  className?: string
}

export function BoardColumn<TItem>({
  columnId,
  label,
  items,
  getItemId,
  renderItem,
  onDropItem,
  emptyLabel = "Drop an item here",
  className,
}: BoardColumnProps<TItem>) {
  const [isDragOver, setIsDragOver] = React.useState(false)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        onDropItem(e.dataTransfer.getData("text/plain"), columnId)
      }}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-transparent bg-muted/30 p-3",
        isDragOver && "border-primary/50 bg-muted/60",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="secondary">{items.length}</Badge>
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
