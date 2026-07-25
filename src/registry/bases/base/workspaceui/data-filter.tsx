"use client"

import * as React from "react"
import type {
  Column,
  FilterFn,
  Table as TanstackTable,
} from "@tanstack/react-table"
import { ChevronLeftIcon, PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// Side-effect import: pulls in the column.meta type augmentation this
// component reads (column.columnDef.meta?.type / .options).
import "@/registry/bases/base/workspaceui/data-grid-types"
import type { DataGridColumnType } from "@/registry/bases/base/workspaceui/data-grid-types"

export interface DataFilterProps<TData> {
  table: TanstackTable<TData>
}

/** The object shape the chip chain writes via `column.setFilterValue()`. */
export interface DataGridFilterValue {
  operator: string
  value?: unknown
}

interface OperatorDef {
  id: string
  label: string
}

const TEXT_OPERATORS: OperatorDef[] = [
  { id: "contains", label: "contains" },
  { id: "notContains", label: "does not contain" },
  { id: "is", label: "is" },
  { id: "startsWith", label: "starts with" },
]

const NUMBER_OPERATORS: OperatorDef[] = [
  { id: "eq", label: "=" },
  { id: "neq", label: "≠" },
  { id: "lt", label: "<" },
  { id: "gt", label: ">" },
  { id: "between", label: "is between" },
]

const DATE_OPERATORS: OperatorDef[] = [
  { id: "before", label: "is before" },
  { id: "after", label: "is after" },
  { id: "between", label: "is between" },
  { id: "is", label: "is" },
]

const SELECT_OPERATORS: OperatorDef[] = [
  { id: "is", label: "is" },
  { id: "isNot", label: "is not" },
  { id: "isAnyOf", label: "is any of" },
]

const BOOLEAN_OPERATORS: OperatorDef[] = [
  { id: "isTrue", label: "is true" },
  { id: "isFalse", label: "is false" },
]

// This ticket implements six of the eight column types; multiSelect and
// user are a follow-up (they need chip-per-value pickers this ticket
// doesn't build). A column of either type is simply not offered here yet —
// better than listing it and having dataGridFilterFn silently no-op on it.
const OPERATORS_BY_TYPE: Partial<Record<DataGridColumnType, OperatorDef[]>> = {
  text: TEXT_OPERATORS,
  number: NUMBER_OPERATORS,
  currency: NUMBER_OPERATORS,
  date: DATE_OPERATORS,
  select: SELECT_OPERATORS,
  boolean: BOOLEAN_OPERATORS,
}

function operatorsForType(type: DataGridColumnType | undefined): OperatorDef[] {
  return (type && OPERATORS_BY_TYPE[type]) ?? []
}

// boolean's operators encode the value ("is true" / "is false") — every
// other type's operators need a separate value step.
function operatorRequiresValue(type: DataGridColumnType | undefined): boolean {
  return type !== "boolean"
}

function defaultValueForOperator(operator: string): unknown {
  if (operator === "between") return ["", ""]
  if (operator === "isAnyOf") return []
  return ""
}

function displayValue(value: unknown): string {
  return value == null ? "" : String(value)
}

function getColumnLabel<TData>(column: Column<TData, unknown>): string {
  const header = column.columnDef.header
  return typeof header === "string" ? header : column.id
}

function optionLabel(
  options: { value: string; label: string }[] | undefined,
  value: string
): string {
  return options?.find((o) => o.value === value)?.label ?? value
}

function formatFilterSummary<TData>(
  column: Column<TData, unknown>,
  filter: DataGridFilterValue
): string {
  const type = column.columnDef.meta?.type
  const label = getColumnLabel(column)
  const opDef = operatorsForType(type).find((o) => o.id === filter.operator)
  const opLabel = opDef?.label ?? filter.operator

  if (!operatorRequiresValue(type)) return `${label} ${opLabel}`

  if (filter.operator === "between" && Array.isArray(filter.value)) {
    const [lo, hi] = filter.value as [string, string]
    return `${label} ${opLabel} ${lo} and ${hi}`
  }

  if (filter.operator === "isAnyOf" && Array.isArray(filter.value)) {
    const labels = (filter.value as string[]).map((v) =>
      optionLabel(column.columnDef.meta?.options, v)
    )
    return `${label} ${opLabel} ${labels.join(", ")}`
  }

  if (type === "select" && typeof filter.value === "string") {
    return `${label} ${opLabel} ${optionLabel(column.columnDef.meta?.options, filter.value)}`
  }

  return `${label} ${opLabel} ${displayValue(filter.value)}`
}

// ── dataGridFilterFn ─────────────────────────────────────────────────────

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value)
}

