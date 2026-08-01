"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { cn } from "@/lib/utils"

export interface BoardCardProps extends React.ComponentProps<"div"> {
  itemId: string
  /** Renders the static clone used inside a DragOverlay — no listeners, and a distinct id so it doesn't collide with the real draggable. */
  overlay?: boolean
}

// useSortable (not useDraggable) makes a card a drop target at its own id
// too, so dropping one card on another reorders instead of only moving
// between columns. The in-column node stays at reduced opacity while
// dragging; the moving visual is this same card re-rendered with `overlay`
// inside the consumer's DragOverlay, since a scrolling column would clip it.
export function BoardCard({
  itemId,
  overlay,
  className,
  style,
  ...props
}: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: overlay ? `${itemId}::overlay` : itemId,
    disabled: overlay,
  })

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      data-overlay={overlay || undefined}
      {...(overlay ? undefined : listeners)}
      {...(overlay ? undefined : attributes)}
      style={{
        ...style,
        transform: overlay ? undefined : CSS.Transform.toString(transform),
        transition: overlay ? undefined : transition,
      }}
      className={cn(
        "flex cursor-grab flex-col gap-2 rounded-lg border border-border bg-card p-3 text-sm shadow-xs active:cursor-grabbing",
        isDragging && !overlay && "z-10 opacity-50",
        overlay && "cursor-grabbing shadow-lg",
        className
      )}
      {...props}
    />
  )
}
