"use client"

import * as React from "react"
import { ListChecks } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { TASKS, type TaskStatus } from "./data"

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
}

const STATUS_VARIANT: Record<
  TaskStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  todo: "outline",
  "in-progress": "secondary",
  done: "secondary",
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

export function MasterDetail() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const selected = TASKS.find((t) => t.id === selectedId) ?? null

  return (
    <Page
      title="Tasks"
      subtitle={`${TASKS.length} tasks`}
      className="@container overflow-hidden"
    >
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        <ResizablePanel defaultSize={38} minSize={26} className="overflow-auto">
          <ul className="divide-y">
            {TASKS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-accent",
                    t.id === selectedId && "bg-accent"
                  )}
                >
                  <span className="truncate text-sm font-medium">
                    {t.title}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    {t.assignee}
                    <Badge variant={STATUS_VARIANT[t.status]} className="text-[10px]">
                      {STATUS_LABEL[t.status]}
                    </Badge>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={62} minSize={30} className="overflow-auto">
          {selected ? (
            <div className="flex flex-col gap-6 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{selected.title}</h2>
                  <Badge variant={STATUS_VARIANT[selected.status]}>
                    {STATUS_LABEL[selected.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selected.description}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <DetailField label="Assignee" value={selected.assignee} />
                <DetailField label="Due date" value={selected.dueDate} />
                <DetailField
                  label="Status"
                  value={STATUS_LABEL[selected.status]}
                />
              </dl>
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListChecks />
                </EmptyMedia>
                <EmptyTitle>No task selected</EmptyTitle>
                <EmptyDescription>
                  Select a task from the list to view its details.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </Page>
  )
}
