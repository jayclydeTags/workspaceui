"use client"

import { MoreHorizontalIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
}: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id)
        e.dataTransfer.effectAllowed = "move"
      }}
      className="flex cursor-grab flex-col gap-2 rounded-lg border border-border bg-card p-3 text-sm shadow-xs active:cursor-grabbing"
    >
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
                <MoreHorizontalIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(task)}>
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
        <Badge variant={PRIORITY_VARIANT[task.priority]} className="shrink-0">
          {task.priority}
        </Badge>
      </div>

      {task.due && (
        <span className="text-xs tabular-nums text-muted-foreground">
          Due {task.due}
        </span>
      )}
    </div>
  )
}
