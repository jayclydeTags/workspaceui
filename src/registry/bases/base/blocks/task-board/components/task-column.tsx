"use client"

import { BoardColumn } from "@/registry/bases/base/workspaceui/board-column"
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
  return (
    <BoardColumn
      columnId={status}
      label={STATUS_LABEL[status]}
      items={tasks}
      getItemId={(task) => task.id}
      onDropItem={(id, status) => onDropTask(id, status as TaskStatus)}
      emptyLabel="Drop a task here"
      renderItem={(task) => (
        <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
      )}
    />
  )
}
