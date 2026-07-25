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

function operatorLabel(
  type: DataGridColumnType | undefined,
  operatorId: string
): string {
  return (
    operatorsForType(type).find((o) => o.id === operatorId)?.label ?? operatorId
  )
}

/** Just the value half of a chip, e.g. "10 and 40" or "Open, Blocked". */
function formatValueOnly<TData>(
  column: Column<TData, unknown>,
  filter: DataGridFilterValue
): string {
  const type = column.columnDef.meta?.type

  if (filter.operator === "between" && Array.isArray(filter.value)) {
    const [lo, hi] = filter.value as [string, string]
    return `${lo} and ${hi}`
  }

  if (filter.operator === "isAnyOf" && Array.isArray(filter.value)) {
    return (filter.value as string[])
      .map((v) => optionLabel(column.columnDef.meta?.options, v))
      .join(", ")
  }

  if (type === "select" && typeof filter.value === "string") {
    return optionLabel(column.columnDef.meta?.options, filter.value)
  }

  return displayValue(filter.value)
}

/** The full "column operator value" sentence — used as the chip's aria-label. */
function formatFilterSummary<TData>(
  column: Column<TData, unknown>,
  filter: DataGridFilterValue
): string {
  const type = column.columnDef.meta?.type
  const label = getColumnLabel(column)
  const opLabel = operatorLabel(type, filter.operator)

  if (!operatorRequiresValue(type)) return `${label} ${opLabel}`
  return `${label} ${opLabel} ${formatValueOnly(column, filter)}`
}

type ValueShape = "single" | "between" | "multi"

// Switching operators within a type can change what shape the value needs
// to be (a plain string vs a [lo, hi] tuple vs a string[]) — same-shape
// switches (eq -> gt, is -> isNot) keep the existing value; a shape change
// (eq -> between) resets it, since the old value can't be reinterpreted.
function valueShapeOf(operator: string): ValueShape {
  if (operator === "between") return "between"
  if (operator === "isAnyOf") return "multi"
  return "single"
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

// Plain operator buttons, no wrapping div — callers own the layout so a
// back button (the create-new chain) can share one without double-wrapping.
function OperatorList({
  type,
  selected,
  onSelect,
}: {
  type: DataGridColumnType | undefined
  selected: string | null
  onSelect: (operator: string) => void
}) {
  return (
    <>
      {operatorsForType(type).map((op) => (
        <button
          key={op.id}
          type="button"
          onClick={() => onSelect(op.id)}
          className={cn(
            "rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted",
            selected === op.id && "bg-muted"
          )}
        >
          {op.label}
        </button>
      ))}
    </>
  )
}

// The value-input UI for one operator: a single input for most, two for
// "is between", a searchable list for select is/is-not, a searchable
// multi-select for "is any of". Shared by the create-new chain's value step
// and the chip's standalone value popover.
function ValueEditor<TData>({
  column,
  operator,
  value,
  onChange,
  onCommit,
}: {
  column: Column<TData, unknown>
  operator: string
  value: unknown
  onChange: (value: unknown) => void
  onCommit: (value?: unknown) => void
}) {
  const type = column.columnDef.meta?.type

  if (operator === "isAnyOf") {
    const selected = Array.isArray(value) ? (value as string[]) : []
    function toggle(v: string) {
      onChange(
        selected.includes(v)
          ? selected.filter((x) => x !== v)
          : [...selected, v]
      )
    }
    return (
      <div className="flex flex-col">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options.</CommandEmpty>
            <CommandGroup>
              {(column.columnDef.meta?.options ?? []).map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  data-checked={
                    selected.includes(opt.value) ? "true" : undefined
                  }
                  onSelect={() => toggle(opt.value)}
                >
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-1">
          <Button
            size="sm"
            className="w-full"
            disabled={selected.length === 0}
            onClick={() => onCommit()}
          >
            Apply
          </Button>
        </div>
      </div>
    )
  }

  if (type === "select") {
    return (
      <Command>
        <CommandInput placeholder="Search options..." />
        <CommandList>
          <CommandEmpty>No options.</CommandEmpty>
          <CommandGroup>
            {(column.columnDef.meta?.options ?? []).map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.label}
                onSelect={() => onCommit(opt.value)}
              >
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }

  const inputType =
    type === "date"
      ? "date"
      : type === "number" || type === "currency"
        ? "number"
        : "text"

  if (operator === "between") {
    const [lo, hi] = Array.isArray(value)
      ? (value as [string, string])
      : ["", ""]
    return (
      <div className="flex flex-col gap-2 p-2">
        <Input
          type={inputType}
          value={lo}
          placeholder="From"
          onChange={(e) => onChange([e.target.value, hi])}
        />
        <Input
          type={inputType}
          value={hi}
          placeholder="To"
          onChange={(e) => onChange([lo, e.target.value])}
        />
        <Button size="sm" disabled={!lo || !hi} onClick={() => onCommit()}>
          Apply
        </Button>
      </div>
    )
  }

  const strValue = typeof value === "string" ? value : ""
  return (
    <div className="flex flex-col gap-2 p-2">
      <Input
        type={inputType}
        value={strValue}
        placeholder="Value"
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && strValue) onCommit()
        }}
      />
      <Button size="sm" disabled={!strValue} onClick={() => onCommit()}>
        Apply
      </Button>
    </div>
  )
}

