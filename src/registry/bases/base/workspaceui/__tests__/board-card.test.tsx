import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import { BoardCard } from "../board-card"

describe("BoardCard", () => {
  it("is draggable and puts its itemId on the drag payload", () => {
    render(<BoardCard itemId="task-1">Task 1</BoardCard>)
    const card = screen.getByText("Task 1")
    expect(card).toHaveAttribute("draggable", "true")

    const setData = vi.fn()
    fireEvent.dragStart(card, { dataTransfer: { setData, effectAllowed: "" } })
    expect(setData).toHaveBeenCalledWith("text/plain", "task-1")
  })

  it("forwards className and other div props", () => {
    render(
      <BoardCard itemId="task-1" className="custom" data-testid="card">
        Task 1
      </BoardCard>
    )
    expect(screen.getByTestId("card")).toHaveClass("custom")
  })
})
