"use client"

import * as React from "react"
import {
  ChevronDown,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { ENTRIES, STATS, type ActivityEntry, type ActivityType } from "./data"

const ALL_TYPES: ActivityType[] = [
  "updated",
  "created",
  "assigned",
  "commented",
  "deleted",
]

const TYPE_ICON: Record<
  ActivityType,
  React.ComponentType<{ className?: string }>
> = {
  updated: Pencil,
  created: Plus,
  assigned: UserPlus,
  commented: MessageSquare,
  deleted: Trash2,
}

function groupLabel(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60_000))
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function timeAgo(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / (60 * 60_000))
  if (hours < 1) return "just now"
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

export function ActivityFeed() {
  const [typeFilter, setTypeFilter] = React.useState<ActivityType | "all">(
    "all"
  )
  const [userFilter, setUserFilter] = React.useState<string>("all")

  const users = React.useMemo(
    () => Array.from(new Set(ENTRIES.map((e) => e.user))),
    []
  )

  const filtered = React.useMemo(
    () =>
      ENTRIES.filter((e) => {
        if (typeFilter !== "all" && e.type !== typeFilter) return false
        if (userFilter !== "all" && e.user !== userFilter) return false
        return true
      }),
    [typeFilter, userFilter]
  )

  const groups = React.useMemo(() => {
    const map = new Map<string, ActivityEntry[]>()
    for (const entry of filtered) {
      const label = groupLabel(entry.timestamp)
      const list = map.get(label) ?? []
      list.push(entry)
      map.set(label, list)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <Page
      title="Activity Feed"
      subtitle="Track changes across your workspace"
      actions={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 w-28 justify-between gap-2 shadow-xs"
              )}
            >
              <span className="capitalize">
                {typeFilter === "all" ? "All Types" : typeFilter}
              </span>
              <ChevronDown className="opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={typeFilter}
                  onValueChange={(v) =>
                    setTypeFilter(v as ActivityType | "all")
                  }
                >
                  <DropdownMenuRadioItem value="all">
                    All Types
                  </DropdownMenuRadioItem>
                  {ALL_TYPES.map((t) => (
                    <DropdownMenuRadioItem
                      key={t}
                      value={t}
                      className="capitalize"
                    >
                      {t}
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
                "h-9 w-28 justify-between gap-2 shadow-xs"
              )}
            >
              <span className="truncate">
                {userFilter === "all" ? "All users" : userFilter}
              </span>
              <ChevronDown className="opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter by user</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={userFilter}
                  onValueChange={setUserFilter}
                >
                  <DropdownMenuRadioItem value="all">
                    All users
                  </DropdownMenuRadioItem>
                  {users.map((u) => (
                    <DropdownMenuRadioItem key={u} value={u}>
                      {u}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
      className="overflow-hidden"
    >
      <div className="flex h-full flex-col">
        {/* ── Grouped entries ── */}
        <div className="flex-1 overflow-auto">
          {groups.length === 0 && (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No matching activity
            </div>
          )}
          {groups.map(([label, entries]) => (
            <div key={label}>
              <div className="bg-muted/30 px-4 py-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  {label}
                </span>
              </div>
              {entries.map((entry, i) => (
                <div key={entry.id} className="flex gap-3 px-4 py-3">
                  <div className="relative flex shrink-0 flex-col items-center">
                    <EntryIcon entry={entry} />
                    {i < entries.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="text-sm">{entry.title}</p>
                    {entry.detail && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {entry.detail}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground/70">
                      {timeAgo(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Stats + load more ── */}
        <div className="flex shrink-0 items-center gap-4 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
          <span>Today {STATS.today}</span>
          <span className="size-1 shrink-0 rounded-full bg-border" />
          <span>This week {STATS.thisWeek}</span>
          <span className="size-1 shrink-0 rounded-full bg-border" />
          <span>This month {STATS.thisMonth}</span>
        </div>
        <div className="shrink-0 px-4 py-2">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            <ChevronDown data-icon="inline-start" />
            Load More
          </Button>
        </div>
      </div>
    </Page>
  )
}

function EntryIcon({ entry }: { entry: ActivityEntry }) {
  const Icon = TYPE_ICON[entry.type]
  return (
    <Avatar>
      {entry.avatarUrl && (
        <AvatarImage src={entry.avatarUrl} alt={entry.user} />
      )}
      <AvatarFallback>
        <Icon className="size-4" />
      </AvatarFallback>
    </Avatar>
  )
}
