import { DndContext } from "@dnd-kit/core"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

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
})
