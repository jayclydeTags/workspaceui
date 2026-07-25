"use client"

import * as React from "react"
import {
  flexRender,
  type Column,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import {
  Columns3Icon,
  GripVerticalIcon,
  MoreHorizontalIcon,
  PinIcon,
  PlusIcon,
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  className?: string
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

// A leading checkbox column renders automatically whenever the table's own
// row-selection feature is enabled — TanStack's own default, so this needs
// no separate DataGrid prop to remember. A consumer who doesn't want
// selection at all opts out the same way they would with plain TanStack:
// `enableRowSelection: false` on their useReactTable() call.
function hasRowSelectionEnabled<TData>(table: TanstackTable<TData>): boolean {
  return table.options.enableRowSelection !== false
}

// A naive insert-before-target no-ops on an adjacent swap: removing the
// dragged id shifts the target's own index back into the slot the drop
// intended to fill. The midpoint-derived before/after position fixes that.
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

function columnPinStyle<TData>(
  column: Column<TData, unknown>
): React.CSSProperties {
  const pinned = column.getIsPinned()
  return {
    width: column.getSize(),
    ...(pinned === "left" && {
      position: "sticky",
      left: column.getStart("left"),
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

// Takes the ref object itself (not `.current`) so `.current` is only read
// when the callback fires, not while building it during render.
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

// A cell's committed value, coerced to the string every editor's buffer is
// typed as — null/undefined read as empty rather than the literal
// "null"/"undefined".
function cellDisplayValue(value: unknown): string {
  return value == null ? "" : String(value)
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
})

// Read-mode-only formatting on top of cellDisplayValue — currency gets its
// symbol/decimals. select doesn't need a case here: a native <option> looks
// up its own label from the raw value for free.
function formatReadValue(type: DataGridColumnType | undefined, raw: unknown) {
  if (type !== "currency" || raw == null || raw === "")
    return cellDisplayValue(raw)
  const n = typeof raw === "number" ? raw : Number(raw)
  return Number.isNaN(n) ? cellDisplayValue(raw) : currencyFormatter.format(n)
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

// A cell's in-flight or rejected commit — the typed value it's holding on
// screen, whether it's still pending, and (once rejected) the error to show.
// One entry per cell key so pending/value/error can't drift out of sync with
// each other.
interface CellCommit {
  value: string
  pending: boolean
  error?: string
}

// ponytail: "required" (+ "must be a number" for number/currency) is the
// only validation until a real validation hook lands. boolean never fails —
// a checkbox has no invalid state.
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
 * Per-type default values for a new row — "" for text/date, 0 for
 * number/currency, false for boolean, the first option for select, [] for
 * multiSelect, null for user. Columns without a `meta.type` are omitted.
 * The grid never owns data, so it can't append a row itself: call this from
 * your own `onRowAdd` to seed the record you construct and insert.
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
  className,
}: DataGridProps<TData>) {
  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const colCount = headerGroups[0]?.headers.length ?? 0
  const rowCount = rows.length
  const hasDeleteColumn = onRowDelete != null
  const hasSelectionColumn = hasRowSelectionEnabled(table)
  const totalColCount =
    colCount + (hasDeleteColumn ? 1 : 0) + (hasSelectionColumn ? 1 : 0)

  const [focusCoord, setFocusCoord] = React.useState<Coord>({ r: 0, c: 0 })
  const [editCoord, setEditCoord] = React.useState<Coord | null>(null)
  const [buffer, setBuffer] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  // Async commit state, keyed by "r-c" — independent of editCoord so a
  // commit can stay pending (or errored) on a cell after focus has moved on.
  // Cleared entirely on success, since the table's own data takes back over.
  const [commits, setCommits] = React.useState<Map<string, CellCommit>>(
    new Map()
  )
  const [liveMessage, setLiveMessage] = React.useState("")

  // Set right before calling onRowAdd, consumed once the consumer's data
  // update lands and rowCount actually grows — that's the only signal the
  // grid gets back, since it never owns data itself.
  const [pendingAdd, setPendingAdd] = React.useState<{
    afterRowId?: string
  } | null>(null)
  const prevRowCountRef = React.useRef(rowCount)
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null)

  // Row-level range selection is anchor-and-extend: the row a plain
  // click/keyboard-move last landed on, extended by a later Shift+Click or
  // Shift+ArrowUp/Down. Cleared on any plain (non-shift) move so the next
  // extension starts fresh from wherever the user is now.
  const [selectionAnchor, setSelectionAnchor] = React.useState<number | null>(
    null
  )

  // Set on every dragover inside the Columns panel; read (and cleared) on
  // drop. The dragged column's own id travels through the native
  // DataTransfer instead, since that's the only thing readable at drop time.
  const [dropTarget, setDropTarget] = React.useState<{
    id: string
    position: "before" | "after"
  } | null>(null)

  const cellRefs = React.useRef(new Map<string, HTMLTableCellElement>())
  const inputRefs = React.useRef(new Map<string, HTMLInputElement>())
  const selectRefs = React.useRef(new Map<string, HTMLSelectElement>())
  // Enter/Tab/Escape move focus themselves after resolving the cell (commit
  // or cancel); the resulting native blur on the old input must not run a
  // second, stale commit. Set right before an explicit move, consumed once.
  const suppressNextBlurRef = React.useRef(false)
  const errorId = React.useId()

  function columnTypeAt(r: number, c: number): DataGridColumnType | undefined {
    return rows[r]?.getVisibleCells()[c]?.column.columnDef.meta?.type
  }

  // Only text/number/currency/date land in inputRefs; select lands in
  // selectRefs. Never both for the same key, so trying one then the other
  // finds whichever control this cell actually rendered.
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

  // Row-level only: selects every row between a and b inclusive, replacing
  // whatever was selected before — the same "click, then shift-click/arrow
  // to extend" model file explorers use. Cell-range selection (Shift+Left/
  // Right) is deliberately not implemented; those keys stay unbound.
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

  // Takes the column the caller already has, rather than columnId + a
  // table.getColumn() lookup back through the table.
  function getColumnLabel(column: Column<TData, unknown>): string {
    const header = column.columnDef.header
    return typeof header === "string" ? header : column.id
  }

  const columnOrderState = table.getState().columnOrder
  const columnSizingState = table.getState().columnSizing
  const columnPinningState = table.getState().columnPinning
  const isMountedRef = React.useRef(false)

  // Resize, pin, and reorder all mutate the table's own (TanStack-managed)
  // state directly — no internal copy to keep in sync. This just reports
  // that state out whenever it actually changes, so a consumer can persist
  // it; omitting the callback doesn't disable resize/pin/reorder themselves.
  // Skips the mount-time run so it only fires after a real change.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnOrderState, columnSizingState, columnPinningState])

  function handleColumnDragStart(
    e: React.DragEvent<HTMLLIElement>,
    columnId: string
  ) {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", columnId)
  }

  function handleColumnDragOver(
    e: React.DragEvent<HTMLLIElement>,
    overId: string
  ) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    const rect = e.currentTarget.getBoundingClientRect()
    const midpointY = rect.top + rect.height / 2
    const position: "before" | "after" =
      e.clientY < midpointY ? "before" : "after"
    setDropTarget((prev) =>
      prev && prev.id === overId && prev.position === position
        ? prev
        : { id: overId, position }
    )
  }

  function handleColumnDrop(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("text/plain")
    const target = dropTarget
    setDropTarget(null)
    if (!draggedId || !target) return
    const currentOrder = table.getVisibleLeafColumns().map((c) => c.id)
    table.setColumnOrder(
      reorderColumnIds(currentOrder, draggedId, target.id, target.position)
    )
  }

  function handleColumnDragEnd() {
    setDropTarget(null)
  }

  // Fires once the consumer hands back a grown row set after onRowAdd —
  // focuses the new row's first cell, whether it landed at the end (append)
  // or right after afterRowId (insert).
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowCount, pendingAdd])

  // ponytail: row add/delete have no pending/error UI of their own — unlike
  // onCellEdit, the spec doesn't ask for one. Still clear pendingAdd on
  // rejection so a later unrelated row-count change can't be mistaken for
  // this add having landed and steal focus to the wrong row.
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

  // Always treats onCellEdit as async: a synchronous throw and a rejected
  // promise both land here, through the same try/catch. displayValue is what
  // a rejected commit re-shows on screen (always a string); commitValue is
  // what actually reaches the consumer, coerced to the column's real type.
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

  // Shared by every editor's commit path — the buffer-typed ones (text,
  // number, currency, select, date) after their own dedup/coerce, and
  // boolean's direct one-click toggle, which has no buffer to dedup against.
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
    // Dedup against the last *successful* commit (the table's own data),
    // never the last attempted value — so retrying a rejected edit with the
    // same value fires onCellEdit again instead of no-opping.
    if (buffer === committedStr) return

    startCommit(r, c, buffer, coerceForType(type, buffer))
  }

  // A pending/rejected commit's string value wins over the table's own data,
  // same rule every other type's isEditing ? buffer : commit?.value follows —
  // boolean just has no buffer, so both the checkbox's checked prop and the
  // toggle handler read it through here instead of duplicating the check.
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

  function cancelEdit() {
    if (!editCoord) return
    const { r, c } = editCoord
    const key = cellKey(r, c)
    setEditCoord(null)
    setBuffer("")
    setError(null)
    // Escape abandons the in-progress attempt entirely, including a
    // previously rejected one — back to the last value the table actually
    // has.
    setCommits((prev) => withoutKey(prev, key))
    cellRefs.current.get(key)?.focus()
  }

  function beginEdit(r: number, c: number, seed?: string) {
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    if (!cell) return
    const type = cell.column.columnDef.meta?.type
    // boolean has no buffer-typed edit mode — a click or F2/Space toggles
    // and commits directly (see toggleBooleanCell).
    if (type === "boolean") return
    const key = cellKey(r, c)
    const commit = commits.get(key)
    // A pending commit's control is disabled — don't let a second edit
    // stack on top of an unresolved one.
    if (commit?.pending) return

    // Switching directly from one editing cell to another: resolve the old
    // one first so its value isn't silently dropped.
    if (editCoord && (editCoord.r !== r || editCoord.c !== c)) {
      suppressNextBlurRef.current = true
      commitEdit()
    }

    const committed = cell.getValue()
    const fallback = commit?.value ?? cellDisplayValue(committed)
    const initial = seed ?? fallback
    setFocusCoord({ r, c })
    setEditCoord({ r, c })
    setBuffer(initial)
    setError(validateForType(type, initial))
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
    // Keydown bubbles from the focused input up to this cell — while editing,
    // the input's own handler already owns the keyboard.
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
          // Focus is about to jump from this cell to the input mid-event;
          // prevent the default so the keystroke isn't replayed a second
          // time onto the newly-focused control.
          e.preventDefault()
          const type = columnTypeAt(r, c)
          // boolean has no text to type-to-replace — only Space toggles it.
          if (type === "boolean") {
            if (e.key === " ") toggleBooleanCell(r, c)
            return
          }
          // select is restricted to column.meta.options and date needs a
          // real date, so an arbitrary keystroke can't seed either one —
          // both still enter edit mode, just preserving instead of
          // replacing (same as F2).
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
      // An invalid value is never sent to onCellEdit — and never silently
      // discarded either. Stay put so the visible error stays visible.
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

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-end">
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" size="sm">
                <Columns3Icon className="size-4" />
                Columns
              </Button>
            }
          />
          <PopoverContent align="end" className="w-56 p-1">
            <ul className="flex flex-col gap-0.5">
              {table.getVisibleLeafColumns().map((column) => (
                <li
                  key={column.id}
                  draggable
                  onDragStart={(e) => handleColumnDragStart(e, column.id)}
                  onDragOver={(e) => handleColumnDragOver(e, column.id)}
                  onDrop={handleColumnDrop}
                  onDragEnd={handleColumnDragEnd}
                  className={cn(
                    "flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none",
                    dropTarget?.id === column.id &&
                      (dropTarget.position === "before"
                        ? "border-t-2 border-primary"
                        : "border-b-2 border-primary")
                  )}
                >
                  <GripVerticalIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="truncate">{getColumnLabel(column)}</span>
                </li>
              ))}
            </ul>
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
                <TableHead aria-hidden="true" className="w-10" />
              )}
              {headerGroup.headers.map((header) => {
                const pinned = header.column.getIsPinned()
                return (
                  <TableHead
                    key={header.id}
                    className={cn("group relative", pinned && "bg-background")}
                    style={columnPinStyle(header.column)}
                  >
                    {!header.isPlaceholder && (
                      <div className="flex items-center justify-between gap-1 pe-2">
                        <span className="truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        <button
                          type="button"
                          aria-label={pinActionLabel(pinned)}
                          onClick={() =>
                            header.column.pin(nextPinPosition(pinned))
                          }
                          className="shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent focus-visible:opacity-100"
                        >
                          <PinIcon
                            className={cn("size-3.5", pinned && "fill-current")}
                          />
                        </button>
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
                <TableHead aria-hidden="true" className="w-10" />
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
                No results.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, r) => {
              // Renders in whichever cell ends up last in the row (the
              // delete kebab's when present, else the last data cell) —
              // never its own <tr>. A near-zero-height row is still a real
              // table row, and browsers floor a table row/cell's rendered
              // height at ~1px regardless of an explicit height:0, which
              // reads as a second hairline next to the row's own border.
              // Positioned absolutely against the *row* (the cell that
              // hosts it stays position:static), so it spans full width and
              // hangs off the row's real border with no extra DOM row.
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
                    <TableCell className="w-10 p-0 text-center align-top">
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
                    const isFocused = focusCoord.r === r && focusCoord.c === c
                    const isEditing = editCoord?.r === r && editCoord?.c === c
                    const commit = commits.get(key)
                    const isPending = commit?.pending ?? false
                    // While editing, only the live validation error shows —
                    // once committed (successfully or not), a rejection uses
                    // the same red-text-under-the-cell treatment instead.
                    const displayError = isEditing
                      ? error
                      : (commit?.error ?? null)
                    const showError = displayError != null
                    const columnType = cell.column.columnDef.meta?.type
                    const isPlainInputColumn =
                      columnType === "text" ||
                      columnType === "number" ||
                      columnType === "currency" ||
                      columnType === "date"
                    const isSelectColumn = columnType === "select"
                    const isBooleanColumn = columnType === "boolean"
                    const value = cell.getValue()
                    const cellErrorId = `${errorId}-${key}`
                    const isLastCell = !hasDeleteColumn && c === colCount - 1
                    const isPinned = cell.column.getIsPinned()

                    return (
                      <TableCell
                        key={cell.id}
                        ref={setMapRef(cellRefs, key)}
                        role="gridcell"
                        tabIndex={isFocused ? 0 : -1}
                        onFocus={() => setFocusCoord({ r, c })}
                        onClick={() => onCellClick(r, c)}
                        onKeyDown={(e) => onGridCellKeyDown(e, r, c)}
                        style={columnPinStyle(cell.column)}
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
                                onBlur={isEditing ? onEditInputBlur : undefined}
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
                                    : cellDisplayValue(commit?.value ?? value)
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
                                onBlur={isEditing ? onEditInputBlur : undefined}
                                className={cn(
                                  "h-auto w-full appearance-none rounded-none border-none bg-transparent px-2 py-2 text-sm shadow-none hover:bg-accent/30 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-default disabled:opacity-100 dark:bg-transparent",
                                  isPending && "pr-7"
                                )}
                              >
                                {cell.column.columnDef.meta?.options?.map(
                                  (opt) => (
                                    <option key={opt.value} value={opt.value}>
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
                                onCheckedChange={() => toggleBooleanCell(r, c)}
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
                    <TableCell className="w-10 p-0 text-center align-top">
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
