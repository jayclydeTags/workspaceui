"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  MEMBERS,
  emptyFilters,
  filterMembers,
  type Filters,
} from "./data"
import { FilterBar } from "./components/filter-bar"

export function SearchFilterBar() {
  const [filters, setFilters] = React.useState<Filters>(emptyFilters)
  const results = filterMembers(MEMBERS, filters)

  return (
    <Page
      title="Members"
      subtitle={`${results.length} of ${MEMBERS.length} members`}
      hasPadding
    >
      <div className="flex flex-col gap-4">
        <FilterBar filters={filters} onChange={setFilters} />

        {results.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No members match</EmptyTitle>
              <EmptyDescription>
                Try a different search or clear the filters.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="divide-y divide-border rounded-md border">
            {results.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {m.role}
                  </Badge>
                  <Badge
                    variant={m.status === "suspended" ? "destructive" : "secondary"}
                    className="capitalize"
                  >
                    {m.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  )
}
