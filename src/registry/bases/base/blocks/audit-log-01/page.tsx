"use client"

import * as React from "react"
import { ArrowRight, ChevronDown, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { ALL_ACTIONS, ENTRIES, type AuditAction } from "./data"

const ACTION_VARIANT: Record<
  AuditAction,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  created: "secondary",
  updated: "outline",
  deleted: "destructive",
}

export function AuditLog01() {
  const [search, setSearch] = React.useState("")
  const [actionFilter, setActionFilter] = React.useState<Set<AuditAction>>(
    new Set()
  )

  const filtered = React.useMemo(
    () =>
      ENTRIES.filter((e) => {
        if (search) {
          const q = search.toLowerCase()
          if (
            !e.actor.toLowerCase().includes(q) &&
            !e.record.toLowerCase().includes(q) &&
            !e.field.toLowerCase().includes(q)
          )
            return false
        }
        if (actionFilter.size > 0 && !actionFilter.has(e.action)) return false
        return true
      }),
    [search, actionFilter]
  )

  const hasFilters = search || actionFilter.size > 0

  function toggleAction(a: AuditAction) {
    setActionFilter((prev) => {
      const n = new Set(prev)
      if (n.has(a)) n.delete(a)
      else n.add(a)
      return n
    })
  }

  return (
    <Page
      title="Audit Log"
      subtitle={`${filtered.length} changes`}
      className="@container overflow-hidden"
      actions={
        <div className="flex flex-wrap gap-2">
          <InputGroup
            className="h-8 min-w-0 text-sm"
            style={{ flex: "1 1 160px" }}
          >
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search actor, record, field…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 gap-1.5 text-xs"
              )}
            >
              Action
              {actionFilter.size > 0 && (
                <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px]">
                  {actionFilter.size}
                </Badge>
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

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-muted-foreground"
              onClick={() => {
                setSearch("")
                setActionFilter(new Set())
              }}
            >
              <X data-icon="inline-start" />
              Clear
            </Button>
          )}
        </div>
      }
    >
      <div className="flex h-full flex-col overflow-auto">
        {filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No changes</EmptyTitle>
              <EmptyDescription>
                No audit entries match your filters.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Change</TableHead>
                <TableHead className="w-24">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                    {e.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">
                          {e.actorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="whitespace-nowrap">{e.actor}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{e.record}</TableCell>
                  <TableCell className="font-mono text-xs">{e.field}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground line-through">
                        {e.before ?? "∅"}
                      </span>
                      <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                      <span className="font-medium">{e.after ?? "∅"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ACTION_VARIANT[e.action]}
                      className="capitalize"
                    >
                      {e.action}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Page>
  )
}
