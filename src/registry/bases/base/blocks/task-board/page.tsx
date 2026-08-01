"use client"

import * as React from "react"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

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
  // Without a distance constraint, a pointerdown on a card's nested "Actions"
  // button also arms drag-start and swallows the click that opens the menu.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function move(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    move(String(active.id), over.id as TaskStatus)
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
          <HugeiconsIcon
            icon={PlusSignIcon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          New task
        </Button>
      }
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex h-full gap-4">
          {STATUS_COLUMNS.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onEdit={(task) => {
                setEditing(task)
                setFormOpen(true)
              }}
              onDelete={setDeleting}
            />
          ))}
        </div>
      </DndContext>

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
              Delete <span className="font-medium">{deleting?.title}</span>?
              This action can&apos;t be undone.
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
