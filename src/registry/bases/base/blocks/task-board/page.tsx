"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  STATUS_COLUMNS,
  TASKS,
  completion,
  type Task,
  type TaskDraft,
  type TaskStatus,
} from "./data"
import { TaskColumn } from "./components/task-column"
import { TaskDialog } from "./components/task-dialog"

export function TaskBoard({ className }: { className?: string }) {
  const [tasks, setTasks] = React.useState<Task[]>(TASKS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Task | null>(null)
  const [deleting, setDeleting] = React.useState<Task | null>(null)

  function move(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  function save(draft: TaskDraft) {
    if (editing) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...t, ...draft } : t))
      )
    } else {
      setTasks((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setTasks((prev) => prev.filter((t) => t.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Tasks"
      subtitle={`${tasks.length} tasks · ${completion(tasks)}% done`}
      className={cn("@container overflow-hidden", className)}
      hasPadding
      actions={
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <PlusIcon data-icon="inline-start" />
          New task
        </Button>
      }
    >
      <div className="flex h-full gap-4">
        {STATUS_COLUMNS.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onDropTask={move}
            onEdit={(task) => {
              setEditing(task)
              setFormOpen(true)
            }}
            onDelete={setDeleting}
          />
        ))}
      </div>

      <TaskDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSubmit={save}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.title}</span>? This
              action can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
