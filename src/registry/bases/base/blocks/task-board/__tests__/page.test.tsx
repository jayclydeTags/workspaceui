import { render, screen, within, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

import { TaskBoard } from "../page"
import { completion, type Task } from "../data"

function makeDataTransfer(id: string) {
  return { setData: vi.fn(), getData: vi.fn(() => id), effectAllowed: "" }
}

describe("completion", () => {
  it("is the share of done tasks", () => {
    const tasks = [{ status: "done" }, { status: "todo" }] as Task[]
    expect(completion(tasks)).toBe(50)
  })

  it("guards against an empty board", () => {
    expect(completion([])).toBe(0)
  })
})

describe("TaskBoard", () => {
  it("groups tasks into their columns", () => {
    render(<TaskBoard />)
    expect(screen.getByText("To do")).toBeInTheDocument()
    expect(screen.getByText("Map legacy billing tables")).toBeInTheDocument()
    expect(screen.getByText("6 tasks · 33% done")).toBeInTheDocument()
  })

  it("moves a task to another column on drop", () => {
    render(<TaskBoard />)

    const card = screen
      .getByText("Map legacy billing tables")
      .closest("[draggable]")!
    const doneColumn = screen.getByText("Done").closest("div")!.parentElement!

    const dataTransfer = makeDataTransfer("1")
    fireEvent.dragStart(card, { dataTransfer })
    fireEvent.drop(doneColumn, { dataTransfer })

    expect(screen.getByText("6 tasks · 50% done")).toBeInTheDocument()
  })

  it("creates a task in the chosen column", async () => {
    const user = userEvent.setup()
    render(<TaskBoard />)

    await user.click(screen.getByRole("button", { name: /new task/i }))
    await user.type(screen.getByLabelText("Title"), "Write cutover checklist")
    await user.click(screen.getByRole("button", { name: "Create task" }))

    expect(screen.getByText("Write cutover checklist")).toBeInTheDocument()
    expect(screen.getByText("7 tasks · 29% done")).toBeInTheDocument()
  })

  it("edits a task", async () => {
    const user = userEvent.setup()
    render(<TaskBoard />)

    await user.click(
      screen.getByRole("button", { name: "Actions for Backfill invoice fixtures" })
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    await user.type(screen.getByLabelText("Assignee"), "Ava Chen")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.queryByText("Unassigned")).not.toBeInTheDocument()
  })

  it("deletes a task after confirmation", async () => {
    const user = userEvent.setup()
    render(<TaskBoard />)

    await user.click(
      screen.getByRole("button", { name: "Actions for Retire the cron sync" })
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Retire the cron sync")).not.toBeInTheDocument()
    expect(screen.getByText("5 tasks · 20% done")).toBeInTheDocument()
  })
})
