import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import { BoardColumn } from "../board-column"

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
      <BoardColumn
        columnId="todo"
        label="Todo"
        items={items}
        getItemId={(item) => item.id}
        renderItem={(item) => <div>{item.title}</div>}
        onDropItem={vi.fn()}
      />
    )
    expect(screen.getByText("Todo")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("First")).toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
  })

  it("shows the empty label when there are no items", () => {
    render(
      <BoardColumn
        columnId="todo"
        label="Todo"
        items={[]}
        getItemId={(item: Item) => item.id}
        renderItem={(item: Item) => <div>{item.title}</div>}
        onDropItem={vi.fn()}
        emptyLabel="Nothing here"
      />
    )
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
  })

  it("calls onDropItem with the dragged id and this column's id on drop", () => {
    const onDropItem = vi.fn()
    render(
      <BoardColumn
        columnId="done"
        label="Done"
        items={items}
        getItemId={(item) => item.id}
        renderItem={(item) => <div>{item.title}</div>}
        onDropItem={onDropItem}
      />
    )
    const column = screen.getByText("Done").closest("div[class*='flex-1']")!
    fireEvent.drop(column, { dataTransfer: { getData: () => "1" } })
    expect(onDropItem).toHaveBeenCalledWith("1", "done")
  })
})
