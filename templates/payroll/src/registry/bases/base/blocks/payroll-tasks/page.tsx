"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  countByStatus,
  STATUS_LABEL,
  STATUS_VARIANT,
  TASKS,
  type PayrollTask,
  type TaskStatus,
} from "./data"

const STATUS_FILTERS: (TaskStatus | "all")[] = [
  "all",
  "pending",
  "overdue",
  "completed",
]

export function PayrollTasks() {
  const [tasks, setTasks] = React.useState<PayrollTask[]>(TASKS)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "all">(
    "all"
  )
  const [active, setActive] = React.useState<PayrollTask | null>(null)
  const [summary, setSummary] = React.useState("")

  const counts = countByStatus(tasks)

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !t.title.toLowerCase().includes(q) &&
        !t.employee.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  function openComplete(task: PayrollTask) {
    setActive(task)
    setSummary(task.summary ?? "")
  }

  function confirmComplete() {
    if (!active || !summary.trim()) return // summary required
    setTasks((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? { ...t, status: "completed", summary: summary.trim() }
          : t
      )
    )
    setActive(null)
  }

  return (
    <Page
      title="Payroll Tasks"
      subtitle={`${filtered.length} of ${tasks.length} tasks`}
      hasPadding
    >
      <div className="flex flex-col gap-6">
        {/* ── Overview cards ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <OverviewCard label="Pending" value={counts.pending} />
          <OverviewCard label="Overdue" value={counts.overdue} />
          <OverviewCard label="Completed" value={counts.completed} />
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2">
          <InputGroup className="h-9 min-w-0 text-sm" style={{ flex: "1 1 200px" }}>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search task or employee…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}
          >
            <SelectTrigger className="h-9 w-[150px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s === "all" ? "All statuses" : STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Task list ── */}
        {filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No matching tasks</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.employee}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.dueDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[t.status]}>
                      {STATUS_LABEL[t.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Conditional button: only incomplete tasks can be completed. */}
                    {t.status === "completed" ? (
                      <span className="text-xs text-muted-foreground">Done</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openComplete(t)}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ── Complete dialog ── */}
      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete task</DialogTitle>
            <DialogDescription>{active?.title}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-summary">Summary</Label>
            <Textarea
              id="task-summary"
              placeholder="What was done to complete this task?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setActive(null)}>
              Cancel
            </Button>
            {/* Conditional: disabled until a summary is entered. */}
            <Button onClick={confirmComplete} disabled={!summary.trim()}>
              Mark complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  )
}

function OverviewCard({ label, value }: { label: string; value: number }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tracking-tight">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
