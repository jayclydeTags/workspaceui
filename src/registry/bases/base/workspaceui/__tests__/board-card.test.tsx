import { DndContext } from "@dnd-kit/core"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { BoardCard } from "../board-card"

describe("BoardCard", () => {
  it("wires up dnd-kit's draggable attributes", () => {
    render(
      <DndContext>
        <BoardCard itemId="task-1">Task 1</BoardCard>
      </DndContext>
    )
    const card = screen.getByText("Task 1")
    expect(card).toHaveAttribute("role", "button")
    expect(card).toHaveAttribute("tabIndex", "0")
    expect(card).toHaveAttribute("aria-roledescription", "draggable")
    expect(card).toHaveAttribute("aria-disabled", "false")
  })

  it("forwards className and other div props", () => {
    render(
      <DndContext>
        <BoardCard itemId="task-1" className="custom" data-testid="card">
          Task 1
        </BoardCard>
      </DndContext>
    )
    expect(screen.getByTestId("card")).toHaveClass("custom")
  })
})
