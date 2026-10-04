"use client"

import { useId } from "react"
import { DndContext } from "@dnd-kit/core"

import { defineStory } from "@/components/studio/studio"
import { BoardCard } from "@/registry/bases/base/workspaceui/board-card"

interface Args {
  title: string
  subtitle: string
  overlay: boolean
}

function Preview({ title, subtitle, overlay }: Args) {
  const id = useId()
  return (
    <DndContext id={id}>
      <BoardCard itemId="task-1" overlay={overlay} className="w-64">
        <span className="font-medium">{title}</span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </BoardCard>
    </DndContext>
  )
}

export default defineStory<Args>({
  args: {
    title: "Design the empty state",
    subtitle: "Due Friday",
    overlay: false,
  },
  controls: {
    title: { type: "text", description: "Card content (children)." },
    subtitle: { type: "text", description: "Card content (children)." },
    overlay: {
      group: "style",
      type: "boolean",
      description: "Static clone for a DragOverlay: no listeners.",
    },
  },
  preview: Preview,
})