// The "+ Filter" trigger's chain: column -> operator -> value, always
// starting fresh. Editing an already-committed chip goes through
// OperatorPopover/ValuePopover instead — those write straight to the
// column's filter value with no intermediate draft/chain state.
function FilterEditorPopover<TData>({
  table,
  availableColumns,
  trigger,
}: {
  table: TanstackTable<TData>
  availableColumns: Column<TData, unknown>[]
  trigger: React.ReactElement
}) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<Step>("column")
  const [draftColumnId, setDraftColumnId] = React.useState<string | null>(null)
  const [draftOperator, setDraftOperator] = React.useState<string | null>(null)
  const [draftValue, setDraftValue] = React.useState<unknown>(undefined)

  const draftColumn = draftColumnId ? table.getColumn(draftColumnId) : undefined
  const draftType = draftColumn?.columnDef.meta?.type

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) return
    setStep("column")
    setDraftColumnId(null)
    setDraftOperator(null)
    setDraftValue(undefined)
  }

  function commitFilter(operator: string, value?: unknown) {
    if (!draftColumnId) return
    const column = table.getColumn(draftColumnId)
    if (!column) return
    column.setFilterValue(
      operatorRequiresValue(draftType) ? { operator, value } : { operator }
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
    setDraftValue(defaultValueForOperator(op))
    setStep("value")
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
            <FilterBackButton
              label={draftColumn ? getColumnLabel(draftColumn) : "Back"}
              onClick={() => setStep("column")}
            />
            <OperatorList
              type={draftType}
              selected={draftOperator}
              onSelect={selectOperator}
            />
          </div>
        )}

        {step === "value" && draftColumn && draftOperator && (
          <div className="flex flex-col">
            <FilterBackButton
              label={operatorLabel(draftType, draftOperator)}
              onClick={() => setStep("operator")}
            />
            <ValueEditor
              column={draftColumn}
              operator={draftOperator}
              value={draftValue}
              onChange={setDraftValue}
              onCommit={(value) =>
                commitFilter(draftOperator, value ?? draftValue)
              }
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// A chip's operator segment: a dropdown of the operators for its column's
// type. Picking one writes straight through — no chain, no draft state.
// Same-shape switches (eq -> gt) keep the existing value; a shape change
// (eq -> between) resets it to that operator's default.
function OperatorPopover<TData>({
  table,
  columnId,
  trigger,
}: {
  table: TanstackTable<TData>
  columnId: string
  trigger: React.ReactElement
}) {
  const [open, setOpen] = React.useState(false)
  const column = table.getColumn(columnId)
  const type = column?.columnDef.meta?.type
  const current = column?.getFilterValue() as DataGridFilterValue | undefined

  function selectOperator(op: string) {
    if (!column) return
    if (!operatorRequiresValue(type)) {
      column.setFilterValue({ operator: op })
      setOpen(false)
      return
    }
    const sameShape =
      current != null && valueShapeOf(current.operator) === valueShapeOf(op)
    column.setFilterValue({
      operator: op,
      value: sameShape ? current.value : defaultValueForOperator(op),
    })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="start" className="w-48 p-1">
        <div className="flex flex-col gap-0.5">
          <OperatorList
            type={type}
            selected={current?.operator ?? null}
            onSelect={selectOperator}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

// A chip's value segment: the same ValueEditor as the create-new chain,
// scoped to the operator the chip already has. Writes through on Apply (or
// immediately for a single-click pick like select is/is-not).
function ValuePopover<TData>({
  table,
  columnId,
  trigger,
}: {
  table: TanstackTable<TData>
  columnId: string
  trigger: React.ReactElement
}) {
  const [open, setOpen] = React.useState(false)
  const column = table.getColumn(columnId)
  const current = column?.getFilterValue() as DataGridFilterValue | undefined
  const [draftValue, setDraftValue] = React.useState<unknown>(current?.value)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) setDraftValue(current?.value)
  }

  function commit(value?: unknown) {
    if (!column || !current) return
    column.setFilterValue({
      operator: current.operator,
      value: value !== undefined ? value : draftValue,
    })
    setOpen(false)
  }

  if (!column || !current) return null

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="start" className="w-64 p-0">
        <ValueEditor
          column={column}
          operator={current.operator}
          value={draftValue}
          onChange={setDraftValue}
          onCommit={commit}
        />
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
        const type = column.columnDef.meta?.type
        const filterValue = filter.value as DataGridFilterValue
        const valueText = formatValueOnly(column, filterValue)
        return (
          <span
            key={filter.id}
            role="group"
            aria-label={formatFilterSummary(column, filterValue)}
            className="inline-flex max-w-full items-center divide-x divide-border rounded-full border bg-muted text-xs"
          >
            <span className="px-2.5 py-1">{getColumnLabel(column)}</span>
            <OperatorPopover
              table={table}
              columnId={filter.id}
              trigger={
                <button type="button" className="px-2.5 py-1 hover:bg-accent">
                  {operatorLabel(type, filterValue.operator)}
                </button>
              }
            />
            {operatorRequiresValue(type) && (
              <ValuePopover
                table={table}
                columnId={filter.id}
                trigger={
                  <button
                    type="button"
                    className="max-w-32 truncate px-2.5 py-1 hover:bg-accent"
                  >
                    {valueText || "Set value"}
                  </button>
                }
              />
            )}
            <button
              type="button"
              aria-label={`Remove ${getColumnLabel(column)} filter`}
              onClick={() => removeFilter(filter.id)}
              className="shrink-0 rounded-e-full p-1.5 hover:bg-accent"
            >
              <XIcon className="size-3" />
            </button>
          </span>
        )
      })}
    </div>
  )
}
