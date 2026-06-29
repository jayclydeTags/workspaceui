import * as React from "react"
import { ChevronDown, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ENTRIES, type ActionType, type StatusType } from "./data"
import { DataTable } from "./components/data-table"

const ALL_ACTIONS: ActionType[] = ["created", "updated", "deleted", "viewed", "shared", "exported"]
const ALL_STATUSES: StatusType[] = ["success", "failed", "pending"]

export function ActivityLog01() {
  const [search, setSearch] = React.useState("")
  const [actionFilter, setActionFilter] = React.useState<Set<ActionType>>(new Set())
  const [statusFilter, setStatusFilter] = React.useState<Set<StatusType>>(new Set())

  const filtered = React.useMemo(
    () =>
      ENTRIES.filter((e) => {
        if (search) {
          const q = search.toLowerCase()
          if (!e.user.toLowerCase().includes(q) && !e.resource.toLowerCase().includes(q)) return false
        }
        if (actionFilter.size > 0 && !actionFilter.has(e.action)) return false
        if (statusFilter.size > 0 && !statusFilter.has(e.status)) return false
        return true
      }),
    [search, actionFilter, statusFilter],
  )

  const hasFilters = search || actionFilter.size > 0 || statusFilter.size > 0

  function toggleAction(a: ActionType) {
    setActionFilter((prev) => {
      const n = new Set(prev)
      if (n.has(a)) n.delete(a); else n.add(a)
      return n
    })
  }

  function toggleStatus(s: StatusType) {
    setStatusFilter((prev) => {
      const n = new Set(prev)
      if (n.has(s)) n.delete(s); else n.add(s)
      return n
    })
  }

  return (
    <div className="@container flex h-full flex-col overflow-hidden">

      {/* ── Header + filters ── */}
      <div className="shrink-0 border-b border-border px-4 py-4 @sm:px-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold">Activity Log</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} events</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative min-w-0" style={{ flex: "1 1 160px" }}>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user or resource…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>

          {/* Action filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 gap-1.5 text-xs")}
            >
              Action
              {actionFilter.size > 0 && (
                <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px]">{actionFilter.size}</Badge>
              )}
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter by action</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_ACTIONS.map((a) => (
                  <DropdownMenuCheckboxItem
                    key={a}
                    checked={actionFilter.has(a)}
                    onCheckedChange={() => toggleAction(a)}
                    className="capitalize"
                  >
                    {a}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 gap-1.5 text-xs")}
            >
              Status
              {statusFilter.size > 0 && (
                <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px]">{statusFilter.size}</Badge>
              )}
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_STATUSES.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={statusFilter.has(s)}
                    onCheckedChange={() => toggleStatus(s)}
                    className="capitalize"
                  >
                    {s}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-muted-foreground"
              onClick={() => { setSearch(""); setActionFilter(new Set()); setStatusFilter(new Set()) }}
            >
              <X className="size-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* ── Data table ── */}
      <DataTable entries={filtered} />
    </div>
  )
}
