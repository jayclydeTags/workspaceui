"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface BoardCardProps extends React.ComponentProps<"div"> {
  itemId: string
}

// ponytail: HTML5 DnD (dataTransfer, draggable) rather than a DnD library — the board
// blocks only need single-item move-between-columns, not reordering/multi-select drag.
// Swap for @dnd-kit if that's ever needed.
export function BoardCard({
  itemId,
  className,
  onDragStart,
  ...props
}: BoardCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", itemId)
        e.dataTransfer.effectAllowed = "move"
        onDragStart?.(e)
      }}
      className={cn(
        "flex cursor-grab flex-col gap-2 rounded-lg border border-border bg-card p-3 text-sm shadow-xs active:cursor-grabbing",
        className
      )}
      {...props}
    />
  )
}
