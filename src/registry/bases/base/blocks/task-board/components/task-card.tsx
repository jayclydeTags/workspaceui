"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BoardCard } from "@/registry/bases/base/workspaceui/board-card"
import { StatusBadge } from "@/registry/bases/base/workspaceui/status-badge"
import { initials, type Task, type TaskPriority } from "../data"

const PRIORITY_VARIANT: Record<
  TaskPriority,
  "destructive" | "secondary" | "outline"
> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  overlay,
}: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  overlay?: boolean
}) {
  return (
    <BoardCard itemId={task.id} overlay={overlay}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{task.title}</span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="-mt-1 -mr-1 shrink-0"
                aria-label={`Actions for ${task.title}`}
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(task)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <Avatar size="sm">
              <AvatarFallback>{initials(task.assignee)}</AvatarFallback>
            </Avatar>
            <span>{task.assignee}</span>
          </div>
        ) : (
          <span className="text-xs">Unassigned</span>
        )}
        <StatusBadge
          status={task.priority}
          variantMap={PRIORITY_VARIANT}
          className="shrink-0"
        />
      </div>

      {task.due && (
        <span className="text-xs text-muted-foreground tabular-nums">
          Due {task.due}
        </span>
      )}
    </BoardCard>
  )
}
