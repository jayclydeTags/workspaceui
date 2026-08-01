"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"

import { BoardCard } from "@/registry/bases/base/workspaceui/board-card"
import { BoardColumn } from "@/registry/bases/base/workspaceui/board-column"

interface DemoTask {
  id: string
  title: string
  column: string
}

const COLUMN_LABEL: Record<string, string> = {
  todo: "Todo",
  doing: "Doing",
  done: "Done",
}

const INITIAL_COLUMNS = ["todo", "doing", "done"]

const INITIAL_TASKS: DemoTask[] = [
  { id: "1", title: "Write the docs", column: "todo" },
  { id: "2", title: "Record the demo", column: "todo" },
  { id: "3", title: "Ship the component", column: "doing" },
  { id: "4", title: "Announce the release", column: "done" },
]

export function BoardColumnDemo() {
  const [columns, setColumns] = React.useState(INITIAL_COLUMNS)
  const [tasks, setTasks] = React.useState(INITIAL_TASKS)
  const [activeTask, setActiveTask] = React.useState<DemoTask | null>(null)

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    if (!over || active.id === over.id) return
    const activeId = String(active.id)
    const overId = String(over.id)

    // Column ids and task ids share one DndContext, so tell them apart by
    // which list `active.id` belongs to before deciding what moved.
    if (columns.includes(activeId)) {
      setColumns((prev) =>
        arrayMove(prev, prev.indexOf(activeId), prev.indexOf(overId))
      )
      return
    }

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId)
      if (activeIndex === -1) return prev

      // Dropped on a column background (empty space) vs. on another task —
      // the latter is where in-column reordering comes from.
      const overIsColumn = columns.includes(overId)
      const overColumn = overIsColumn
        ? overId
        : prev.find((t) => t.id === overId)?.column
      if (!overColumn) return prev

      const withColumn =
        prev[activeIndex].column === overColumn
          ? prev
          : prev.map((t) =>
              t.id === activeId ? { ...t, column: overColumn } : t
            )

      const from = withColumn.findIndex((t) => t.id === activeId)
      const to = overIsColumn
        ? withColumn.length - 1
        : withColumn.findIndex((t) => t.id === overId)
      return arrayMove(withColumn, from, to)
    })
  }

  return (
    // dnd-kit's a11y ids (`DndDescribedBy-N`) fall back to a module-level
    // counter when no `id` is given — SSR and the client hydrate that counter
    // independently, so a page with more than one DndContext (or React
    // Strict Mode's double-invoke in dev) can land on different numbers and
    // trip a hydration mismatch. A stable `id` sidesteps the counter.
    <DndContext
      id="board-column-demo"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
        <div className="flex h-64 gap-4">
          {columns.map((column) => (
            <BoardColumn
              key={column}
              columnId={column}
              label={COLUMN_LABEL[column]}
              items={tasks.filter((t) => t.column === column)}
              getItemId={(task) => task.id}
              sortable
              renderItem={(task) => (
                <BoardCard itemId={task.id}>
                  <span className="font-medium">{task.title}</span>
                </BoardCard>
              )}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeTask && (
          <BoardCard itemId={activeTask.id} overlay>
            <span className="font-medium">{activeTask.title}</span>
          </BoardCard>
        )}
      </DragOverlay>
    </DndContext>
  )
}
