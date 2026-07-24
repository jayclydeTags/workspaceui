"use client"

import * as React from "react"
import {
  flexRender,
  type Column,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import { MoreHorizontalIcon, PlusIcon } from "lucide-react"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
  className?: string
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

// A cell's committed value, coerced for display in the (string-only, so far)
// text control — null/undefined read as empty rather than the literal
// "null"/"undefined".
function cellDisplayValue(value: unknown): string {
  return value == null ? "" : String(value)
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

// ponytail: "required" is the only rule until a real validation hook lands —
// enough to exercise the aria-invalid / aria-describedby wiring end to end
// for the one type this walking skeleton implements.
function validateText(value: string): string | null {
  return value.trim().length === 0 ? "Required" : null
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
  className,
}: DataGridProps<TData>) {
  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const colCount = headerGroups[0]?.headers.length ?? 0
  const rowCount = rows.length
  const hasDeleteColumn = onRowDelete != null
  const totalColCount = colCount + (hasDeleteColumn ? 1 : 0)

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

  const cellRefs = React.useRef(new Map<string, HTMLTableCellElement>())
  const inputRefs = React.useRef(new Map<string, HTMLInputElement>())
  // Enter/Tab/Escape move focus themselves after resolving the cell (commit
  // or cancel); the resulting native blur on the old input must not run a
  // second, stale commit. Set right before an explicit move, consumed once.
  const suppressNextBlurRef = React.useRef(false)
  const errorId = React.useId()

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

  // Takes the column the caller already has, rather than columnId + a
  // table.getColumn() lookup back through the table.
  function getColumnLabel(column: Column<TData, unknown>): string {
    const header = column.columnDef.header
    return typeof header === "string" ? header : column.id
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
  // promise both land here, through the same try/catch.
  async function runCommit(
    rowId: string,
    columnId: string,
    columnLabel: string,
    value: string,
    coord: Coord
  ) {
    const key = cellKey(coord.r, coord.c)
    try {
      await onCellEdit(rowId, columnId, value)
      setCommits((prev) => withoutKey(prev, key))
    } catch (err) {
      const message = normalizeErrorMessage(err)
      setCommits((prev) =>
        withKey(prev, key, { value, pending: false, error: message })
      )
      setLiveMessage(`${columnLabel}, row ${coord.r + 1}: ${message}`)
    }
  }

  function commitEdit() {
    if (!editCoord) return
    const { r, c } = editCoord
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    const err = validateText(buffer)
    setEditCoord(null)
    if (!cell || err != null) return

    const committed = cell.getValue()
    const committedStr = cellDisplayValue(committed)
    // Dedup against the last *successful* commit (the table's own data),
    // never the last attempted value — so retrying a rejected edit with the
    // same value fires onCellEdit again instead of no-opping.
    if (buffer === committedStr) return

    const key = cellKey(r, c)
    const value = buffer
    setCommits((prev) => withKey(prev, key, { value, pending: true }))
    void runCommit(row.id, cell.column.id, getColumnLabel(cell.column), value, {
      r,
      c,
    })
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
    setError(validateText(initial))
    inputRefs.current.get(key)?.focus()
  }

  function onCellClick(r: number, c: number) {
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
        e.preventDefault()
        focusTo(clamp(r - 1, 0, rowCount - 1), c)
        return
      case "ArrowDown":
        e.preventDefault()
        focusTo(clamp(r + 1, 0, rowCount - 1), c)
        return
      case "ArrowLeft":
        e.preventDefault()
        focusTo(r, clamp(c - 1, 0, colCount - 1))
        return
      case "ArrowRight":
        e.preventDefault()
        focusTo(r, clamp(c + 1, 0, colCount - 1))
        return
      case "Tab": {
        e.preventDefault()
        const next = wrapIndex(r, c, e.shiftKey ? -1 : 1)
        focusTo(next.r, next.c)
        return
      }
      case "Enter":
        e.preventDefault()
        focusTo(clamp(r + (e.shiftKey ? -1 : 1), 0, rowCount - 1), c)
        return
      case "F2":
        e.preventDefault()
        beginEdit(r, c)
        return
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Focus is about to jump from this cell to the input mid-event;
          // prevent the default so the keystroke isn't replayed a second
          // time onto the newly-focused control.
          e.preventDefault()
          beginEdit(r, c, e.key)
        }
    }
  }

  function onEditInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setBuffer(value)
    setError(validateText(value))
  }

  function onEditInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
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
      {/* aria-rowcount includes the header row, per the grid pattern's own convention. */}
      <Table
        role="grid"
        aria-rowcount={rowCount + 1}
        aria-colcount={totalColCount}
      >
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
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
            rows.map((row, r) => (
              <React.Fragment key={row.id}>
                <TableRow className="group/row">
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
                    const isTextColumn =
                      cell.column.columnDef.meta?.type === "text"
                    const value = cell.getValue()
                    const cellErrorId = `${errorId}-${key}`

                    return (
                      <TableCell
                        key={cell.id}
                        ref={setMapRef(cellRefs, key)}
                        role="gridcell"
                        tabIndex={isFocused ? 0 : -1}
                        onFocus={() => setFocusCoord({ r, c })}
                        onClick={() => onCellClick(r, c)}
                        onKeyDown={(e) => onGridCellKeyDown(e, r, c)}
                        className="p-0 align-top whitespace-normal outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      >
                        {isTextColumn ? (
                          <>
                            <div className="relative">
                              <Input
                                ref={setMapRef(inputRefs, key)}
                                value={
                                  isEditing
                                    ? buffer
                                    : (commit?.value ?? cellDisplayValue(value))
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
                        ) : (
                          <div className="px-2 py-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        )}
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
                    </TableCell>
                  )}
                </TableRow>
                {onRowAdd && r < rowCount - 1 && (
                  // Zero layout height at rest — the row must not add
                  // permanent space between every pair of rows. The "+" is a
                  // real, absolutely-positioned hit target straddling the
                  // row boundary (8px into each neighbor), invisible until
                  // hovered or focused, so it doesn't disturb normal spacing.
                  <TableRow className="h-0 border-none hover:bg-transparent">
                    <TableCell
                      colSpan={totalColCount}
                      className="relative h-0 p-0"
                    >
                      <button
                        type="button"
                        aria-label={`Insert row after row ${r + 1}`}
                        onClick={() => handleRowAdd(row.id)}
                        className="absolute inset-x-0 top-0 z-10 flex h-4 -translate-y-1/2 items-center justify-center opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100"
                      >
                        <span className="flex size-5 items-center justify-center rounded-full border bg-background shadow-sm">
                          <PlusIcon className="size-3" />
                        </span>
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
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
