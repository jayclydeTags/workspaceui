import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Products } from "../page"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("Products", () => {
  it("lists the seeded products", () => {
    render(<Products />)
    expect(screen.getAllByText("Canvas Tote Bag").length).toBeGreaterThan(0)
    expect(screen.getAllByText("SKU-1001").length).toBeGreaterThan(0)
    expect(screen.getByText("6 products")).toBeInTheDocument()
  })

  it("creates a new product", async () => {
    const user = userEvent.setup()
    render(<Products />)

    await user.click(screen.getByRole("button", { name: /new product/i }))
    await user.type(screen.getByLabelText("Name"), "Enamel Camp Cup")
    await user.type(screen.getByLabelText("SKU"), "SKU-2001")
    await user.type(screen.getByLabelText("Price ($)"), "19")
    await user.click(screen.getByRole("button", { name: "Create product" }))

    expect(screen.getAllByText("Enamel Camp Cup").length).toBeGreaterThan(0)
    expect(screen.getByText("7 products")).toBeInTheDocument()
  })

  it("edits an existing product", async () => {
    const user = userEvent.setup()
    render(<Products />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for SKU-1004" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    const nameInput = screen.getByLabelText("Name")
    await user.clear(nameInput)
    await user.type(nameInput, "Recycled Notebook A4")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getAllByText("Recycled Notebook A4").length).toBeGreaterThan(0)
    expect(screen.queryByText("Recycled Notebook A5")).not.toBeInTheDocument()
  })

  it("deletes a product after confirmation", async () => {
    const user = userEvent.setup()
    render(<Products />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for SKU-1005" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("SKU-1005")).not.toBeInTheDocument()
    expect(screen.getByText("5 products")).toBeInTheDocument()
  })
})
