import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { BulkActionsToolbar } from "../page"

describe("BulkActionsToolbar", () => {
  it("opens with rows selected so the toolbar is visible", () => {
    render(<BulkActionsToolbar />)

    expect(screen.getByRole("toolbar")).toBeInTheDocument()
    expect(screen.getByText("2 selected")).toBeInTheDocument()
  })

  it("narrows the rows from the search box", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    await user.type(screen.getByLabelText("Search"), "pdf")

    await waitFor(() =>
      expect(screen.queryByText("Logo Pack.zip")).not.toBeInTheDocument()
    )
    expect(screen.getByText("Brand Guidelines.pdf")).toBeInTheDocument()
  })

  it("hides the toolbar once the selection is emptied", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    await user.click(screen.getByRole("button", { name: "Clear selection" }))
    await waitFor(() =>
      expect(screen.queryByRole("toolbar")).not.toBeInTheDocument()
    )

    await user.click(screen.getByRole("checkbox", { name: "Select row 6" }))
    expect(screen.getByText("1 selected")).toBeInTheDocument()
  })

  it("select-all selects every row", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }))
    expect(screen.getByText("6 selected")).toBeInTheDocument()
  })

  it("bulk-deletes selected rows after confirming", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }))
    await user.click(screen.getByRole("button", { name: /delete/i }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.getByText("No documents")).toBeInTheDocument()
    // BulkToolbar animates its exit, so the node lingers briefly.
    await waitFor(() =>
      expect(screen.queryByRole("toolbar")).not.toBeInTheDocument()
    )
  })

  it("clears the selection", async () => {
    const user = userEvent.setup()
    render(<BulkActionsToolbar />)

    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }))
    await user.click(screen.getByRole("button", { name: "Clear selection" }))

    await waitFor(() =>
      expect(screen.queryByRole("toolbar")).not.toBeInTheDocument()
    )
  })
})
