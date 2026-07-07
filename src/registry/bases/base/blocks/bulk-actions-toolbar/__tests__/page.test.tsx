import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { BulkActionsToolbar } from "../page"

describe("BulkActionsToolbar", () => {
  it("hides the toolbar until a row is selected", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument()

    await user.click(
      screen.getByRole("checkbox", { name: "Select Logo Pack.zip" })
    )
    expect(screen.getByRole("toolbar")).toBeInTheDocument()
    expect(screen.getByText("1 selected")).toBeInTheDocument()
  })

  it("select-all selects every row", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    expect(screen.getByText("6 selected")).toBeInTheDocument()
  })

  it("bulk-deletes selected rows after confirming", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    await user.click(screen.getByRole("button", { name: /delete/i }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.getByText("No documents")).toBeInTheDocument()
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument()
  })

  it("clears the selection", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    await user.click(screen.getByRole("button", { name: "Clear selection" }))

    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument()
  })
})
