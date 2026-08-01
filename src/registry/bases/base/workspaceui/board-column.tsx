"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { HugeiconsIcon } from "@hugeicons/react"
import { GripVerticalIcon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface BoardColumnProps<TItem> {
  columnId: string
  label: string
  items: TItem[]
  getItemId: (item: TItem) => string
  renderItem: (item: TItem) => React.ReactNode
  emptyLabel?: string
  /** Rendered in the header after the count badge, before it's pushed right. */
  headerExtra?: React.ReactNode
  className?: string
  /**
   * Makes the column itself draggable for reordering, via a grip handle in
   * the header. Needs a `SortableContext` (horizontal strategy) wrapping the
   * board's columns, keyed by `columnId`.
   */
  sortable?: boolean
}

// Items get their own SortableContext (keyed by item id, not columnId) so a
// card dropped on another card reorders in place; empty column space still
// falls through to the column's own droppable, a separate id.
function ColumnBody<TItem>({
  items,
  getItemId,
  renderItem,
  emptyLabel,
}: Pick<BoardColumnProps<TItem>, "items" | "getItemId" | "renderItem"> & {
  emptyLabel: string
}) {
  const ids = React.useMemo(() => items.map(getItemId), [items, getItemId])

  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {items.map((item) => (
          <React.Fragment key={getItemId(item)}>
            {renderItem(item)}
          </React.Fragment>
        ))}
        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            {emptyLabel}
          </div>
        )}
      </div>
    </SortableContext>
  )
}

// Drop handling lives one level up, in the DndContext.onDragEnd that wraps every
// BoardColumn — this only registers the drop target (columnId) and reflects hover.
function StaticColumn<TItem>({
  columnId,
  label,
  items,
  getItemId,
  renderItem,
  emptyLabel = "Drop an item here",
  headerExtra,
  className,
}: BoardColumnProps<TItem>) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-transparent bg-muted/30 p-3",
        isOver && "border-primary/50 bg-muted/60",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="secondary">{items.length}</Badge>
        {headerExtra}
      </div>
      <ColumnBody
        items={items}
        getItemId={getItemId}
        renderItem={renderItem}
        emptyLabel={emptyLabel}
      />
    </div>
  )
}

// useSortable's own droppable (keyed by the same `columnId`) is what items get
// dropped onto — a second, separate useDroppable call at this id would fight it
// for the same registry slot, so the sortable variant relies on this one alone.
function SortableColumn<TItem>({
  columnId,
  label,
  items,
  getItemId,
  renderItem,
  emptyLabel = "Drop an item here",
  headerExtra,
  className,
}: BoardColumnProps<TItem>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: columnId })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-transparent bg-muted/30 p-3",
        isOver && "border-primary/50 bg-muted/60",
        isDragging && "z-10 opacity-50",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          data-drag-handle
          aria-label={`Reorder ${label} column`}
          className="flex size-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing"
        >
          <HugeiconsIcon
            icon={GripVerticalIcon}
            strokeWidth={2}
            className="size-4"
          />
        </span>
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="secondary">{items.length}</Badge>
        {headerExtra}
      </div>
      <ColumnBody
        items={items}
        getItemId={getItemId}
        renderItem={renderItem}
        emptyLabel={emptyLabel}
      />
    </div>
  )
}

export function BoardColumn<TItem>(props: BoardColumnProps<TItem>) {
  return props.sortable ? (
    <SortableColumn {...props} />
  ) : (
    <StaticColumn {...props} />
  )
}
