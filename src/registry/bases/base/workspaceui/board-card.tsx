"use client"

import * as React from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import { cn } from "@/lib/utils"

export interface BoardCardProps extends React.ComponentProps<"div"> {
  itemId: string
}

// useDraggable's `attributes` (role="button", tabIndex, aria-roledescription) plus its
// pointer/keyboard sensors are what raw HTML5 `draggable` doesn't give you for free:
// keyboard-driven dragging and touch support.
export function BoardCard({
  itemId,
  className,
  style,
  ...props
}: BoardCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: itemId })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ ...style, transform: CSS.Translate.toString(transform) }}
      className={cn(
        "flex cursor-grab flex-col gap-2 rounded-lg border border-border bg-card p-3 text-sm shadow-xs active:cursor-grabbing",
        isDragging && "opacity-50",
        className
      )}
      {...props}
    />
  )
}
