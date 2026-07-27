"use client"

import * as React from "react"
import type {
  Column,
  FilterFn,
  Table as TanstackTable,
} from "@tanstack/react-table"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Side-effect import: pulls in the column.meta type augmentation this
// component reads (column.columnDef.meta?.type / .options / .users).
import "@/registry/bases/base/workspaceui/data-grid-types"

export interface DataSearchProps<TData> {
  table: TanstackTable<TData>
  placeholder?: string
}

const DEBOUNCE_MS = 200

/**
 * The getColumnCanGlobalFilter every DataSearch table should set: `getColumnCanGlobalFilter:
 * dataGridGetColumnCanGlobalFilter`. TanStack's own default excludes any column whose first-row
 * value isn't a string or number *before* globalFilterFn ever runs — silently dropping array
 * values (multiSelect) out of global search regardless of what dataGridGlobalFilterFn does with
 * them. This keeps every meta.type'd column eligible except boolean (not meaningfully
 * free-text-searchable) and leaves TanStack's own heuristic for anything untyped.
 */
export function dataGridGetColumnCanGlobalFilter<TData>(
  column: Column<TData, unknown>
): boolean {
  return column.columnDef.meta?.type !== "boolean"
}

function optionLabel(
  options: { value: string; label: string }[] | undefined,
  value: string
): string {
  return options?.find((o) => o.value === value)?.label ?? value
}

/**
 * The globalFilterFn every DataSearch table should set: `globalFilterFn: dataGridGlobalFilterFn`.
 * Resolves the same displayed label `dataGridFilterFn` does for select/user/multiSelect columns
 * (an id alone rarely means anything to a searcher) and stringifies other primitives
 * case-insensitively. Returns false for columns with no accessor value (id/action columns).
 */
// FilterFn's own generic can't be narrowed here without breaking TanStack's inference.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataGridGlobalFilterFn: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  const needle = String(filterValue ?? "")
    .trim()
    .toLowerCase()
  if (!needle) return true

  const cell = row.getAllCells().find((c) => c.column.id === columnId)
  const type = cell?.column.columnDef.meta?.type
  const value = row.getValue(columnId)
  if (value == null && type !== "user") return false

  switch (type) {
    case "select":
      return optionLabel(cell?.column.columnDef.meta?.options, value as string)
        .toLowerCase()
        .includes(needle)
    case "user": {
      const label =
        value == null
          ? "unassigned"
          : (cell?.column.columnDef.meta?.users?.find((u) => u.id === value)
              ?.name ?? String(value))
      return label.toLowerCase().includes(needle)
    }
    case "multiSelect": {
      const values = Array.isArray(value) ? (value as string[]) : []
      return values.some((v) =>
        optionLabel(cell?.column.columnDef.meta?.options, v)
          .toLowerCase()
          .includes(needle)
      )
    }
    default:
      if (typeof value === "object") return false
      return String(value).toLowerCase().includes(needle)
  }
}

export function DataSearch<TData>({
  table,
  placeholder = "Search...",
}: DataSearchProps<TData>) {
  const globalFilter = (table.getState().globalFilter as string) ?? ""
  const [value, setValue] = React.useState(globalFilter)

  // Adjusted during render (React's "store info from previous render" pattern), not an effect —
  // keeps the input in sync when globalFilter is cleared elsewhere (e.g. a "Clear all" action).
  const [trackedGlobalFilter, setTrackedGlobalFilter] =
    React.useState(globalFilter)
  if (globalFilter !== trackedGlobalFilter) {
    setTrackedGlobalFilter(globalFilter)
    setValue(globalFilter)
  }

  React.useEffect(() => {
    const id = setTimeout(
      () => table.setGlobalFilter(value || undefined),
      DEBOUNCE_MS
    )
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative w-full max-w-64">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="pr-8 pl-8"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Clear search"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={() => setValue("")}
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}
