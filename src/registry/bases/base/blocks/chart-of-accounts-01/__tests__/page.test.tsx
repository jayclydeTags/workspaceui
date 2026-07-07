import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { ChartOfAccounts01 } from "../page"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("ChartOfAccounts01", () => {
  it("lists the seeded accounts", () => {
    render(<ChartOfAccounts01 />)
    expect(screen.getAllByText("Cash").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Accounts Payable").length).toBeGreaterThan(0)
    expect(screen.getByText("11 accounts")).toBeInTheDocument()
  })

  it("creates a new account", async () => {
    const user = userEvent.setup()
    render(<ChartOfAccounts01 />)

    await user.click(screen.getByRole("button", { name: /new account/i }))
    await user.type(screen.getByLabelText("Code"), "6000")
    await user.type(screen.getByLabelText("Name"), "Marketing Expense")
    await user.click(screen.getByRole("button", { name: "Create account" }))

    expect(screen.getAllByText("Marketing Expense").length).toBeGreaterThan(0)
    expect(screen.getByText("12 accounts")).toBeInTheDocument()
  })

  it("edits an existing account", async () => {
    const user = userEvent.setup()
    render(<ChartOfAccounts01 />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Cash" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    const nameInput = screen.getByLabelText("Name")
    await user.clear(nameInput)
    await user.type(nameInput, "Petty Cash")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getAllByText("Petty Cash").length).toBeGreaterThan(0)
    expect(screen.queryByText("Cash")).not.toBeInTheDocument()
  })

  it("deletes an account after confirmation", async () => {
    const user = userEvent.setup()
    render(<ChartOfAccounts01 />)

    await user.click(
      screen.getAllByRole("button", {
        name: "Actions for Miscellaneous Expense",
      })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Miscellaneous Expense")).not.toBeInTheDocument()
    expect(screen.getByText("10 accounts")).toBeInTheDocument()
  })
})
