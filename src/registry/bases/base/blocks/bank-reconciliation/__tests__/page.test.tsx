import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { BankReconciliation } from "../page"

describe("BankReconciliation", () => {
  it("shows the initial cleared/difference state as not reconciled", () => {
    render(<BankReconciliation />)
    expect(screen.getByText("Not reconciled")).toBeInTheDocument()
  })

  it("reaches Reconciled once every transaction is marked cleared", async () => {
    const user = userEvent.setup()
    render(<BankReconciliation />)

    for (const checkbox of screen.getAllByRole("checkbox")) {
      if (checkbox.getAttribute("aria-checked") !== "true") {
        await user.click(checkbox)
      }
    }

    expect(screen.getByText("Reconciled")).toBeInTheDocument()
  })

  it("toggling a cleared transaction off moves it out of reconciliation", async () => {
    const user = userEvent.setup()
    render(<BankReconciliation />)

    const firstCleared = screen.getByRole("checkbox", {
      name: /Mark Customer payment — Acme Co\. cleared/,
    })
    expect(firstCleared).toHaveAttribute("aria-checked", "true")

    await user.click(firstCleared)
    expect(firstCleared).toHaveAttribute("aria-checked", "false")
  })
})
