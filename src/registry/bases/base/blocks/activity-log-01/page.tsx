"use client"

import * as React from "react"
import { ChevronDown, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { ENTRIES, type ActionType, type StatusType } from "./data"
import { DataTable } from "./components/data-table"

const ALL_ACTIONS: ActionType[] = ["created", "updated", "deleted", "viewed", "shared", "exported"]
const ALL_STATUSES: StatusType[] = ["success", "failed", "pending"]
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

export function ActivityLog01() {
  const [search, setSearch] = React.useState("")
  const [actionFilter, setActionFilter] = React.useState<Set<ActionType>>(new Set())
  const [statusFilter, setStatusFilter] = React.useState<Set<StatusType>>(new Set())
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState<number>(10)

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const hasFilters = search || actionFilter.size > 0 || statusFilter.size > 0

  function toggleAction(a: ActionType) {
    setPage(1)
    setActionFilter((prev) => {
      const n = new Set(prev)
      if (n.has(a)) n.delete(a); else n.add(a)
      return n
    })
  }

  function toggleStatus(s: StatusType) {
    setPage(1)
    setStatusFilter((prev) => {
      const n = new Set(prev)
      if (n.has(s)) n.delete(s); else n.add(s)
      return n
    })
  }

  return (
    <Page
      title="Activity Log"
      subtitle={`${filtered.length} events`}
      className="@container overflow-hidden"
      actions={
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <InputGroup className="h-8 min-w-0 text-sm" style={{ flex: "1 1 160px" }}>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search user or resource…"
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
            />
          </InputGroup>

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
              onClick={() => {
                setPage(1)
                setSearch("")
                setActionFilter(new Set())
                setStatusFilter(new Set())
              }}
            >
              <X data-icon="inline-start" />
              Clear
            </Button>
          )}
        </div>
      }
    >
      <div className="flex h-full flex-col">
        {/* ── Data table ── */}
        <DataTable entries={paged} />

        {/* ── Pagination ── */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Rows per page
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPage(1)
                setPageSize(Number(v))
              }}
            >
              <SelectTrigger size="sm" className="h-8 w-[70px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    isActive={n === currentPage}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(n)
                    }}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(totalPages, p + 1))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Page>
  )
}
