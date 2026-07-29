"use client"

import * as React from "react"
import {
  type ColumnFiltersState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  DataFilterChips,
  DataFilterPopover,
} from "@/registry/bases/base/workspaceui/data-filter"
import { DataPagination } from "@/registry/bases/base/workspaceui/data-pagination"
import {
  DataSearch,
  dataGridGetColumnCanGlobalFilter,
  dataGridGlobalFilterFn,
} from "@/registry/bases/base/workspaceui/data-search"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { ENTRIES } from "./data"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export function ActivityLog() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  // useReactTable() intentionally returns fresh functions each render.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: ENTRIES,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    globalFilterFn: dataGridGlobalFilterFn,
    getColumnCanGlobalFilter: dataGridGetColumnCanGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters },
  })

  return (
    <Page
      title="Activity Log"
      subtitle={`${ENTRIES.length} events`}
      className="@container overflow-hidden"
      hasPadding
    >
      <div className="flex h-full flex-col gap-2">
        {/* Popover + chips rather than <DataFilter>: that wrapper measures its
            own container to pick a drawer, which a content-width toolbar slot
            can't give it. */}
        <div className="flex shrink-0 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <DataSearch table={table} placeholder="Search user or resource…" />
            <DataFilterPopover
              table={table}
              trigger={
                <Button variant="outline" size="sm" className="ms-auto">
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  Filter
                </Button>
              }
            />
          </div>
          <DataFilterChips table={table} />
        </div>
        {/* Only the rows sit inside the border — toolbar and pagination don't. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border">
          <DataTable table={table} />
        </div>
        <DataPagination table={table} className="shrink-0" />
      </div>
    </Page>
  )
}