function toTime(value: unknown): number {
  return value instanceof Date
    ? value.getTime()
    : new Date(String(value)).getTime()
}

/**
 * The filterFn every filterable column must set: `filterFn: dataGridFilterFn`.
 * TanStack's built-in filter functions all read the filter value directly —
 * none of them can consume the `{ operator, value }` object the chip chain
 * writes via `column.setFilterValue()`. This unwraps that object and
 * dispatches on `column.meta.type`.
 */
// ponytail: typed FilterFn<any>, matching TanStack's own documented pattern
// for a filterFn meant to be assigned across arbitrary tables — Row<TData>'s
// variance rejects a real generic (or `unknown`) at the ColumnDef<Employee>
// assignment site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataGridFilterFn: FilterFn<any> = (
  row,
  columnId,
  filterValue: DataGridFilterValue
) => {
  if (!filterValue?.operator) return true
  const cell = row.getAllCells().find((c) => c.column.id === columnId)
  const type = cell?.column.columnDef.meta?.type
  const cellValue = row.getValue(columnId)
  const { operator, value } = filterValue

  switch (type) {
    case "text": {
      const cellText = displayValue(cellValue).toLowerCase()
      const needle = displayValue(value).toLowerCase()
      switch (operator) {
        case "contains":
          return cellText.includes(needle)
        case "notContains":
          return !cellText.includes(needle)
        case "is":
          return cellText === needle
        case "startsWith":
          return cellText.startsWith(needle)
        default:
          return true
      }
    }
    case "number":
    case "currency": {
      const n = toNumber(cellValue)
      if (operator === "between") {
        const [lo, hi] = value as [string, string]
        return n >= toNumber(lo) && n <= toNumber(hi)
      }
      const target = toNumber(value)
      switch (operator) {
        case "eq":
          return n === target
        case "neq":
          return n !== target
        case "lt":
          return n < target
        case "gt":
          return n > target
        default:
          return true
      }
    }
    case "date": {
      const t = toTime(cellValue)
      if (operator === "between") {
        const [lo, hi] = value as [string, string]
        return t >= toTime(lo) && t <= toTime(hi)
      }
      switch (operator) {
        case "before":
          return t < toTime(value)
        case "after":
          return t > toTime(value)
        case "is":
          return t === toTime(value)
        default:
          return true
      }
    }
    case "select": {
      switch (operator) {
        case "is":
          return cellValue === value
        case "isNot":
          return cellValue !== value
        case "isAnyOf":
          return Array.isArray(value) && value.includes(cellValue)
        default:
          return true
      }
    }
    case "boolean": {
      if (operator === "isTrue") return cellValue === true
      if (operator === "isFalse") return cellValue === false
      return true
    }
    default:
      return true
  }
}

dataGridFilterFn.autoRemove = (value: DataGridFilterValue | undefined) =>
  value == null

// ── DataFilter ────────────────────────────────────────────────────────────

type Step = "column" | "operator" | "value"

function FilterBackButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <ChevronLeftIcon className="size-3" />
      {label}
    </button>
  )
}

