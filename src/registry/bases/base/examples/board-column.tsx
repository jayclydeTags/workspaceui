"use client"

import * as React from "react"

import { BoardCard } from "@/registry/bases/base/workspaceui/board-card"
import { BoardColumn } from "@/registry/bases/base/workspaceui/board-column"

interface DemoTask {
  id: string
  title: string
  column: "todo" | "done"
}

const INITIAL_TASKS: DemoTask[] = [
  { id: "1", title: "Write the docs", column: "todo" },
  { id: "2", title: "Ship the component", column: "done" },
]

export function BoardColumnDemo() {
  const [tasks, setTasks] = React.useState(INITIAL_TASKS)

  function move(id: string, column: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, column: column as DemoTask["column"] } : t
      )
    )
  }

  return (
    <div className="flex h-64 gap-4">
      {(["todo", "done"] as const).map((column) => (
        <BoardColumn
          key={column}
          columnId={column}
          label={column === "todo" ? "Todo" : "Done"}
          items={tasks.filter((t) => t.column === column)}
          getItemId={(task) => task.id}
          onDropItem={move}
          renderItem={(task) => (
            <BoardCard itemId={task.id}>
              <span className="font-medium">{task.title}</span>
            </BoardCard>
          )}
        />
      ))}
    </div>
  )
}
