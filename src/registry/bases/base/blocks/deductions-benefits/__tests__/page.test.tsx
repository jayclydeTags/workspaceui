import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { DeductionsBenefits } from "../page"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("DeductionsBenefits", () => {
  it("lists the seeded items", () => {
    render(<DeductionsBenefits />)
    expect(screen.getAllByText("Health Insurance").length).toBeGreaterThan(0)
    expect(screen.getAllByText("401(k)").length).toBeGreaterThan(0)
    expect(screen.getByText("7 items")).toBeInTheDocument()
  })

  it("creates a new item", async () => {
    const user = userEvent.setup()
    render(<DeductionsBenefits />)

    await user.click(screen.getByRole("button", { name: /new item/i }))
    await user.type(screen.getByLabelText("Name"), "Commuter Benefit")
    await user.type(screen.getByLabelText("Amount ($)"), "50")
    await user.click(screen.getByRole("button", { name: "Create item" }))

    expect(screen.getAllByText("Commuter Benefit").length).toBeGreaterThan(0)
    expect(screen.getByText("8 items")).toBeInTheDocument()
  })

  it("edits an existing item", async () => {
    const user = userEvent.setup()
    render(<DeductionsBenefits />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Dental Insurance" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    const nameInput = screen.getByLabelText("Name")
    await user.clear(nameInput)
    await user.type(nameInput, "Dental Plus")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getAllByText("Dental Plus").length).toBeGreaterThan(0)
    expect(screen.queryByText("Dental Insurance")).not.toBeInTheDocument()
  })

  it("deletes an item after confirmation", async () => {
    const user = userEvent.setup()
    render(<DeductionsBenefits />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Wage Garnishment" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Wage Garnishment")).not.toBeInTheDocument()
    expect(screen.getByText("6 items")).toBeInTheDocument()
  })
})