function FilterEditorPopover<TData>({
  table,
  availableColumns,
  columnId,
  trigger,
}: {
  table: TanstackTable<TData>
  availableColumns: Column<TData, unknown>[]
  /** null = building a brand-new filter; a column id = editing its chip. */
  columnId: string | null
  trigger: React.ReactElement
}) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<Step>("column")
  const [draftColumnId, setDraftColumnId] = React.useState<string | null>(null)
  const [draftOperator, setDraftOperator] = React.useState<string | null>(null)
  const [draftValue, setDraftValue] = React.useState<unknown>(undefined)
  // The operator/value this chip already had when the popover was opened —
  // reused so re-picking the same operator restores its value instead of
  // resetting to an empty draft.
  const initialFilterRef = React.useRef<DataGridFilterValue | undefined>(
    undefined
  )

  const draftColumn = draftColumnId ? table.getColumn(draftColumnId) : undefined
  const draftType = draftColumn?.columnDef.meta?.type

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) return
    if (columnId == null) {
      setStep("column")
      setDraftColumnId(null)
      setDraftOperator(null)
      setDraftValue(undefined)
      initialFilterRef.current = undefined
      return
    }
    const current = table.getColumn(columnId)?.getFilterValue() as
      DataGridFilterValue | undefined
    const type = table.getColumn(columnId)?.columnDef.meta?.type
    initialFilterRef.current = current
    setDraftColumnId(columnId)
    setDraftOperator(current?.operator ?? null)
    setDraftValue(current?.value)
    setStep(operatorRequiresValue(type) ? "value" : "operator")
  }

  function commitFilter(operator?: string, value?: unknown) {
    const op = operator ?? draftOperator
    const targetColumnId = draftColumnId
    if (!targetColumnId || !op) return
    const column = table.getColumn(targetColumnId)
    if (!column) return
    const val = value !== undefined ? value : draftValue
    column.setFilterValue(
      operatorRequiresValue(draftType)
        ? { operator: op, value: val }
        : { operator: op }
    )
    setOpen(false)
  }

  function selectColumn(id: string) {
    setDraftColumnId(id)
    setDraftOperator(null)
    setDraftValue(undefined)
    setStep("operator")
  }

  function selectOperator(op: string) {
    setDraftOperator(op)
    if (!operatorRequiresValue(draftType)) {
      commitFilter(op, undefined)
      return
    }
    if (initialFilterRef.current && initialFilterRef.current.operator === op) {
      setDraftValue(initialFilterRef.current.value)
    } else {
      setDraftValue(defaultValueForOperator(op))
    }
    setStep("value")
  }

  function toggleAnyOfValue(value: string) {
    setDraftValue((prev: unknown) => {
      const arr = Array.isArray(prev) ? (prev as string[]) : []
      return arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value]
    })
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="start" className="w-64 p-0">
        {step === "column" && (
          <Command>
            <CommandInput placeholder="Filter by column..." />
            <CommandList>
              <CommandEmpty>No columns.</CommandEmpty>
              <CommandGroup>
                {availableColumns.map((column) => (
                  <CommandItem
                    key={column.id}
                    value={getColumnLabel(column)}
                    onSelect={() => selectColumn(column.id)}
                  >
                    {getColumnLabel(column)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}

        {step === "operator" && (
          <div className="flex flex-col gap-0.5 p-1">
            {columnId == null && (
              <FilterBackButton
                label={draftColumn ? getColumnLabel(draftColumn) : "Back"}
                onClick={() => setStep("column")}
              />
            )}
            {operatorsForType(draftType).map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => selectOperator(op.id)}
                className={cn(
                  "rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted",
                  draftOperator === op.id && "bg-muted"
                )}
              >
                {op.label}
              </button>
            ))}
          </div>
        )}

        {step === "value" &&
          draftOperator &&
          (() => {
            const opLabel =
              operatorsForType(draftType).find((o) => o.id === draftOperator)
                ?.label ?? draftOperator

            const backButton = (
              <FilterBackButton
                label={opLabel}
                onClick={() => setStep("operator")}
              />
            )

            if (draftOperator === "isAnyOf") {
              const selected = Array.isArray(draftValue)
                ? (draftValue as string[])
                : []
              return (
                <div className="flex flex-col">
                  {backButton}
                  <Command>
                    <CommandInput placeholder="Search options..." />
                    <CommandList>
                      <CommandEmpty>No options.</CommandEmpty>
                      <CommandGroup>
                        {(draftColumn?.columnDef.meta?.options ?? []).map(
                          (opt) => (
                            <CommandItem
                              key={opt.value}
                              value={opt.label}
                              data-checked={
                                selected.includes(opt.value)
                                  ? "true"
                                  : undefined
                              }
                              onSelect={() => toggleAnyOfValue(opt.value)}
                            >
                              {opt.label}
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <div className="p-1">
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={selected.length === 0}
                      onClick={() => commitFilter()}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )
            }

            if (draftType === "select") {
              return (
                <div className="flex flex-col">
                  {backButton}
                  <Command>
                    <CommandInput placeholder="Search options..." />
                    <CommandList>
                      <CommandEmpty>No options.</CommandEmpty>
                      <CommandGroup>
                        {(draftColumn?.columnDef.meta?.options ?? []).map(
                          (opt) => (
                            <CommandItem
                              key={opt.value}
                              value={opt.label}
                              onSelect={() =>
                                commitFilter(draftOperator, opt.value)
                              }
                            >
                              {opt.label}
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )
            }

            const inputType =
              draftType === "date"
                ? "date"
                : draftType === "number" || draftType === "currency"
                  ? "number"
                  : "text"

            if (draftOperator === "between") {
              const [lo, hi] = Array.isArray(draftValue)
                ? (draftValue as [string, string])
                : ["", ""]
              return (
                <div className="flex flex-col gap-2 p-2">
                  {backButton}
                  <Input
                    type={inputType}
                    value={lo}
                    placeholder="From"
                    onChange={(e) => setDraftValue([e.target.value, hi])}
                  />
                  <Input
                    type={inputType}
                    value={hi}
                    placeholder="To"
                    onChange={(e) => setDraftValue([lo, e.target.value])}
                  />
                  <Button
                    size="sm"
                    disabled={!lo || !hi}
                    onClick={() => commitFilter()}
                  >
                    Apply
                  </Button>
                </div>
              )
            }

            const value = typeof draftValue === "string" ? draftValue : ""
            return (
              <div className="flex flex-col gap-2 p-2">
                {backButton}
                <Input
                  type={inputType}
                  value={value}
                  placeholder="Value"
                  autoFocus
                  onChange={(e) => setDraftValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && value) commitFilter()
                  }}
                />
                <Button
                  size="sm"
                  disabled={!value}
                  onClick={() => commitFilter()}
                >
                  Apply
                </Button>
              </div>
            )
          })()}
      </PopoverContent>
    </Popover>
  )
}

export function DataFilter<TData>({ table }: DataFilterProps<TData>) {
  const filterableColumns = table
    .getAllLeafColumns()
    .filter(
      (column) =>
        column.columnDef.meta?.type != null &&
        column.columnDef.meta.type in OPERATORS_BY_TYPE &&
        column.getCanFilter()
    )

  const activeFilters = table
    .getState()
    .columnFilters.filter((filter) =>
      filterableColumns.some((column) => column.id === filter.id)
    )
  const activeFilterIds = new Set(activeFilters.map((f) => f.id))
  const pickableColumns = filterableColumns.filter(
    (column) => !activeFilterIds.has(column.id)
  )

  function removeFilter(columnId: string) {
    table.getColumn(columnId)?.setFilterValue(undefined)
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <FilterEditorPopover
        table={table}
        availableColumns={pickableColumns}
        columnId={null}
        trigger={
          <Button variant="outline" size="sm">
            <PlusIcon className="size-4" />
            Filter
          </Button>
        }
      />
      {activeFilters.map((filter) => {
        const column = table.getColumn(filter.id)
        if (!column) return null
        const summary = formatFilterSummary(
          column,
          filter.value as DataGridFilterValue
        )
        return (
          <span
            key={filter.id}
            className="inline-flex max-w-full items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs"
          >
            <FilterEditorPopover
              table={table}
              availableColumns={pickableColumns}
              columnId={filter.id}
              trigger={
                <button type="button" className="max-w-48 truncate">
                  {summary}
                </button>
              }
            />
            <button
              type="button"
              aria-label={`Remove ${getColumnLabel(column)} filter`}
              onClick={() => removeFilter(filter.id)}
              className="shrink-0 rounded-full p-0.5 hover:bg-accent"
            >
              <XIcon className="size-3" />
            </button>
          </span>
        )
      })}
    </div>
  )
}
