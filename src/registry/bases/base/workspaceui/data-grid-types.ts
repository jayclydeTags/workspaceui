import type { RowData } from "@tanstack/react-table"

// ── Column type contract ─────────────────────────────────────────────────
// Declared once here so data-grid and data-filter never re-open it. All but
// "multiSelect" and "user" have a working editor today (see data-grid.tsx);
// those two exist so consumers can type their columns now and get the
// editor for free once a later ticket implements it.

export type DataGridColumnType =
  | "text"
  | "number"
  | "currency"
  | "select"
  | "boolean"
  | "date"
  | "multiSelect"
  | "user"

export interface DataGridSelectOption {
  value: string
  label: string
}

export interface DataGridUser {
  id: string
  name: string
  avatarUrl?: string
}

declare module "@tanstack/react-table" {
  // TData/TValue must match the original declaration's type parameters for
  // module augmentation to merge; none of our fields are generic over them.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    type?: DataGridColumnType
    /** select and multiSelect */
    options?: DataGridSelectOption[]
    /** user — a static list; the grid never fetches */
    users?: DataGridUser[]
    /** multiSelect — chips shown before collapsing into "+N". Default 2. */
    maxChips?: number
    /** Marks this column as card title/subtitle material for the narrow branch. */
    summary?: boolean
  }
}
