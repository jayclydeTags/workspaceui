"use client"

import * as React from "react"
import {
  flexRender,
  type Cell,
  type Column,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type Row,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { motion } from "motion/react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  Columns3Icon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  MinusIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PinIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// Side-effect import: pulls in the column.meta type augmentation this
// component reads (cell.column.columnDef.meta?.type).
import "@/registry/bases/base/workspaceui/data-grid-types"
import type {
  DataGridColumnType,
  DataGridSelectOption,
  DataGridUser,
} from "@/registry/bases/base/workspaceui/data-grid-types"

/** A snapshot of column resize/pin/reorder state, reported via `onColumnLayoutChange`. */
export interface DataGridColumnLayout {
  columnOrder: ColumnOrderState
  columnSizing: ColumnSizingState
  columnPinning: ColumnPinningState
}

export interface DataGridProps<TData> {
  table: TanstackTable<TData>
  onCellEdit: (
    rowId: string,
    columnId: string,
    value: unknown
  ) => void | Promise<void>
  /** Omit `afterRowId` to append; pass it to insert after that row. */
  onRowAdd?: (afterRowId?: string) => void | Promise<void>
  onRowDelete?: (rowId: string) => void | Promise<void>
  /** Fires after a resize, pin, or reorder change so a consumer can persist it. */
  onColumnLayoutChange?: (layout: DataGridColumnLayout) => void
  /**
   * Below a 448px measured container width, `"cards"` (the default) swaps
   * the grid for a card list with a bottom-sheet editor. `"none"` is the
   * escape hatch: keeps the real grid at any width, with the first column
   * stuck sticky-left so it stays visible under horizontal scroll.
   */
  narrowFallback?: "cards" | "none"
  /** Rendered in place of rows when `table.getRowModel().rows` is empty. Defaults to plain "No results." text. */
  emptyState?: React.ReactNode
  className?: string
}

// Matches data-filter.tsx's own NARROW_BREAKPOINT so both flip together in a shared narrow pane.
const NARROW_BREAKPOINT = 448

// Own ResizeObserver (not shared with data-filter.tsx): container width, not viewport, drives responsiveness here.
function useContainerWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [width, setWidth] = React.useState<number | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

type PinPosition = false | "left" | "right"

// unpinned -> left -> right -> unpinned: one control covers every pin state.
function nextPinPosition(current: PinPosition): PinPosition {
  if (current === "left") return "right"
  if (current === "right") return false
  return "left"
}

function pinActionLabel(current: PinPosition): string {
  if (current === "left") return "Pin column right"
  if (current === "right") return "Unpin column"
  return "Pin column left"
}

// Reflects TanStack's getIsSorted() (false | "asc" | "desc"). The unsorted glyph
// only surfaces on header hover, so it hints at sortability without adding noise.
function sortIcon(direction: false | "asc" | "desc") {
  if (direction === "asc") return <ArrowUpIcon className="size-3.5 shrink-0" />
  if (direction === "desc")
    return <ArrowDownIcon className="size-3.5 shrink-0" />
  return (
    <ChevronsUpDownIcon className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-60" />
  )
}

// Follows TanStack's own default; opt out via `enableRowSelection: false` on useReactTable().
function hasRowSelectionEnabled<TData>(table: TanstackTable<TData>): boolean {
  return table.options.enableRowSelection !== false
}

// The shared Checkbox has no indeterminate icon, and other consumers use it
// as-is — this local variant (same classes, swapped indicator) keeps the
// mixed-state affordance scoped to the header select-all control.
function SelectAllCheckbox({
  checked,
  indeterminate,
  onCheckedChange,
}: {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      indeterminate={indeterminate}
      aria-label="Select all rows"
      onCheckedChange={onCheckedChange}
      className="peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary"
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

// Uses the midpoint-derived before/after position: a naive insert-before-target no-ops on an adjacent swap.
function reorderColumnIds(
  order: string[],
  draggedId: string,
  overId: string,
  position: "before" | "after"
): string[] {
  if (draggedId === overId) return order
  const without = order.filter((id) => id !== draggedId)
  const overIndex = without.indexOf(overId)
  const insertAt = position === "after" ? overIndex + 1 : overIndex
  return [...without.slice(0, insertAt), draggedId, ...without.slice(insertAt)]
}

// forceStickyLeft is the narrowFallback="none" escape hatch; a real left pin still wins its own getStart() offset over the forced 0.
// Non-pinned columns get a size-proportional % width so the data columns fill
// the table (no trailing gap) while the fixed-px selection/action cells stay
// put — px would let table-fixed distribute slack across every column, growing
// the checkbox. Pinned columns keep px so their sticky getStart() offsets align.
function columnPinStyle<TData>(
  column: Column<TData, unknown>,
  forceStickyLeft = false,
  totalSize = 0
): React.CSSProperties {
  const pinned = column.getIsPinned()
  return {
    width:
      pinned || !totalSize
        ? column.getSize()
        : `${+((column.getSize() / totalSize) * 100).toFixed(4)}%`,
    ...((pinned === "left" || forceStickyLeft) && {
      position: "sticky",
      left: pinned === "left" ? column.getStart("left") : 0,
      zIndex: 1,
    }),
    ...(pinned === "right" && {
      position: "sticky",
      right: column.getAfter("right"),
      zIndex: 1,
    }),
  }
}

interface Coord {
  r: number
  c: number
}

function cellKey(r: number, c: number) {
  return `${r}-${c}`
}

// Takes the ref object, not `.current`, so `.current` is read only when the callback fires.
function setMapRef<T>(ref: React.RefObject<Map<string, T>>, key: string) {
  return (el: T | null) => {
    if (el) ref.current.set(key, el)
    else ref.current.delete(key)
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi)
}

function normalizeErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

// null/undefined read as empty, not the literal "null"/"undefined".
function cellDisplayValue(value: unknown): string {
  return value == null ? "" : String(value)
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
})

// select needs no case here: a native <option> looks up its own label from the raw value.
function formatReadValue(type: DataGridColumnType | undefined, raw: unknown) {
  if (type !== "currency" || raw == null || raw === "")
    return cellDisplayValue(raw)
  const n = typeof raw === "number" ? raw : Number(raw)
  return Number.isNaN(n) ? cellDisplayValue(raw) : currencyFormatter.format(n)
}

// Normalizes to the column's declared option order, so reordering the same set never reads as a change.
function normalizeToOptionsOrder(
  values: string[],
  options: DataGridSelectOption[]
): string[] {
  return options
    .filter((opt) => values.includes(opt.value))
    .map((opt) => opt.value)
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

// Chips capped at maxChips + a "+N" badge, keeping row height fixed.
function renderMultiSelectTrigger(
  selected: string[],
  options: DataGridSelectOption[],
  maxChips: number
) {
  if (selected.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }
  const shown = options.filter((opt) => selected.includes(opt.value))
  const visible = shown.slice(0, maxChips)
  const overflow = shown.length - visible.length
  return (
    <>
      {visible.map((opt) => (
        <Badge key={opt.value} variant="secondary" className="shrink-0">
          {opt.label}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge variant="outline" className="shrink-0">
          +{overflow}
        </Badge>
      )}
    </>
  )
}

// "Unassigned" is a real pickable value (null), not just an empty state.
function renderUserTrigger(userId: string | null, users: DataGridUser[]) {
  const user = userId == null ? undefined : users.find((u) => u.id === userId)
  if (!user) {
    return <span className="text-muted-foreground">Unassigned</span>
  }
  return (
    <>
      <Avatar size="sm" className="shrink-0">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
        <AvatarFallback>{initials(user.name)}</AvatarFallback>
      </Avatar>
      <span className="truncate">{user.name}</span>
    </>
  )
}

function optionLabel(
  options: DataGridSelectOption[] | undefined,
  value: unknown
): string {
  return options?.find((opt) => opt.value === value)?.label ?? String(value)
}

// Covers every column type, unlike formatReadValue (currency vs. plain text only).
function formatCardValue<TData>(cell: Cell<TData, unknown>): string {
  const meta = cell.column.columnDef.meta
  const type = meta?.type
  const value = cell.getValue()
  if (type === "boolean") return value ? "Yes" : "No"
  if (type === "select") return optionLabel(meta?.options, value)
  if (type === "multiSelect") {
    const values = Array.isArray(value) ? (value as string[]) : []
    return values.length === 0
      ? ""
      : values.map((v) => optionLabel(meta?.options, v)).join(", ")
  }
  if (type === "user") {
    const user = meta?.users?.find((u) => u.id === value)
    return user ? user.name : "Unassigned"
  }
  return formatReadValue(type, value)
}

function withKey<T>(map: Map<string, T>, key: string, value: T) {
  const next = new Map(map)
  next.set(key, value)
  return next
}

function withoutKey<T>(map: Map<string, T>, key: string) {
  const next = new Map(map)
  next.delete(key)
  return next
}

// One entry per cell key so pending/value/error can't drift out of sync.
interface CellCommit {
  value: string
  pending: boolean
  error?: string
}

// Only checks "required" (+ numeric for number/currency); boolean never fails.
function validateForType(
  type: DataGridColumnType | undefined,
  value: string
): string | null {
  if (type === "boolean") return null
  if (value.trim().length === 0) return "Required"
  if (
    (type === "number" || type === "currency") &&
    Number.isNaN(Number(value))
  ) {
    return "Must be a number"
  }
  return null
}

function coerceForType(
  type: DataGridColumnType | undefined,
  raw: string
): unknown {
  return type === "number" || type === "currency" ? Number(raw) : raw
}

function defaultValueForColumnType(
  type: DataGridColumnType | undefined,
  options: DataGridSelectOption[] | undefined
): unknown {
  switch (type) {
    case "number":
    case "currency":
      return 0
    case "boolean":
      return false
    case "select":
      return options?.[0]?.value ?? ""
    case "multiSelect":
      return []
    case "user":
      return null
    case "text":
    case "date":
    default:
      return ""
  }
}

/**
 * Per-type default values for a new row (columns without `meta.type` are omitted).
 * The grid never owns data — call this from your own `onRowAdd` to seed the row you insert.
 */
export function getDataGridRowDefaults<TData>(
  table: TanstackTable<TData>
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const column of table.getAllLeafColumns()) {
    const meta = column.columnDef.meta
    if (!meta?.type) continue
    defaults[column.id] = defaultValueForColumnType(meta.type, meta.options)
  }
  return defaults
}

export function DataGrid<TData>({
  table,
  onCellEdit,
  onRowAdd,
  onRowDelete,
  onColumnLayoutChange,
  narrowFallback = "cards",
  emptyState = "No results.",
  className,
}: DataGridProps<TData>) {
  const { ref: containerRef, width: containerWidth } =
    useContainerWidth<HTMLDivElement>()
  const isNarrow = containerWidth != null && containerWidth < NARROW_BREAKPOINT
  // Only one tree renders — showCards picks it up front rather than hiding one with CSS, so the wide grid's headers don't exist in the DOM while true.
  const showCards = isNarrow && narrowFallback === "cards"
  const forceStickyFirstColumn = isNarrow && narrowFallback === "none"

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const colCount = headerGroups[0]?.headers.length ?? 0
  const rowCount = rows.length
  const hasDeleteColumn = onRowDelete != null
  const hasSelectionColumn = hasRowSelectionEnabled(table)
  const totalColCount =
    colCount + (hasDeleteColumn ? 1 : 0) + (hasSelectionColumn ? 1 : 0)

  // Tracked by row id, not index, so it survives a data update that reorders rows.
  const [openRowId, setOpenRowId] = React.useState<string | null>(null)
  const openRowIndex = rows.findIndex((row) => row.id === openRowId)

  // Every sheet field is editable at once (unlike the grid's single editCoord); a missing key falls back to committed/pending value.
  const [sheetBuffers, setSheetBuffers] = React.useState<
    Record<string, string>
  >({})

  const [focusCoord, setFocusCoord] = React.useState<Coord>({ r: 0, c: 0 })
  const [editCoord, setEditCoord] = React.useState<Coord | null>(null)
  const [buffer, setBuffer] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  // Independent of editCoord so a commit can stay pending/errored after focus moves on; cleared on success.
  const [commits, setCommits] = React.useState<Map<string, CellCommit>>(
    new Map()
  )
  const [liveMessage, setLiveMessage] = React.useState("")

  // Consumed once rowCount actually grows — the only add-succeeded signal the grid gets back, since it never owns data.
  const [pendingAdd, setPendingAdd] = React.useState<{
    afterRowId?: string
  } | null>(null)
  const prevRowCountRef = React.useRef(rowCount)
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null)

  // Anchor-and-extend selection; cleared on any plain (non-shift) move so the next extension starts fresh.
  const [selectionAnchor, setSelectionAnchor] = React.useState<number | null>(
    null
  )

  // Drag state lives in refs (read only from drag handlers, no re-renders needed).
  const draggingColumnRef = React.useRef<string | null>(null)
  const dragOriginalOrderRef = React.useRef<string[] | null>(null)
  const dragOriginalHiddenOrderRef = React.useRef<string[] | null>(null)
  const dragOriginalVisibleRef = React.useRef<boolean | null>(null)
  const droppedRef = React.useRef(false)
  // tanstack's columnOrder only tracks visible ids, so hidden columns get their own.
  const [hiddenOrder, setHiddenOrder] = React.useState<string[]>([])

  const cellRefs = React.useRef(new Map<string, HTMLTableCellElement>())
  const inputRefs = React.useRef(new Map<string, HTMLInputElement>())
  const selectRefs = React.useRef(new Map<string, HTMLSelectElement>())
  // Suppresses the stale blur-commit that follows an explicit Enter/Tab/Escape-driven focus move.
  const suppressNextBlurRef = React.useRef(false)
  const errorId = React.useId()

  function columnTypeAt(r: number, c: number): DataGridColumnType | undefined {
    return rows[r]?.getVisibleCells()[c]?.column.columnDef.meta?.type
  }

  // Never both refs for the same key, so trying one then the other finds whichever control this cell rendered.
  function focusEditControl(key: string) {
    const input = inputRefs.current.get(key)
    if (input) {
      input.focus()
      return
    }
    selectRefs.current.get(key)?.focus()
  }

  function wrapIndex(r: number, c: number, dir: 1 | -1): Coord {
    const total = rowCount * colCount
    let idx = r * colCount + c + dir
    idx = ((idx % total) + total) % total
    return { r: Math.floor(idx / colCount), c: idx % colCount }
  }

  function focusTo(r: number, c: number) {
    setFocusCoord({ r, c })
    cellRefs.current.get(cellKey(r, c))?.focus()
  }

  // Row-level range selection only; cell-range (Shift+Left/Right) is unbound.
  function selectRowRange(a: number, b: number) {
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    const next: Record<string, boolean> = {}
    for (let i = lo; i <= hi; i++) {
      const row = rows[i]
      if (row) next[row.id] = true
    }
    table.setRowSelection(next)
  }

  function onRowCheckboxChange(r: number, event: Event) {
    const shiftKey = "shiftKey" in event && (event as MouseEvent).shiftKey
    if (shiftKey && selectionAnchor != null) {
      selectRowRange(selectionAnchor, r)
      return
    }
    rows[r]?.toggleSelected()
    setSelectionAnchor(r)
  }

  function getColumnLabel(column: Column<TData, unknown>): string {
    const header = column.columnDef.header
    return typeof header === "string" ? header : column.id
  }

  const columnOrderState = table.getState().columnOrder
  const columnSizingState = table.getState().columnSizing
  const columnPinningState = table.getState().columnPinning
  const isMountedRef = React.useRef(false)

  // Reports the table's own resize/pin/reorder state out after real changes only (skips the mount-time run).
  React.useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    onColumnLayoutChange?.({
      columnOrder: columnOrderState,
      columnSizing: columnSizingState,
      columnPinning: columnPinningState,
    })
  }, [columnOrderState, columnSizingState, columnPinningState])

  // Each gap between two rows is one drop zone, not two — collapse "after" into the next row's "before".
  function columnDropTarget(
    e: React.DragEvent<HTMLLIElement>,
    overId: string,
    ids: string[]
  ): { id: string; position: "before" | "after" } {
    const rect = e.currentTarget.getBoundingClientRect()
    const midpointY = rect.top + rect.height / 2
    const rawPosition: "before" | "after" =
      e.clientY < midpointY ? "before" : "after"
    const target = { id: overId, position: rawPosition }
    if (rawPosition === "after") {
      const idx = ids.indexOf(overId)
      const nextId = idx >= 0 ? ids[idx + 1] : undefined
      if (nextId) {
        target.id = nextId
        target.position = "before"
      }
    }
    return target
  }

  function handleColumnDragStart(
    e: React.DragEvent<HTMLSpanElement>,
    columnId: string
  ) {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", columnId)
    // Drag ghost is the whole row, not just the (only draggable) icon.
    const row = e.currentTarget.closest("li")
    if (row) {
      const rect = row.getBoundingClientRect()
      e.dataTransfer.setDragImage(
        row,
        e.clientX - rect.left,
        e.clientY - rect.top
      )
    }
    // addEventListener, not onDragEnd: motion.li intercepts that prop name.
    e.currentTarget.addEventListener("dragend", handleColumnDragEnd, {
      once: true,
    })
    draggingColumnRef.current = columnId
    dragOriginalOrderRef.current = table
      .getVisibleLeafColumns()
      .map((c) => c.id)
    dragOriginalHiddenOrderRef.current = hiddenMenuColumns.map((c) => c.id)
    dragOriginalVisibleRef.current =
      table.getColumn(columnId)?.getIsVisible() ?? null
    droppedRef.current = false
  }

  function columnGroupOrder(overId: string) {
    const overColumn = table.getColumn(overId)
    const hidden = overColumn ? !overColumn.getIsVisible() : false
    return hidden
      ? {
          hidden,
          ids: hiddenMenuColumns.map((c) => c.id),
          setOrder: setHiddenOrder,
        }
      : {
          hidden,
          ids: table.getVisibleLeafColumns().map((c) => c.id),
          setOrder: table.setColumnOrder,
        }
  }

  // Shared by dragover (live preview) and drop (commit) — reveals/hides the
  // dragged column to match whichever group it's over, then reorders it in.
  function applyColumnDrag(
    e: React.DragEvent<HTMLLIElement>,
    draggedId: string,
    overId: string
  ) {
    const draggedColumn = table.getColumn(draggedId)
    const draggedHidden = draggedColumn ? !draggedColumn.getIsVisible() : false
    const {
      hidden: overHidden,
      ids: currentOrder,
      setOrder,
    } = columnGroupOrder(overId)
    if (draggedHidden !== overHidden) {
      if (overHidden && !draggedColumn?.getCanHide()) return
      draggedColumn?.toggleVisibility(!overHidden)
    }
    const target = columnDropTarget(e, overId, currentOrder)
    const nextOrder = reorderColumnIds(
      currentOrder,
      draggedId,
      target.id,
      target.position
    )
    if (nextOrder.join() !== currentOrder.join()) {
      setOrder(nextOrder)
    }
  }

  function handleColumnDragOver(
    e: React.DragEvent<HTMLLIElement>,
    overId: string
  ) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    const draggedId = draggingColumnRef.current
    if (!draggedId || draggedId === overId) return
    applyColumnDrag(e, draggedId, overId)
  }

  function handleColumnDrop(e: React.DragEvent<HTMLLIElement>, overId: string) {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("text/plain")
    droppedRef.current = true
    if (!draggedId) return
    applyColumnDrag(e, draggedId, overId)
  }

  function handleColumnDragEnd() {
    // No drop landed — undo the live preview.
    if (!droppedRef.current) {
      if (dragOriginalHiddenOrderRef.current) {
        setHiddenOrder(dragOriginalHiddenOrderRef.current)
      }
      if (dragOriginalOrderRef.current) {
        table.setColumnOrder(dragOriginalOrderRef.current)
      }
      if (
        draggingColumnRef.current &&
        dragOriginalVisibleRef.current !== null
      ) {
        table
          .getColumn(draggingColumnRef.current)
          ?.toggleVisibility(dragOriginalVisibleRef.current)
      }
    }
    draggingColumnRef.current = null
    dragOriginalOrderRef.current = null
    dragOriginalHiddenOrderRef.current = null
    dragOriginalVisibleRef.current = null
    droppedRef.current = false
  }

  // Swaps a column with its visible neighbor; same setColumnOrder(visible ids)
  // contract the drop handler uses, so keyboard/menu and drag can't drift.
  function moveColumn(columnId: string, dir: -1 | 1) {
    const ids = table.getVisibleLeafColumns().map((c) => c.id)
    const i = ids.indexOf(columnId)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ids.length) return
    const next = [...ids]
    ;[next[i], next[j]] = [next[j], next[i]]
    table.setColumnOrder(next)
  }

  // Synced with hiddenOrder inline (not in an effect) so hide/show lands this render.
  const currentHiddenIds = table
    .getAllLeafColumns()
    .filter((column) => !column.getIsVisible())
    .map((column) => column.id)
  const mergedHiddenOrder = [
    ...hiddenOrder.filter((id) => currentHiddenIds.includes(id)),
    ...currentHiddenIds.filter((id) => !hiddenOrder.includes(id)),
  ]
  if (mergedHiddenOrder.join() !== hiddenOrder.join()) {
    setHiddenOrder(mergedHiddenOrder)
  }
  const hiddenMenuColumns = mergedHiddenOrder
    .map((id) => table.getColumn(id))
    .filter((column): column is Column<TData, unknown> => !!column)

  // One row for the Columns panel. Visible rows carry an active Hide toggle;
  // hidden rows are dimmed with a Show toggle and a disabled Pin. Dragging
  // across the visible/hidden boundary hides or reveals the column.
  function renderColumnMenuRow(
    column: Column<TData, unknown>,
    hidden: boolean
  ) {
    const pinned = column.getIsPinned()
    const label = getColumnLabel(column)
    return (
      <motion.li
        key={column.id}
        layout="position"
        transition={{ duration: 0.15 }}
        onDragOver={(e) => handleColumnDragOver(e, column.id)}
        onDrop={(e) => handleColumnDrop(e, column.id)}
        className={cn(
          "relative flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm select-none",
          hidden && "opacity-50"
        )}
      >
        {/* Only the handle is draggable — dragover/drop still target the
            whole row, since native drag events aren't gated by `draggable`. */}
        <span
          draggable
          onDragStart={(e) => handleColumnDragStart(e, column.id)}
          aria-hidden="true"
          className="flex size-5 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing"
        >
          <GripVerticalIcon className="size-4" />
        </span>
        <span className="flex-1 truncate">{label}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={hidden}
          aria-label={pinActionLabel(pinned)}
          onClick={() => column.pin(nextPinPosition(pinned))}
          className="shrink-0"
        >
          <PinIcon className={cn(pinned && "fill-current")} />
        </Button>
        {column.getCanHide() && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`${hidden ? "Show" : "Hide"} ${label} column`}
            onClick={() => column.toggleVisibility(hidden)}
            className="shrink-0"
          >
            {hidden ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        )}
      </motion.li>
    )
  }

  // Focuses the new row's first cell once the consumer's rowCount actually grows after onRowAdd.
  React.useEffect(() => {
    if (pendingAdd && rowCount > prevRowCountRef.current) {
      const targetR =
        pendingAdd.afterRowId == null
          ? rowCount - 1
          : clamp(
              rows.findIndex((row) => row.id === pendingAdd.afterRowId) + 1,
              0,
              rowCount - 1
            )
      focusTo(targetR, 0)
      setPendingAdd(null)
    }
    prevRowCountRef.current = rowCount
  }, [rowCount, pendingAdd])

  // Clears pendingAdd on rejection so a later unrelated row-count change can't steal focus.
  function handleRowAdd(afterRowId?: string) {
    if (!onRowAdd) return
    setPendingAdd({ afterRowId })
    Promise.resolve(onRowAdd(afterRowId)).catch(() => setPendingAdd(null))
  }

  function confirmRowDelete() {
    const rowId = deleteTarget
    setDeleteTarget(null)
    if (rowId == null || !onRowDelete) return
    void Promise.resolve(onRowDelete(rowId)).catch(() => {})
  }

  // A synchronous throw and a rejected promise both land here through the same try/catch.
  async function runCommit(
    rowId: string,
    columnId: string,
    columnLabel: string,
    displayValue: string,
    commitValue: unknown,
    coord: Coord
  ) {
    const key = cellKey(coord.r, coord.c)
    try {
      await onCellEdit(rowId, columnId, commitValue)
      setCommits((prev) => withoutKey(prev, key))
    } catch (err) {
      const message = normalizeErrorMessage(err)
      setCommits((prev) =>
        withKey(prev, key, {
          value: displayValue,
          pending: false,
          error: message,
        })
      )
      setLiveMessage(`${columnLabel}, row ${coord.r + 1}: ${message}`)
    }
  }

  // Shared by every editor's commit path, buffer-typed and boolean's direct toggle alike.
  function startCommit(
    r: number,
    c: number,
    displayValue: string,
    commitValue: unknown
  ) {
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    if (!cell) return
    const key = cellKey(r, c)
    setCommits((prev) =>
      withKey(prev, key, { value: displayValue, pending: true })
    )
    void runCommit(
      row.id,
      cell.column.id,
      getColumnLabel(cell.column),
      displayValue,
      commitValue,
      { r, c }
    )
  }

  function commitEdit() {
    if (!editCoord) return
    const { r, c } = editCoord
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    const type = cell?.column.columnDef.meta?.type
    const err = validateForType(type, buffer)
    setEditCoord(null)
    if (!cell || err != null) return

    const committedStr = cellDisplayValue(cell.getValue())
    // Dedup against the last successful commit, not the last attempted value, so retrying a rejected edit re-fires onCellEdit.
    if (buffer === committedStr) return

    startCommit(r, c, buffer, coerceForType(type, buffer))
  }

  // A pending/rejected commit wins over the table's own data — boolean has no buffer, so both the checkbox and toggle handler read through here.
  function booleanCellValue(r: number, c: number, tableValue: unknown) {
    const key = cellKey(r, c)
    const commit = commits.get(key)
    return commit ? commit.value === "true" : Boolean(tableValue)
  }

  function toggleBooleanCell(r: number, c: number) {
    const key = cellKey(r, c)
    if (commits.get(key)?.pending) return
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    if (!cell) return
    const next = !booleanCellValue(r, c, cell.getValue())
    startCommit(r, c, String(next), next)
  }

  // Same rule as booleanCellValue; the commit's string is a JSON-encoded array.
  function multiSelectCellValue(
    r: number,
    c: number,
    tableValue: unknown
  ): string[] {
    const key = cellKey(r, c)
    const commit = commits.get(key)
    if (commit) return JSON.parse(commit.value) as string[]
    return Array.isArray(tableValue) ? (tableValue as string[]) : []
  }

  // Commits per toggle, popover stays open. Dedups against the last successful (never attempted) set, order-normalized, so re-toggling or reordering never re-fires onCellEdit.
  function toggleMultiSelectValue(r: number, c: number, optionValue: string) {
    const key = cellKey(r, c)
    if (commits.get(key)?.pending) return
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    if (!cell) return
    const options = cell.column.columnDef.meta?.options ?? []
    const current = multiSelectCellValue(r, c, cell.getValue())
    const next = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue]
    const normalized = normalizeToOptionsOrder(next, options)
    const committed = Array.isArray(cell.getValue())
      ? (cell.getValue() as string[])
      : []
    if (arraysEqual(normalized, normalizeToOptionsOrder(committed, options))) {
      setCommits((prev) => withoutKey(prev, key))
      return
    }
    startCommit(r, c, JSON.stringify(normalized), normalized)
  }

  // Same rule as multiSelectCellValue; "" is the commit map's encoding of null.
  function userCellValue(
    r: number,
    c: number,
    tableValue: unknown
  ): string | null {
    const key = cellKey(r, c)
    const commit = commits.get(key)
    if (commit) return commit.value === "" ? null : commit.value
    return tableValue == null ? null : String(tableValue)
  }

  // Doesn't touch commits — a normal pick already committed and shouldn't be undone by closing.
  function closePopoverEditAt(r: number, c: number) {
    setEditCoord(null)
    setBuffer("")
    cellRefs.current.get(cellKey(r, c))?.focus()
  }

  // Commits-and-closes on pick, unlike multiSelect. "Unassigned" (null) is picked the same way as any real user.
  function pickUser(r: number, c: number, userId: string | null) {
    const key = cellKey(r, c)
    if (commits.get(key)?.pending) return
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    if (!cell) return
    closePopoverEditAt(r, c)
    const committed = cell.getValue()
    const committedId = committed == null ? null : String(committed)
    if (committedId === userId) return
    startCommit(r, c, userId ?? "", userId)
  }

  function cancelEdit() {
    if (!editCoord) return
    const { r, c } = editCoord
    const key = cellKey(r, c)
    setEditCoord(null)
    setBuffer("")
    setError(null)
    // Escape abandons the attempt entirely, including a previously rejected one.
    setCommits((prev) => withoutKey(prev, key))
    cellRefs.current.get(key)?.focus()
  }

  function beginEdit(r: number, c: number, seed?: string) {
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    if (!cell) return
    const type = cell.column.columnDef.meta?.type
    // boolean has no buffer-typed edit mode — see toggleBooleanCell.
    if (type === "boolean") return
    const key = cellKey(r, c)
    const commit = commits.get(key)
    // Don't stack a second edit on an unresolved pending commit.
    if (commit?.pending) return

    // Resolve the previously-editing cell first so its value isn't dropped; multiSelect/user already self-commit, so they just close.
    if (editCoord && (editCoord.r !== r || editCoord.c !== c)) {
      const oldType = columnTypeAt(editCoord.r, editCoord.c)
      if (oldType === "multiSelect" || oldType === "user") {
        setEditCoord(null)
      } else {
        suppressNextBlurRef.current = true
        commitEdit()
      }
    }

    // multiSelect/user's buffer is a search filter, not the cell value — it never seeds from the committed value.
    const isPopoverType = type === "multiSelect" || type === "user"
    const committed = cell.getValue()
    const fallback = isPopoverType
      ? ""
      : (commit?.value ?? cellDisplayValue(committed))
    const initial = seed ?? fallback
    setFocusCoord({ r, c })
    setEditCoord({ r, c })
    setBuffer(initial)
    setError(isPopoverType ? null : validateForType(type, initial))
    focusEditControl(key)
  }

  function onCellClick(r: number, c: number) {
    setSelectionAnchor(null)
    // Already editing this exact cell — let the click just move the caret.
    if (editCoord && editCoord.r === r && editCoord.c === c) return
    beginEdit(r, c)
  }

  function onGridCellKeyDown(
    e: React.KeyboardEvent<HTMLTableCellElement>,
    r: number,
    c: number
  ) {
    // While editing, the input's own handler already owns the keyboard.
    if (editCoord && editCoord.r === r && editCoord.c === c) return

    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown": {
        e.preventDefault()
        const dir = e.key === "ArrowUp" ? -1 : 1
        const target = clamp(r + dir, 0, rowCount - 1)
        if (hasSelectionColumn && e.shiftKey) {
          const anchor = selectionAnchor ?? r
          setSelectionAnchor(anchor)
          selectRowRange(anchor, target)
        } else {
          setSelectionAnchor(null)
        }
        focusTo(target, c)
        return
      }
      case "ArrowLeft":
        e.preventDefault()
        setSelectionAnchor(null)
        focusTo(r, clamp(c - 1, 0, colCount - 1))
        return
      case "ArrowRight":
        e.preventDefault()
        setSelectionAnchor(null)
        focusTo(r, clamp(c + 1, 0, colCount - 1))
        return
      case "Tab": {
        e.preventDefault()
        setSelectionAnchor(null)
        const next = wrapIndex(r, c, e.shiftKey ? -1 : 1)
        focusTo(next.r, next.c)
        return
      }
      case "Enter":
        e.preventDefault()
        setSelectionAnchor(null)
        focusTo(clamp(r + (e.shiftKey ? -1 : 1), 0, rowCount - 1), c)
        return
      case "F2":
        e.preventDefault()
        if (columnTypeAt(r, c) === "boolean") {
          toggleBooleanCell(r, c)
          return
        }
        beginEdit(r, c)
        return
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Prevent default so the keystroke isn't replayed onto the newly-focused input.
          e.preventDefault()
          const type = columnTypeAt(r, c)
          if (type === "boolean") {
            if (e.key === " ") toggleBooleanCell(r, c)
            return
          }
          // select/date can't be seeded by an arbitrary keystroke — enter edit mode preserving the value instead (same as F2).
          if (type === "select" || type === "date") {
            beginEdit(r, c)
            return
          }
          beginEdit(r, c, e.key)
        }
    }
  }

  function onEditInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const value = e.target.value
    const type = editCoord ? columnTypeAt(editCoord.r, editCoord.c) : undefined
    setBuffer(value)
    setError(validateForType(type, value))
  }

  function onEditInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    if (!editCoord) return
    const { r, c } = editCoord
    if (e.key === "Escape") {
      e.preventDefault()
      suppressNextBlurRef.current = true
      cancelEdit()
      return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      // An invalid value is never sent nor silently discarded — stay put with the error visible.
      if (error != null) return
      suppressNextBlurRef.current = true
      commitEdit()
      focusTo(clamp(r + (e.shiftKey ? -1 : 1), 0, rowCount - 1), c)
      return
    }
    if (e.key === "Tab") {
      e.preventDefault()
      if (error != null) return
      suppressNextBlurRef.current = true
      commitEdit()
      const next = wrapIndex(r, c, e.shiftKey ? -1 : 1)
      focusTo(next.r, next.c)
    }
  }

  function onEditInputBlur() {
    if (suppressNextBlurRef.current) {
      suppressNextBlurRef.current = false
      return
    }
    commitEdit()
  }

  // Positional by column order unless meta.summary marks specific columns.
  function getSummaryColumns(): Column<TData, unknown>[] {
    const visible = table.getVisibleLeafColumns()
    const flagged = visible.filter((column) => column.columnDef.meta?.summary)
    return (flagged.length > 0 ? flagged : visible).slice(0, 3)
  }

  function openCardSheet(rowId: string) {
    setOpenRowId(rowId)
  }

  function closeCardSheet() {
    setOpenRowId(null)
    setSheetBuffers({})
  }

  // In-progress keystroke wins over a pending/rejected commit, which wins over the table's data — always the raw value, since every sheet field is directly editable.
  function sheetFieldValue(r: number, c: number, tableValue: unknown): string {
    const key = cellKey(r, c)
    const buf = sheetBuffers[key]
    if (buf !== undefined) return buf
    const commit = commits.get(key)
    return cellDisplayValue(commit?.value ?? tableValue)
  }

  function sheetFieldError(r: number, c: number): string | null {
    const key = cellKey(r, c)
    const buf = sheetBuffers[key]
    if (buf !== undefined) return validateForType(columnTypeAt(r, c), buf)
    return commits.get(key)?.error ?? null
  }

  function onSheetFieldChange(r: number, c: number, value: string) {
    const key = cellKey(r, c)
    setSheetBuffers((prev) => ({ ...prev, [key]: value }))
  }

  // Same validate -> dedup -> startCommit path as commitEdit, reading the field's own buffer entry since every sheet field can be mid-edit at once.
  function commitSheetField(r: number, c: number) {
    const key = cellKey(r, c)
    const buf = sheetBuffers[key]
    if (buf === undefined) return
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    const type = cell?.column.columnDef.meta?.type
    const err = validateForType(type, buf)
    setSheetBuffers((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (!cell || err != null) return
    const committedStr = cellDisplayValue(cell.getValue())
    if (buf === committedStr) return
    startCommit(r, c, buf, coerceForType(type, buf))
  }

  // Enter commits via blur instead of inserting a newline — single-line fields.
  function onSheetFieldKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  // select has no invalid state, so it commits straight through with no buffer.
  function commitSheetSelect(r: number, c: number, raw: string) {
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    if (!cell) return
    if (raw === cellDisplayValue(cell.getValue())) return
    startCommit(r, c, raw, raw)
  }

  const firstVisibleColumnId = table.getVisibleLeafColumns()[0]?.id
  const summaryColumns = showCards ? getSummaryColumns() : []
  const titleColumn = summaryColumns[0]
  const subtitleColumns = summaryColumns.slice(1, 3)
  const openRow = openRowIndex >= 0 ? rows[openRowIndex] : undefined
  // Keeps the last real row visible during the drawer's close animation, instead of blanking on openRowId clearing.
  // Adjusted during render (React's "store info from previous render" pattern), not an effect — derived from openRowId, not an external system.
  const [trackedOpenRowId, setTrackedOpenRowId] = React.useState(openRowId)
  const [lastOpenRow, setLastOpenRow] = React.useState<
    { row: Row<TData>; index: number } | undefined
  >(undefined)
  if (openRowId !== trackedOpenRowId) {
    setTrackedOpenRowId(openRowId)
    if (openRow) setLastOpenRow({ row: openRow, index: openRowIndex })
  }
  const displayRow = openRow ?? lastOpenRow?.row
  const displayRowIndex = openRow ? openRowIndex : (lastOpenRow?.index ?? 0)

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-2", className)}>
      {showCards ? (
        <ul className="flex list-none flex-col divide-y rounded-md border ps-0">
          {rowCount === 0 ? (
            <li className="p-4 text-center text-sm text-muted-foreground">
              {emptyState}
            </li>
          ) : (
            rows.map((row) => {
              const cells = row.getVisibleCells()
              const titleCell = cells.find(
                (c) => c.column.id === titleColumn?.id
              )
              const subtitleCells = subtitleColumns
                .map((col) => cells.find((c) => c.column.id === col.id))
                .filter((c): c is NonNullable<typeof c> => c != null)
              const subtitleText = subtitleCells
                .map((c) => formatCardValue(c))
                .filter(Boolean)
                .join(" · ")
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => openCardSheet(row.id)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-accent/30"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">
                        {titleCell ? formatCardValue(titleCell) || "—" : "—"}
                      </span>
                      {subtitleText && (
                        <span className="truncate text-sm text-muted-foreground">
                          {subtitleText}
                        </span>
                      )}
                    </span>
                    <ChevronRightIcon
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                  </button>
                </li>
              )
            })
          )}
          {onRowAdd && (
            <li>
              <button
                type="button"
                onClick={() => handleRowAdd()}
                className="flex w-full items-center gap-1.5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/30 hover:text-foreground"
              >
                <PlusIcon className="size-3.5" />
                New row
              </button>
            </li>
          )}
        </ul>
      ) : (
        <>
          <div className="flex items-center justify-end">
            <Popover>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Columns"
                          >
                            <Columns3Icon className="size-4" />
                          </Button>
                        }
                      />
                    }
                  />
                  <TooltipContent>Column</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent align="end" className="w-64 p-1">
                <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                  Shown in table
                </div>
                <ul className="flex list-none flex-col gap-0.5 ps-0">
                  {table
                    .getVisibleLeafColumns()
                    .map((column) => renderColumnMenuRow(column, false))}
                </ul>
                {hiddenMenuColumns.length > 0 && (
                  <>
                    <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                      Hidden in table
                    </div>
                    <ul className="flex list-none flex-col gap-0.5 ps-0">
                      {hiddenMenuColumns.map((column) =>
                        renderColumnMenuRow(column, true)
                      )}
                    </ul>
                  </>
                )}
              </PopoverContent>
            </Popover>
          </div>
          {/* aria-rowcount includes the header row, per the grid pattern's own convention. */}
          <Table
            role="grid"
            aria-rowcount={rowCount + 1}
            aria-colcount={totalColCount}
            className="w-auto min-w-full table-fixed"
          >
            <TableHeader>
              {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {hasSelectionColumn && (
                    <TableHead className="w-10 min-w-10 p-0 text-center">
                      <div className="flex items-center justify-center px-2 py-2.5">
                        <SelectAllCheckbox
                          checked={table.getIsAllRowsSelected()}
                          indeterminate={
                            !table.getIsAllRowsSelected() &&
                            table.getIsSomeRowsSelected()
                          }
                          onCheckedChange={(checked) =>
                            table.toggleAllRowsSelected(checked)
                          }
                        />
                      </div>
                    </TableHead>
                  )}
                  {headerGroup.headers.map((header, headerIndex) => {
                    const pinned = header.column.getIsPinned()
                    // getCanSort() is true for any accessor column; only expose
                    // the affordance when the consumer actually wired a sorted
                    // row model, so a click can't be a no-op.
                    const canSort =
                      header.column.getCanSort() &&
                      table.options.getSortedRowModel != null
                    const sortDirection = header.column.getIsSorted()
                    const canMoveLeft = headerIndex > 0
                    const canMoveRight =
                      headerIndex < headerGroup.headers.length - 1
                    const stickyHeader =
                      pinned ||
                      (forceStickyFirstColumn &&
                        header.column.id === firstVisibleColumnId)
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "group relative",
                          stickyHeader && "bg-background"
                        )}
                        style={columnPinStyle(
                          header.column,
                          forceStickyFirstColumn &&
                            header.column.id === firstVisibleColumnId,
                          table.getTotalSize()
                        )}
                      >
                        {!header.isPlaceholder && (
                          <div className="flex items-center justify-between gap-1 pe-2">
                            {canSort ? (
                              <button
                                type="button"
                                onClick={header.column.getToggleSortingHandler()}
                                aria-label={`Sort by ${getColumnLabel(header.column)}`}
                                className="flex min-w-0 flex-1 items-center gap-1 text-left"
                              >
                                <span className="truncate">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </span>
                                {sortIcon(sortDirection)}
                              </button>
                            ) : (
                              <span className="truncate">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </span>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    aria-label={`${getColumnLabel(header.column)} column options`}
                                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100"
                                  >
                                    <MoreVerticalIcon />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                  disabled={!canMoveLeft}
                                  onClick={() =>
                                    moveColumn(header.column.id, -1)
                                  }
                                >
                                  Move left
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={!canMoveRight}
                                  onClick={() =>
                                    moveColumn(header.column.id, 1)
                                  }
                                >
                                  Move right
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {header.column.getCanHide() && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      header.column.toggleVisibility(false)
                                    }
                                  >
                                    Hide column
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    header.column.pin(nextPinPosition(pinned))
                                  }
                                >
                                  {pinActionLabel(pinned)}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                        {header.column.getCanResize() && (
                          <div
                            role="separator"
                            aria-orientation="vertical"
                            aria-label={`Resize ${getColumnLabel(header.column)} column`}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            onDoubleClick={() => header.column.resetSize()}
                            className="absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none hover:bg-accent"
                            style={
                              header.column.getIsResizing()
                                ? {
                                    transform: `translateX(${table.getState().columnSizingInfo.deltaOffset ?? 0}px)`,
                                  }
                                : undefined
                            }
                          />
                        )}
                      </TableHead>
                    )
                  })}
                  {hasDeleteColumn && (
                    <TableHead aria-hidden="true" className="w-10 min-w-10" />
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rowCount === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={totalColCount}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyState}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, r) => {
                  // Absolutely positioned against the row, not its own <tr> — a table row/cell can't render at height:0 (browsers floor it ~1px), which would show as a second hairline.
                  const showInsertAfter = onRowAdd && r < rowCount - 1
                  const insertAfterButton = showInsertAfter && (
                    <button
                      type="button"
                      aria-label={`Insert row after row ${r + 1}`}
                      onClick={() => handleRowAdd(row.id)}
                      className="absolute inset-x-0 bottom-0 z-10 flex h-4 translate-y-1/2 items-center justify-center opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100"
                    >
                      <span className="flex size-5 items-center justify-center rounded-full border bg-background shadow-sm">
                        <PlusIcon className="size-3" />
                      </span>
                    </button>
                  )

                  return (
                    <TableRow key={row.id} className="group/row relative">
                      {hasSelectionColumn && (
                        <TableCell className="w-10 min-w-10 p-0 text-center align-top">
                          <div className="flex items-center justify-center px-2 py-2.5">
                            <Checkbox
                              checked={row.getIsSelected()}
                              aria-label={`Select row ${r + 1}`}
                              onCheckedChange={(_checked, eventDetails) =>
                                onRowCheckboxChange(r, eventDetails.event)
                              }
                            />
                          </div>
                        </TableCell>
                      )}
                      {row.getVisibleCells().map((cell, c) => {
                        const key = cellKey(r, c)
                        const isFocused =
                          focusCoord.r === r && focusCoord.c === c
                        const isEditing =
                          editCoord?.r === r && editCoord?.c === c
                        const commit = commits.get(key)
                        const isPending = commit?.pending ?? false
                        const columnType = cell.column.columnDef.meta?.type
                        const isPlainInputColumn =
                          columnType === "text" ||
                          columnType === "number" ||
                          columnType === "currency" ||
                          columnType === "date"
                        const isSelectColumn = columnType === "select"
                        const isBooleanColumn = columnType === "boolean"
                        const isMultiSelectColumn = columnType === "multiSelect"
                        const isUserColumn = columnType === "user"
                        // multiSelect's popover can stay open through a rejected toggle-commit, so it always reads the commit's error, not the buffer-editor's live `error`.
                        const displayError =
                          isEditing && !isMultiSelectColumn
                            ? error
                            : (commit?.error ?? null)
                        const showError = displayError != null
                        const value = cell.getValue()
                        const cellErrorId = `${errorId}-${key}`
                        const isLastCell =
                          !hasDeleteColumn && c === colCount - 1
                        const forceSticky =
                          forceStickyFirstColumn &&
                          cell.column.id === firstVisibleColumnId
                        const isPinned =
                          cell.column.getIsPinned() || forceSticky

                        return (
                          <TableCell
                            key={cell.id}
                            ref={setMapRef(cellRefs, key)}
                            role="gridcell"
                            tabIndex={isFocused ? 0 : -1}
                            onFocus={() => setFocusCoord({ r, c })}
                            onClick={() => onCellClick(r, c)}
                            onKeyDown={(e) => onGridCellKeyDown(e, r, c)}
                            style={columnPinStyle(
                              cell.column,
                              forceSticky,
                              table.getTotalSize()
                            )}
                            className={cn(
                              "p-0 align-top whitespace-normal outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                              isPinned && "bg-background"
                            )}
                          >
                            {isPlainInputColumn ? (
                              <>
                                <div className="relative">
                                  {columnType === "currency" && isEditing && (
                                    <span
                                      aria-hidden="true"
                                      className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground"
                                    >
                                      $
                                    </span>
                                  )}
                                  <Input
                                    ref={setMapRef(inputRefs, key)}
                                    type={
                                      columnType === "date"
                                        ? "date"
                                        : columnType === "number"
                                          ? "number"
                                          : "text"
                                    }
                                    value={
                                      isEditing
                                        ? buffer
                                        : formatReadValue(
                                            columnType,
                                            commit?.value ?? value
                                          )
                                    }
                                    readOnly={!isEditing}
                                    disabled={isPending}
                                    tabIndex={-1}
                                    aria-invalid={showError || undefined}
                                    aria-describedby={
                                      showError ? cellErrorId : undefined
                                    }
                                    onMouseDown={(e) => {
                                      if (!isEditing) e.preventDefault()
                                    }}
                                    onChange={
                                      isEditing ? onEditInputChange : undefined
                                    }
                                    onKeyDown={
                                      isEditing ? onEditInputKeyDown : undefined
                                    }
                                    onBlur={
                                      isEditing ? onEditInputBlur : undefined
                                    }
                                    className={cn(
                                      "h-auto rounded-none border-none bg-transparent px-2 py-2 shadow-none hover:bg-accent/30 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:bg-transparent",
                                      columnType === "currency" &&
                                        isEditing &&
                                        "pl-5",
                                      isPending && "pr-7"
                                    )}
                                  />
                                  {isPending && (
                                    <Spinner
                                      role="presentation"
                                      aria-hidden="true"
                                      aria-label={undefined}
                                      className="absolute top-1/2 right-2 size-3.5 -translate-y-1/2"
                                    />
                                  )}
                                </div>
                                {showError && (
                                  <span
                                    id={cellErrorId}
                                    className="block px-2 pb-1.5 text-xs text-destructive"
                                  >
                                    {displayError}
                                  </span>
                                )}
                              </>
                            ) : isSelectColumn ? (
                              <>
                                <div className="relative">
                                  <select
                                    ref={setMapRef(selectRefs, key)}
                                    value={
                                      isEditing
                                        ? buffer
                                        : cellDisplayValue(
                                            commit?.value ?? value
                                          )
                                    }
                                    disabled={!isEditing || isPending}
                                    tabIndex={-1}
                                    aria-invalid={showError || undefined}
                                    aria-describedby={
                                      showError ? cellErrorId : undefined
                                    }
                                    onMouseDown={(e) => {
                                      if (!isEditing) e.preventDefault()
                                    }}
                                    onChange={
                                      isEditing ? onEditInputChange : undefined
                                    }
                                    onKeyDown={
                                      isEditing ? onEditInputKeyDown : undefined
                                    }
                                    onBlur={
                                      isEditing ? onEditInputBlur : undefined
                                    }
                                    className={cn(
                                      "h-auto w-full appearance-none rounded-none border-none bg-transparent px-2 py-2 text-sm shadow-none hover:bg-accent/30 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default disabled:opacity-100 dark:bg-transparent",
                                      isPending && "pr-7"
                                    )}
                                  >
                                    {cell.column.columnDef.meta?.options?.map(
                                      (opt) => (
                                        <option
                                          key={opt.value}
                                          value={opt.value}
                                        >
                                          {opt.label}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  {isPending && (
                                    <Spinner
                                      role="presentation"
                                      aria-hidden="true"
                                      aria-label={undefined}
                                      className="absolute top-1/2 right-2 size-3.5 -translate-y-1/2"
                                    />
                                  )}
                                </div>
                                {showError && (
                                  <span
                                    id={cellErrorId}
                                    className="block px-2 pb-1.5 text-xs text-destructive"
                                  >
                                    {displayError}
                                  </span>
                                )}
                              </>
                            ) : isBooleanColumn ? (
                              <>
                                <div className="flex items-center px-2 py-2 hover:bg-accent/30">
                                  <Checkbox
                                    checked={booleanCellValue(r, c, value)}
                                    disabled={isPending}
                                    tabIndex={-1}
                                    aria-invalid={showError || undefined}
                                    aria-describedby={
                                      showError ? cellErrorId : undefined
                                    }
                                    aria-label={`${getColumnLabel(cell.column)}, row ${r + 1}`}
                                    onCheckedChange={() =>
                                      toggleBooleanCell(r, c)
                                    }
                                  />
                                  {isPending && (
                                    <Spinner
                                      role="presentation"
                                      aria-hidden="true"
                                      aria-label={undefined}
                                      className="ml-2 size-3.5"
                                    />
                                  )}
                                </div>
                                {showError && (
                                  <span
                                    id={cellErrorId}
                                    className="block px-2 pb-1.5 text-xs text-destructive"
                                  >
                                    {displayError}
                                  </span>
                                )}
                              </>
                            ) : isMultiSelectColumn ? (
                              <>
                                <Popover
                                  open={isEditing}
                                  onOpenChange={(next) =>
                                    next
                                      ? beginEdit(r, c)
                                      : closePopoverEditAt(r, c)
                                  }
                                >
                                  <PopoverTrigger
                                    render={
                                      <button
                                        type="button"
                                        tabIndex={-1}
                                        disabled={isPending}
                                        aria-invalid={showError || undefined}
                                        aria-describedby={
                                          showError ? cellErrorId : undefined
                                        }
                                        aria-label={`${getColumnLabel(cell.column)}, row ${r + 1}`}
                                        className="flex w-full items-center gap-1 overflow-hidden px-2 py-2 hover:bg-accent/30 focus-visible:bg-background disabled:cursor-default"
                                      >
                                        {renderMultiSelectTrigger(
                                          multiSelectCellValue(r, c, value),
                                          cell.column.columnDef.meta?.options ??
                                            [],
                                          cell.column.columnDef.meta
                                            ?.maxChips ?? 2
                                        )}
                                        {isPending && (
                                          <Spinner
                                            role="presentation"
                                            aria-hidden="true"
                                            aria-label={undefined}
                                            className="ml-auto size-3.5 shrink-0"
                                          />
                                        )}
                                      </button>
                                    }
                                  />
                                  <PopoverContent
                                    align="start"
                                    className="w-64 p-0"
                                  >
                                    <Command>
                                      <CommandInput
                                        placeholder="Search options..."
                                        value={buffer}
                                        onValueChange={setBuffer}
                                      />
                                      <CommandList>
                                        <CommandEmpty>No options.</CommandEmpty>
                                        <CommandGroup>
                                          {(
                                            cell.column.columnDef.meta
                                              ?.options ?? []
                                          ).map((opt) => (
                                            <CommandItem
                                              key={opt.value}
                                              value={opt.label}
                                              data-checked={
                                                multiSelectCellValue(
                                                  r,
                                                  c,
                                                  value
                                                ).includes(opt.value)
                                                  ? "true"
                                                  : undefined
                                              }
                                              onSelect={() =>
                                                toggleMultiSelectValue(
                                                  r,
                                                  c,
                                                  opt.value
                                                )
                                              }
                                            >
                                              {opt.label}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                {showError && (
                                  <span
                                    id={cellErrorId}
                                    className="block px-2 pb-1.5 text-xs text-destructive"
                                  >
                                    {displayError}
                                  </span>
                                )}
                              </>
                            ) : isUserColumn ? (
                              <>
                                <Popover
                                  open={isEditing}
                                  onOpenChange={(next) =>
                                    next
                                      ? beginEdit(r, c)
                                      : closePopoverEditAt(r, c)
                                  }
                                >
                                  <PopoverTrigger
                                    render={
                                      <button
                                        type="button"
                                        tabIndex={-1}
                                        disabled={isPending}
                                        aria-invalid={showError || undefined}
                                        aria-describedby={
                                          showError ? cellErrorId : undefined
                                        }
                                        aria-label={`${getColumnLabel(cell.column)}, row ${r + 1}`}
                                        className="flex w-full items-center gap-2 overflow-hidden px-2 py-1.5 hover:bg-accent/30 focus-visible:bg-background disabled:cursor-default"
                                      >
                                        {renderUserTrigger(
                                          userCellValue(r, c, value),
                                          cell.column.columnDef.meta?.users ??
                                            []
                                        )}
                                        {isPending && (
                                          <Spinner
                                            role="presentation"
                                            aria-hidden="true"
                                            aria-label={undefined}
                                            className="ml-auto size-3.5 shrink-0"
                                          />
                                        )}
                                      </button>
                                    }
                                  />
                                  <PopoverContent
                                    align="start"
                                    className="w-64 p-0"
                                  >
                                    <Command>
                                      <CommandInput
                                        placeholder="Search people..."
                                        value={buffer}
                                        onValueChange={setBuffer}
                                      />
                                      <CommandList>
                                        <CommandEmpty>No people.</CommandEmpty>
                                        <CommandGroup>
                                          <CommandItem
                                            value="Unassigned"
                                            data-checked={
                                              userCellValue(r, c, value) == null
                                                ? "true"
                                                : undefined
                                            }
                                            onSelect={() =>
                                              pickUser(r, c, null)
                                            }
                                          >
                                            Unassigned
                                          </CommandItem>
                                          {(
                                            cell.column.columnDef.meta?.users ??
                                            []
                                          ).map((u) => (
                                            <CommandItem
                                              key={u.id}
                                              value={u.name}
                                              data-checked={
                                                userCellValue(r, c, value) ===
                                                u.id
                                                  ? "true"
                                                  : undefined
                                              }
                                              onSelect={() =>
                                                pickUser(r, c, u.id)
                                              }
                                            >
                                              <Avatar size="sm">
                                                {u.avatarUrl && (
                                                  <AvatarImage
                                                    src={u.avatarUrl}
                                                    alt=""
                                                  />
                                                )}
                                                <AvatarFallback>
                                                  {initials(u.name)}
                                                </AvatarFallback>
                                              </Avatar>
                                              {u.name}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                {showError && (
                                  <span
                                    id={cellErrorId}
                                    className="block px-2 pb-1.5 text-xs text-destructive"
                                  >
                                    {displayError}
                                  </span>
                                )}
                              </>
                            ) : (
                              <div className="px-2 py-2">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            )}
                            {isLastCell && insertAfterButton}
                          </TableCell>
                        )
                      })}
                      {hasDeleteColumn && (
                        <TableCell className="w-10 min-w-10 p-0 text-center align-top">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Row ${r + 1} actions`}
                                  className="size-7 opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100"
                                >
                                  <MoreHorizontalIcon className="size-3.5" />
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteTarget(row.id)}
                              >
                                Delete row
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {insertAfterButton}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
              {onRowAdd && (
                <TableRow className="border-none">
                  <TableCell colSpan={totalColCount} className="p-0">
                    <button
                      type="button"
                      onClick={() => handleRowAdd()}
                      className="flex w-full items-center gap-1.5 px-2 py-2 text-sm text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                    >
                      <PlusIcon className="size-3.5" />
                      New row
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
      {showCards && displayRow && (
        <Drawer
          open={openRow != null}
          showSwipeHandle
          onOpenChange={(open) => {
            if (!open) closeCardSheet()
          }}
        >
          <DrawerContent className="h-[50vh]">
            <DrawerHeader>
              <DrawerTitle>
                {titleColumn
                  ? formatCardValue(
                      displayRow
                        .getVisibleCells()
                        .find((c) => c.column.id === titleColumn.id)!
                    ) || "—"
                  : "Row details"}
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
              {displayRow.getVisibleCells().map((cell, c) => {
                const r = displayRowIndex
                const key = cellKey(r, c)
                const columnType = cell.column.columnDef.meta?.type
                const columnLabel = getColumnLabel(cell.column)
                const commit = commits.get(key)
                const isPending = commit?.pending ?? false
                const cellErrorId = `${errorId}-sheet-${key}`
                const fieldError =
                  columnType == null || columnType === "boolean"
                    ? null
                    : sheetFieldError(r, c)
                const showError = fieldError != null
                const value = cell.getValue()

                const isPlainInputColumn =
                  columnType === "text" ||
                  columnType === "number" ||
                  columnType === "currency" ||
                  columnType === "date"

                const labelId = `${key}-label`

                return (
                  <div key={cell.id} className="flex flex-col gap-1">
                    <label
                      id={labelId}
                      className="text-sm font-medium text-foreground"
                    >
                      {columnLabel}
                    </label>
                    {isPlainInputColumn ? (
                      <div className="relative">
                        <Input
                          aria-labelledby={labelId}
                          type={
                            columnType === "date"
                              ? "date"
                              : columnType === "number" ||
                                  columnType === "currency"
                                ? "number"
                                : "text"
                          }
                          value={sheetFieldValue(r, c, value)}
                          disabled={isPending}
                          aria-invalid={showError || undefined}
                          aria-describedby={showError ? cellErrorId : undefined}
                          onChange={(e) =>
                            onSheetFieldChange(r, c, e.target.value)
                          }
                          onKeyDown={onSheetFieldKeyDown}
                          onBlur={() => commitSheetField(r, c)}
                          className={cn(isPending && "pr-7")}
                        />
                        {isPending && (
                          <Spinner
                            role="presentation"
                            aria-hidden="true"
                            aria-label={undefined}
                            className="absolute top-1/2 right-2 size-3.5 -translate-y-1/2"
                          />
                        )}
                      </div>
                    ) : columnType === "select" ? (
                      <select
                        aria-labelledby={labelId}
                        value={sheetFieldValue(r, c, value)}
                        disabled={isPending}
                        aria-invalid={showError || undefined}
                        onChange={(e) =>
                          commitSheetSelect(r, c, e.target.value)
                        }
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm disabled:opacity-50"
                      >
                        {cell.column.columnDef.meta?.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : columnType === "boolean" ? (
                      <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                        <Checkbox
                          aria-labelledby={labelId}
                          checked={booleanCellValue(r, c, value)}
                          disabled={isPending}
                          onCheckedChange={() => toggleBooleanCell(r, c)}
                        />
                        {isPending && <Spinner className="size-3.5" />}
                      </div>
                    ) : columnType === "multiSelect" ? (
                      <div
                        role="group"
                        aria-labelledby={labelId}
                        className="flex flex-col gap-1 rounded-md border p-2"
                      >
                        {(cell.column.columnDef.meta?.options ?? []).map(
                          (opt) => {
                            const selected = multiSelectCellValue(
                              r,
                              c,
                              value
                            ).includes(opt.value)
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                disabled={isPending}
                                aria-pressed={selected}
                                onClick={() =>
                                  toggleMultiSelectValue(r, c, opt.value)
                                }
                                className={cn(
                                  "flex items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent/30 disabled:opacity-50",
                                  selected && "bg-accent/50"
                                )}
                              >
                                {opt.label}
                              </button>
                            )
                          }
                        )}
                      </div>
                    ) : columnType === "user" ? (
                      <div
                        role="group"
                        aria-labelledby={labelId}
                        className="flex flex-col gap-1 rounded-md border p-2"
                      >
                        <button
                          type="button"
                          disabled={isPending}
                          aria-pressed={userCellValue(r, c, value) == null}
                          onClick={() => pickUser(r, c, null)}
                          className={cn(
                            "rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent/30 disabled:opacity-50",
                            userCellValue(r, c, value) == null && "bg-accent/50"
                          )}
                        >
                          Unassigned
                        </button>
                        {(cell.column.columnDef.meta?.users ?? []).map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            disabled={isPending}
                            aria-pressed={userCellValue(r, c, value) === u.id}
                            onClick={() => pickUser(r, c, u.id)}
                            className={cn(
                              "rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent/30 disabled:opacity-50",
                              userCellValue(r, c, value) === u.id &&
                                "bg-accent/50"
                            )}
                          >
                            {u.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div
                        role="group"
                        aria-labelledby={labelId}
                        className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    )}
                    {showError && (
                      <span
                        id={cellErrorId}
                        className="text-xs text-destructive"
                      >
                        {fieldError}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            {onRowDelete && (
              <DrawerFooter>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteTarget(displayRow.id)}
                >
                  <Trash2Icon className="size-4" />
                  Delete row
                </Button>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      )}
      {hasDeleteColumn && (
        <AlertDialog
          open={deleteTarget != null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete row</AlertDialogTitle>
              <AlertDialogDescription>
                This action can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={confirmRowDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {/* Commit errors only — silent on pending and on success. */}
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>
    </div>
  )
}
