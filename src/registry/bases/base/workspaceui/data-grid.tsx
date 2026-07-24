"use client"

import * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
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

export interface DataGridProps<TData> {
  table: TanstackTable<TData>
  onCellEdit: (
    rowId: string,
    columnId: string,
    value: unknown
  ) => void | Promise<void>
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

export function DataGrid<TData>({
  table,
  onCellEdit,
  className,
}: DataGridProps<TData>) {
  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const colCount = headerGroups[0]?.headers.length ?? 0
  const rowCount = rows.length

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

  function getColumnLabel(columnId: string): string {
    const header = table.getColumn(columnId)?.columnDef.header
    return typeof header === "string" ? header : columnId
  }

  // Always treats onCellEdit as async: a synchronous throw and a rejected
  // promise both land here, through the same try/catch.
  async function runCommit(
    rowId: string,
    columnId: string,
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
      setLiveMessage(
        `${getColumnLabel(columnId)}, row ${coord.r + 1}: ${message}`
      )
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
    const committedStr = committed == null ? "" : String(committed)
    // Dedup against the last *successful* commit (the table's own data),
    // never the last attempted value — so retrying a rejected edit with the
    // same value fires onCellEdit again instead of no-opping.
    if (buffer === committedStr) return

    const key = cellKey(r, c)
    const value = buffer
    setCommits((prev) => withKey(prev, key, { value, pending: true }))
    void runCommit(row.id, cell.column.id, value, { r, c })
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
    const fallback =
      commit?.value ?? (committed == null ? "" : String(committed))
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
      <Table role="grid" aria-rowcount={rowCount + 1} aria-colcount={colCount}>
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
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rowCount === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colCount}
                className="h-24 text-center text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, r) => (
              <TableRow key={row.id}>
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
                                  : (commit?.value ??
                                    (value == null ? "" : String(value)))
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Commit errors only — silent on pending and on success. */}
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>
    </div>
  )
}
