import * as React from "react"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { BoardCard } from "../board-card"
import { BoardColumn } from "../board-column"
import { dragCard, mockRect } from "@/test/dnd"

interface Item {
  id: string
  title: string
}

const items: Item[] = [
  { id: "1", title: "First" },
  { id: "2", title: "Second" },
]

describe("BoardColumn", () => {
  it("renders the label, item count, and each item via renderItem", () => {
    render(
      <DndContext>
        <BoardColumn
          columnId="todo"
          label="Todo"
          items={items}
          getItemId={(item) => item.id}
          renderItem={(item) => <div>{item.title}</div>}
        />
      </DndContext>
    )
    expect(screen.getByText("Todo")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("First")).toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
  })

  it("shows the empty label when there are no items", () => {
    render(
      <DndContext>
        <BoardColumn
          columnId="todo"
          label="Todo"
          items={[]}
          getItemId={(item: Item) => item.id}
          renderItem={(item: Item) => <div>{item.title}</div>}
          emptyLabel="Nothing here"
        />
      </DndContext>
    )
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
  })

  it("renders headerExtra after the count badge", () => {
    render(
      <DndContext>
        <BoardColumn
          columnId="todo"
          label="Todo"
          items={items}
          getItemId={(item) => item.id}
          renderItem={(item) => <div>{item.title}</div>}
          headerExtra={<span>$1,200</span>}
        />
      </DndContext>
    )
    expect(screen.getByText("$1,200")).toBeInTheDocument()
  })

  it("shows a drag handle when sortable", () => {
    render(
      <DndContext>
        <BoardColumn
          columnId="todo"
          label="Todo"
          items={items}
          getItemId={(item) => item.id}
          renderItem={(item) => <div>{item.title}</div>}
          sortable
        />
      </DndContext>
    )
    expect(screen.getByLabelText("Reorder Todo column")).toBeInTheDocument()
  })

  it("has no drag handle when not sortable", () => {
    render(
      <DndContext>
        <BoardColumn
          columnId="todo"
          label="Todo"
          items={items}
          getItemId={(item) => item.id}
          renderItem={(item) => <div>{item.title}</div>}
        />
      </DndContext>
    )
    expect(screen.queryByLabelText(/Reorder/)).not.toBeInTheDocument()
  })
})

function ColumnReorderHarness() {
  const [columns, setColumns] = React.useState(["todo", "done"])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setColumns((prev) =>
      arrayMove(
        prev,
        prev.indexOf(String(active.id)),
        prev.indexOf(String(over.id))
      )
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
        <div data-testid="order">{columns.join(",")}</div>
        {columns.map((id) => (
          <BoardColumn
            key={id}
            columnId={id}
            label={id === "todo" ? "Todo" : "Done"}
            items={[]}
            getItemId={(item: Item) => item.id}
            renderItem={(item: Item) => <div>{item.title}</div>}
            sortable
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}

describe("BoardColumn column reordering", () => {
  it("reorders columns when one is dragged past another", async () => {
    render(<ColumnReorderHarness />)

    const todoHandle = screen.getByLabelText("Reorder Todo column")
    // useSortable's draggable node is the column's outer div (via `setNodeRef`
    // on SortableColumn's root) — `setActivatorNodeRef` on the handle only
    // covers focus/keyboard, so collision math reads this rect, not the
    // handle's own (unmocked) 0×0 box.
    const todoColumn = screen.getByText("Todo").closest("div")!.parentElement!
    const doneColumn = screen.getByText("Done").closest("div")!.parentElement!

    mockRect(todoHandle, {
      left: 0,
      top: 0,
      right: 20,
      bottom: 20,
      width: 20,
      height: 20,
    })
    mockRect(todoColumn, {
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200,
    })
    mockRect(doneColumn, {
      left: 300,
      top: 0,
      right: 500,
      bottom: 200,
      width: 200,
      height: 200,
    })

    await dragCard(todoHandle, doneColumn)

    expect(screen.getByTestId("order")).toHaveTextContent("done,todo")
  })
})

function ItemReorderHarness() {
  const [items, setItems] = React.useState<Item[]>([
    { id: "a", title: "Alpha" },
    { id: "b", title: "Bravo" },
  ])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setItems((prev) =>
      arrayMove(
        prev,
        prev.findIndex((item) => item.id === active.id),
        prev.findIndex((item) => item.id === over.id)
      )
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <BoardColumn
        columnId="todo"
        label="Todo"
        items={items}
        getItemId={(item) => item.id}
        renderItem={(item) => (
          <BoardCard itemId={item.id}>{item.title}</BoardCard>
        )}
      />
    </DndContext>
  )
}

describe("BoardColumn item reordering", () => {
  it("reorders items within a column when one is dragged past another", async () => {
    render(<ItemReorderHarness />)

    const alpha = screen.getByText("Alpha").closest('[role="button"]')!
    const bravo = screen.getByText("Bravo").closest('[role="button"]')!

    mockRect(alpha, {
      left: 0,
      top: 0,
      right: 200,
      bottom: 40,
      width: 200,
      height: 40,
    })
    mockRect(bravo, {
      left: 0,
      top: 100,
      right: 200,
      bottom: 140,
      width: 200,
      height: 40,
    })

    await dragCard(alpha, bravo)

    const titles = screen
      .getAllByText(/Alpha|Bravo/)
      .map((el) => el.textContent)
    expect(titles).toEqual(["Bravo", "Alpha"])
  })
})
