"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
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
import { TaskCard } from "./components/task-card"
import { TaskColumn } from "./components/task-column"
import { TaskDialog } from "./components/task-dialog"

export function TaskBoard({ className }: { className?: string }) {
  const [tasks, setTasks] = React.useState<Task[]>(TASKS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Task | null>(null)
  const [deleting, setDeleting] = React.useState<Task | null>(null)
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  // Without a distance constraint, a pointerdown on a card's nested "Actions"
  // button also arms drag-start and swallows the click that opens the menu.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    if (!over || active.id === over.id) return
    const activeId = String(active.id)
    const overId = String(over.id)

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId)
      if (activeIndex === -1) return prev

      // Dropped on a column background (empty space) vs. on another task —
      // the latter is where in-column reordering comes from.
      const overIsColumn = STATUS_COLUMNS.includes(overId as TaskStatus)
      const overStatus = overIsColumn
        ? (overId as TaskStatus)
        : prev.find((t) => t.id === overId)?.status
      if (!overStatus) return prev

      const withStatus =
        prev[activeIndex].status === overStatus
          ? prev
          : prev.map((t) =>
              t.id === activeId ? { ...t, status: overStatus } : t
            )

      const from = withStatus.findIndex((t) => t.id === activeId)
      const to = overIsColumn
        ? withStatus.length - 1
        : withStatus.findIndex((t) => t.id === overId)
      return arrayMove(withStatus, from, to)
    })
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
      <DndContext
        id="task-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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
        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              overlay
            />
          )}
        </DragOverlay>
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
