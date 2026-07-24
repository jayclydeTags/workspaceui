"use client"

import * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
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

  function commitEdit() {
    if (!editCoord) return
    const { r, c } = editCoord
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    const err = validateText(buffer)
    setEditCoord(null)
    // ponytail: fire-and-forget — pending/error commit states (spinner,
    // rejection message, retry) are the async commit contract's job, a later
    // ticket. An invalid value is simply never sent; a rejection here is
    // swallowed rather than surfaced.
    if (cell && err == null) {
      Promise.resolve(onCellEdit(row.id, cell.column.id, buffer)).catch(
        () => {}
      )
    }
  }

  function cancelEdit() {
    if (!editCoord) return
    const { r, c } = editCoord
    setEditCoord(null)
    setBuffer("")
    setError(null)
    cellRefs.current.get(cellKey(r, c))?.focus()
  }

  function beginEdit(r: number, c: number, seed?: string) {
    const row = rows[r]
    const cell = row?.getVisibleCells()[c]
    if (!cell) return

    // Switching directly from one editing cell to another: resolve the old
    // one first so its value isn't silently dropped.
    if (editCoord && (editCoord.r !== r || editCoord.c !== c)) {
      suppressNextBlurRef.current = true
      commitEdit()
    }

    const committed = cell.getValue()
    const initial = seed ?? (committed == null ? "" : String(committed))
    setFocusCoord({ r, c })
    setEditCoord({ r, c })
    setBuffer(initial)
    setError(validateText(initial))
    inputRefs.current.get(cellKey(r, c))?.focus()
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
                  const isFocused = focusCoord.r === r && focusCoord.c === c
                  const isEditing = editCoord?.r === r && editCoord?.c === c
                  const showError = isEditing && error != null
                  const isTextColumn =
                    cell.column.columnDef.meta?.type === "text"
                  const value = cell.getValue()

                  return (
                    <TableCell
                      key={cell.id}
                      ref={setMapRef(cellRefs, cellKey(r, c))}
                      role="gridcell"
                      tabIndex={isFocused ? 0 : -1}
                      onFocus={() => setFocusCoord({ r, c })}
                      onClick={() => onCellClick(r, c)}
                      onKeyDown={(e) => onGridCellKeyDown(e, r, c)}
                      className="p-0 align-top whitespace-normal outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      {isTextColumn ? (
                        <>
                          <Input
                            ref={setMapRef(inputRefs, cellKey(r, c))}
                            value={
                              isEditing
                                ? buffer
                                : value == null
                                  ? ""
                                  : String(value)
                            }
                            readOnly={!isEditing}
                            tabIndex={-1}
                            aria-invalid={showError || undefined}
                            aria-describedby={showError ? errorId : undefined}
                            onMouseDown={(e) => {
                              if (!isEditing) e.preventDefault()
                            }}
                            onChange={isEditing ? onEditInputChange : undefined}
                            onKeyDown={
                              isEditing ? onEditInputKeyDown : undefined
                            }
                            onBlur={isEditing ? onEditInputBlur : undefined}
                            className="h-auto rounded-none border-none bg-transparent px-2 py-2 shadow-none hover:bg-accent/30 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:bg-transparent"
                          />
                          {showError && (
                            <span
                              id={errorId}
                              className="block px-2 pb-1.5 text-xs text-destructive"
                            >
                              {error}
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
      {/* Reserved for the async-commit ticket's error announcements. */}
      <div aria-live="polite" className="sr-only" />
    </div>
  )
}
