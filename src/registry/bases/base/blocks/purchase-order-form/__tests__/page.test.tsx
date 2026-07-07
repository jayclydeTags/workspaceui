import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { PurchaseOrderForm } from "../page"

async function fillDetailsStep(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("combobox", { name: /vendor/i }))
  await user.click(await screen.findByRole("option", { name: "Acme Supply Co." }))
  await user.type(screen.getByLabelText("Requested by"), "Jamie Ortiz")
  await user.type(screen.getByLabelText("Needed by"), "2026-08-01")
}

describe("PurchaseOrderForm", () => {
  it("blocks advancing past the details step until required fields are filled", async () => {
    const user = userEvent.setup()
    render(<PurchaseOrderForm />)

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
    await fillDetailsStep(user)
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled()
  })

  it("walks through all three steps and submits", async () => {
    const user = userEvent.setup()
    render(<PurchaseOrderForm />)

    await fillDetailsStep(user)
    await user.click(screen.getByRole("button", { name: "Next" }))

    await user.type(screen.getByLabelText("Item"), "Shipping pallets")
    await user.click(screen.getByRole("button", { name: "Next" }))

    expect(screen.getByText("Acme Supply Co.")).toBeInTheDocument()
    expect(screen.getByText("Jamie Ortiz")).toBeInTheDocument()
    expect(screen.getByText("Shipping pallets")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Submit purchase order" }))
    expect(screen.getByText("Purchase order submitted")).toBeInTheDocument()
  })

  it("adds and removes line items", async () => {
    const user = userEvent.setup()
    render(<PurchaseOrderForm />)

    await fillDetailsStep(user)
    await user.click(screen.getByRole("button", { name: "Next" }))

    await user.click(screen.getByRole("button", { name: "Add line item" }))
    expect(screen.getAllByLabelText("Item")).toHaveLength(2)

    await user.click(screen.getAllByRole("button", { name: "Remove line item" })[1]!)
    expect(screen.getAllByLabelText("Item")).toHaveLength(1)
  })
})
