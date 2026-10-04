"use client"

import { useId } from "react"
import { DndContext } from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"

import { defineStory } from "@/components/studio/studio"
import { BoardCard } from "@/registry/bases/base/workspaceui/board-card"
import { BoardColumn } from "@/registry/bases/base/workspaceui/board-column"

const TASKS = [
  "Write the docs",
  "Record the demo",
  "Ship the component",
  "Announce the release",
  "Collect feedback",
  "Plan the next release",
]

interface Args {
  label: string
  count: number
  emptyLabel: string
  sortable: boolean
}

function Preview({ label, count, emptyLabel, sortable }: Args) {
  const dndId = useId()
  const items = TASKS.slice(0, Math.min(Math.max(count, 0), TASKS.length)).map(
    (title, i) => ({ id: String(i), title })
  )
  return (
    <DndContext id={dndId}>
      <SortableContext
        items={["column"]}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex h-72">
          <BoardColumn
            columnId="column"
            label={label}
            items={items}
            getItemId={(task) => task.id}
            emptyLabel={emptyLabel || undefined}
            sortable={sortable}
            renderItem={(task) => (
              <BoardCard itemId={task.id}>
                <span className="font-medium">{task.title}</span>
              </BoardCard>
            )}
          />
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default defineStory<Args>({
  args: { label: "Todo", count: 3, emptyLabel: "", sortable: false },
  controls: {
    label: { type: "text" },
    count: {
      type: "number",
      label: "Items",
      min: 0,
      max: TASKS.length,
      description: "How many cards to render (playground only).",
    },
    emptyLabel: {
      type: "text",
      placeholder: "Shown when there are no items",
      description: "Try it with Items set to 0.",
    },
    sortable: {
      group: "style",
      type: "boolean",
      description: "Grip handle in the header to reorder columns.",
    },
  },
  preview: Preview,
})
