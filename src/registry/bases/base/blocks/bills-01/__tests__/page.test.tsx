import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Bills01 } from "../page"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("Bills01", () => {
  it("lists the seeded bills", () => {
    render(<Bills01 />)
    expect(screen.getAllByText("Acme Supply Co.").length).toBeGreaterThan(0)
    expect(screen.getAllByText("B-1001").length).toBeGreaterThan(0)
    expect(screen.getByText("6 bills")).toBeInTheDocument()
  })

  it("creates a new bill", async () => {
    const user = userEvent.setup()
    render(<Bills01 />)

    await user.click(screen.getByRole("button", { name: /new bill/i }))
    await user.type(screen.getByLabelText("Vendor"), "Summit Office Supplies")
    await user.type(screen.getByLabelText("Bill number"), "B-2001")
    await user.type(screen.getByLabelText("Amount ($)"), "500")
    await user.click(screen.getByRole("button", { name: "Create bill" }))

    expect(
      screen.getAllByText("Summit Office Supplies").length
    ).toBeGreaterThan(0)
    expect(screen.getByText("7 bills")).toBeInTheDocument()
  })

  it("edits an existing bill", async () => {
    const user = userEvent.setup()
    render(<Bills01 />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for B-1004" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    const vendorInput = screen.getByLabelText("Vendor")
    await user.clear(vendorInput)
    await user.type(vendorInput, "Cascade Retail Holdings")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(
      screen.getAllByText("Cascade Retail Holdings").length
    ).toBeGreaterThan(0)
    expect(screen.queryByText("Cascade Retail Group")).not.toBeInTheDocument()
  })

  it("deletes a bill after confirmation", async () => {
    const user = userEvent.setup()
    render(<Bills01 />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for B-1005" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("B-1005")).not.toBeInTheDocument()
    expect(screen.getByText("5 bills")).toBeInTheDocument()
  })
})
