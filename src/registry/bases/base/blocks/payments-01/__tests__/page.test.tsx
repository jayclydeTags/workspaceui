import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Payments01 } from "../page"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("Payments01", () => {
  it("lists the seeded payments", () => {
    render(<Payments01 />)
    expect(screen.getAllByText("Acme Supply Co.").length).toBeGreaterThan(0)
    expect(screen.getAllByText("ACH-88213").length).toBeGreaterThan(0)
    expect(screen.getByText("5 payments")).toBeInTheDocument()
  })

  it("creates a new payment", async () => {
    const user = userEvent.setup()
    render(<Payments01 />)

    await user.click(screen.getByRole("button", { name: /new payment/i }))
    await user.type(screen.getByLabelText("Payee"), "Summit Office Supplies")
    await user.type(screen.getByLabelText("Amount ($)"), "300")
    await user.click(screen.getByRole("button", { name: "Create payment" }))

    expect(
      screen.getAllByText("Summit Office Supplies").length
    ).toBeGreaterThan(0)
    expect(screen.getByText("6 payments")).toBeInTheDocument()
  })

  it("edits an existing payment", async () => {
    const user = userEvent.setup()
    render(<Payments01 />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for CHK-1042" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    const payeeInput = screen.getByLabelText("Payee")
    await user.clear(payeeInput)
    await user.type(payeeInput, "Bluepeak Freight")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getAllByText("Bluepeak Freight").length).toBeGreaterThan(0)
    expect(screen.queryByText("Bluepeak Logistics")).not.toBeInTheDocument()
  })

  it("deletes a payment after confirmation", async () => {
    const user = userEvent.setup()
    render(<Payments01 />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for WIRE-5521" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("WIRE-5521")).not.toBeInTheDocument()
    expect(screen.getByText("4 payments")).toBeInTheDocument()
  })
})
