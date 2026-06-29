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

// ── Types ──────────────────────────────────────────────────────────────────

type ActionType = "created" | "updated" | "deleted" | "viewed" | "shared" | "exported"
type StatusType = "success" | "failed" | "pending"

interface ActivityEntry {
  id: string
  user: string
  initials: string
  action: ActionType
  resource: string
  resourceType: string
  status: StatusType
  timestamp: Date
}

// ── Mock data ──────────────────────────────────────────────────────────────

const NOW = new Date()
const ago = (mins: number) => new Date(NOW.getTime() - mins * 60_000)

const ENTRIES: ActivityEntry[] = [
  { id: "1",  user: "Alice Chen",     initials: "AC", action: "created",  resource: "Q4 Report",          resourceType: "Document", status: "success", timestamp: ago(2)   },
  { id: "2",  user: "Bob Martinez",   initials: "BM", action: "deleted",  resource: "Old Backup",         resourceType: "File",     status: "success", timestamp: ago(8)   },
  { id: "3",  user: "Diana Park",     initials: "DP", action: "updated",  resource: "Website Redesign",   resourceType: "Project",  status: "success", timestamp: ago(14)  },
  { id: "4",  user: "Eve Johnson",    initials: "EJ", action: "exported", resource: "Sales Summary",      resourceType: "Report",   status: "pending", timestamp: ago(22)  },
  { id: "5",  user: "Charlie Kim",    initials: "CK", action: "shared",   resource: "Invoice #1042",      resourceType: "Invoice",  status: "success", timestamp: ago(35)  },
  { id: "6",  user: "Alice Chen",     initials: "AC", action: "viewed",   resource: "Fix navbar bug",     resourceType: "Task",     status: "success", timestamp: ago(41)  },
  { id: "7",  user: "Bob Martinez",   initials: "BM", action: "updated",  resource: "john@acme.com",      resourceType: "User",     status: "failed",  timestamp: ago(56)  },
  { id: "8",  user: "Diana Park",     initials: "DP", action: "created",  resource: "Sprint 12 Plan",     resourceType: "Document", status: "success", timestamp: ago(72)  },
  { id: "9",  user: "Eve Johnson",    initials: "EJ", action: "deleted",  resource: "Draft Campaign",     resourceType: "Document", status: "success", timestamp: ago(88)  },
  { id: "10", user: "Charlie Kim",    initials: "CK", action: "exported", resource: "Monthly KPIs",       resourceType: "Report",   status: "failed",  timestamp: ago(104) },
  { id: "11", user: "Alice Chen",     initials: "AC", action: "shared",   resource: "Onboarding Guide",   resourceType: "Document", status: "success", timestamp: ago(130) },
  { id: "12", user: "Bob Martinez",   initials: "BM", action: "created",  resource: "API Token",          resourceType: "Resource", status: "success", timestamp: ago(158) },
  { id: "13", user: "Diana Park",     initials: "DP", action: "viewed",   resource: "Admin Settings",     resourceType: "Settings", status: "success", timestamp: ago(200) },
  { id: "14", user: "Eve Johnson",    initials: "EJ", action: "updated",  resource: "Q3 Report",          resourceType: "Document", status: "pending", timestamp: ago(240) },
  { id: "15", user: "Charlie Kim",    initials: "CK", action: "deleted",  resource: "Test Environment",   resourceType: "Project",  status: "success", timestamp: ago(310) },
  { id: "16", user: "Alice Chen",     initials: "AC", action: "exported", resource: "User List",          resourceType: "Report",   status: "success", timestamp: ago(380) },
  { id: "17", user: "Bob Martinez",   initials: "BM", action: "created",  resource: "Bug Report #88",     resourceType: "Task",     status: "success", timestamp: ago(440) },
  { id: "18", user: "Diana Park",     initials: "DP", action: "shared",   resource: "Brand Assets",       resourceType: "File",     status: "failed",  timestamp: ago(510) },
]

const ALL_ACTIONS: ActionType[] = ["created", "updated", "deleted", "viewed", "shared", "exported"]
const ALL_STATUSES: StatusType[] = ["success", "failed", "pending"]

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return date.toLocaleDateString()
}

const STATUS_VARIANT: Record<StatusType, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  failed: "destructive",
  pending: "secondary",
}

const ACTION_CLASS: Record<ActionType, string> = {
  created:  "text-emerald-600 dark:text-emerald-400",
  updated:  "text-blue-600 dark:text-blue-400",
  deleted:  "text-red-600 dark:text-red-400",
  viewed:   "text-muted-foreground",
  shared:   "text-violet-600 dark:text-violet-400",
  exported: "text-amber-600 dark:text-amber-400",
}

// ── Component ──────────────────────────────────────────────────────────────

export function ActivityLog01() {
  const [search, setSearch] = React.useState("")
  const [actionFilter, setActionFilter] = React.useState<Set<ActionType>>(new Set())
  const [statusFilter, setStatusFilter] = React.useState<Set<StatusType>>(new Set())

  const filtered = React.useMemo(() => ENTRIES.filter((e) => {
    if (search) {
      const q = search.toLowerCase()
      if (!e.user.toLowerCase().includes(q) && !e.resource.toLowerCase().includes(q)) return false
    }
    if (actionFilter.size > 0 && !actionFilter.has(e.action)) return false
    if (statusFilter.size > 0 && !statusFilter.has(e.status)) return false
    return true
  }), [search, actionFilter, statusFilter])

  const hasFilters = search || actionFilter.size > 0 || statusFilter.size > 0

  function toggleAction(a: ActionType) {
    setActionFilter((prev) => { const n = new Set(prev); n.has(a) ? n.delete(a) : n.add(a); return n })
  }

  function toggleStatus(s: StatusType) {
    setStatusFilter((prev) => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n })
  }

  return (
    // @container responds to the frame/pane width instead of viewport
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

      {/* ── Table (≥ @sm container width) ── */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-background">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-6 py-2.5 font-medium">User</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
                <th className="hidden px-4 py-2.5 font-medium @md:table-cell">Resource</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="pr-6 py-2.5 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-muted/40">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={e.initials} />
                      <span className="font-medium">{e.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("capitalize", ACTION_CLASS[e.action])}>{e.action}</span>
                  </td>
                  <td className="hidden px-4 py-3 @md:table-cell">
                    <p className="max-w-[200px] truncate">{e.resource}</p>
                    <p className="text-xs text-muted-foreground">{e.resourceType}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[e.status]} className="capitalize text-[11px]">
                      {e.status}
                    </Badge>
                  </td>
                  <td className="pr-6 py-3 text-right text-xs text-muted-foreground">
                    {formatTime(e.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Card list (< @sm container width) ── */}
      <div className="flex-1 overflow-auto @sm:hidden">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((e) => (
              <li key={e.id} className="flex gap-3 px-4 py-3">
                <Avatar initials={e.initials} className="mt-0.5 size-8 text-xs" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{e.user}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatTime(e.timestamp)}</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs">
                    <span className={cn("capitalize", ACTION_CLASS[e.action])}>{e.action}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="truncate text-muted-foreground">{e.resource}</span>
                  </div>
                  <div className="mt-1.5">
                    <Badge variant={STATUS_VARIANT[e.status]} className="capitalize text-[10px]">
                      {e.status}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ── Small helpers ──────────────────────────────────────────────────────────

function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground",
        className,
      )}
    >
      {initials}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
      No matching events
    </div>
  )
}
