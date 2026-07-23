"use client"

import * as React from "react"
import { CheckCheck, ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  ALL_SEVERITIES,
  NOTIFICATIONS,
  type Notification,
  type NotificationSeverity,
} from "./data"
import { NotificationBell } from "./components/notification-bell"
import { NotificationItem, SEVERITY_META } from "./components/notification-item"

/** NFR-03. */
const PAGE_SIZE = 20

type ReadState = "all" | "unread" | "read"

const READ_STATES: { value: ReadState; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
]

export function NotificationCenter() {
  const [items, setItems] = React.useState<Notification[]>(NOTIFICATIONS)
  const [readState, setReadState] = React.useState<ReadState>("all")
  const [severities, setSeverities] = React.useState<Set<NotificationSeverity>>(
    new Set()
  )
  const [from, setFrom] = React.useState("")
  const [to, setTo] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [unavailableId, setUnavailableId] = React.useState<string | null>(null)

  const unread = items.filter((n) => !n.read).length

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  // Marks read, then "navigates" — a real portal would push entityRoute here.
  function select(item: Notification) {
    markRead(item.id)
    setUnavailableId(item.entityRoute ? null : item.id)
  }

  const filtered = React.useMemo(
    () =>
      items.filter((n) => {
        if (readState === "unread" && n.read) return false
        if (readState === "read" && !n.read) return false
        if (severities.size > 0 && !severities.has(n.severity)) return false
        // Date inputs are yyyy-mm-dd; ISO timestamps sort lexically against them.
        const day = n.createdAt.slice(0, 10)
        if (from && day < from) return false
        if (to && day > to) return false
        return true
      }),
    [items, readState, severities, from, to]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const hasFilters =
    readState !== "all" || severities.size > 0 || Boolean(from) || Boolean(to)

  function toggleSeverity(s: NotificationSeverity) {
    setPage(1)
    setSeverities((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
  }

  function clearFilters() {
    setReadState("all")
    setSeverities(new Set())
    setFrom("")
    setTo("")
    setPage(1)
  }

  return (
    <Page
      title="Notifications"
      subtitle={unread > 0 ? `${unread} unread` : "All caught up"}
      className="@container overflow-hidden"
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={markAllRead}
            disabled={unread === 0}
          >
            <CheckCheck data-icon="inline-start" />
            Mark all as read
          </Button>
          <NotificationBell
            items={items}
            unavailableId={unavailableId}
            onSelect={select}
            onMarkAllRead={markAllRead}
          />
        </div>
      }
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-wrap items-end gap-2 border-b px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 text-xs"
              )}
            >
              {READ_STATES.find((r) => r.value === readState)?.label}
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Read state</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={readState}
                  onValueChange={(v) => {
                    setReadState(v as ReadState)
                    setPage(1)
                  }}
                >
                  {READ_STATES.map((r) => (
                    <DropdownMenuRadioItem key={r.value} value={r.value}>
                      {r.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 text-xs"
              )}
            >
              Severity
              {severities.size > 0 && (
                <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px]">
                  {severities.size}
                </Badge>
              )}
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter by severity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_SEVERITIES.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={severities.has(s)}
                    onCheckedChange={() => toggleSeverity(s)}
                  >
                    {SEVERITY_META[s].label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ponytail: native date inputs — no picker dependency for a range. */}
          <div className="flex items-center gap-1.5">
            <Label htmlFor="notif-from" className="text-xs whitespace-nowrap">
              From
            </Label>
            <Input
              id="notif-from"
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => {
                setFrom(e.target.value)
                setPage(1)
              }}
              className="h-7 w-auto text-xs"
            />
            <Label htmlFor="notif-to" className="text-xs whitespace-nowrap">
              To
            </Label>
            <Input
              id="notif-to"
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => {
                setTo(e.target.value)
                setPage(1)
              }}
              className="h-7 w-auto text-xs"
            />
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground"
              onClick={clearFilters}
            >
              <X data-icon="inline-start" />
              Clear
            </Button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          {visible.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>
                  {hasFilters ? "No matches" : "You're all caught up"}
                </EmptyTitle>
                <EmptyDescription>
                  {hasFilters
                    ? "No notifications match your filters."
                    : "New alerts will show up here."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y">
              {visible.map((n) => (
                <NotificationItem
                  key={n.id}
                  item={n}
                  unavailable={unavailableId === n.id}
                  onSelect={select}
                />
              ))}
            </ul>
          )}
        </div>

        {/* ponytail: client-side state, so plain buttons — the Pagination
            primitive is anchor/href based. */}
        <nav
          aria-label="Notification pages"
          className={cn(
            "flex items-center justify-between gap-2 border-t px-4 py-2",
            filtered.length === 0 && "hidden"
          )}
        >
          <span className="text-xs text-muted-foreground">
            {filtered.length} notification{filtered.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </nav>
      </div>
    </Page>
  )
}
