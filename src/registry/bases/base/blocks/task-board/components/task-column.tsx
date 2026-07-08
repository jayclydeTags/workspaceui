"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { STATUS_LABEL, type Task, type TaskStatus } from "../data"
import { TaskCard } from "./task-card"

export function TaskColumn({
  status,
  tasks,
  onDropTask,
  onEdit,
  onDelete,
}: {
  status: TaskStatus
  tasks: Task[]
  onDropTask: (id: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}) {
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
        onDropTask(e.dataTransfer.getData("text/plain"), status)
      }}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-transparent bg-muted/30 p-3",
        isDragOver && "border-primary/50 bg-muted/60"
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-medium">{STATUS_LABEL[status]}</span>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Drop a task here
          </div>
        )}
      </div>
    </div>
  )
}
