import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Settings } from "../page"

describe("Settings", () => {
  it("shows the company profile fields by default", () => {
    render(<Settings />)
    expect(screen.getByLabelText("Display name")).toHaveValue("Northwind Traders")
    expect(screen.getByLabelText("Tax ID")).toHaveValue("84-1234567")
  })

  it("switches to the notifications section and reflects initial state", async () => {
    const user = userEvent.setup()
    render(<Settings />)

    await user.click(screen.getByRole("button", { name: /notifications/i }))

    expect(screen.getByRole("checkbox", { name: "Invoice due reminders" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "Low stock alerts" })).not.toBeChecked()
  })

  it("toggles a notification preference", async () => {
    const user = userEvent.setup()
    render(<Settings />)

    await user.click(screen.getByRole("button", { name: /notifications/i }))
    const checkbox = screen.getByRole("checkbox", { name: "Low stock alerts" })
    await user.click(checkbox)

    expect(checkbox).toBeChecked()
  })

  it("shows a saved confirmation after clicking save, and clears it on further edits", async () => {
    const user = userEvent.setup()
    render(<Settings />)

    await user.click(screen.getByRole("button", { name: "Save changes" }))
    expect(screen.getByText("Saved")).toBeInTheDocument()

    await user.type(screen.getByLabelText("Display name"), " Inc.")
    expect(screen.queryByText("Saved")).not.toBeInTheDocument()
  })

  it("revokes a session in the security section", async () => {
    const user = userEvent.setup()
    render(<Settings />)

    await user.click(screen.getByRole("button", { name: /security/i }))
    expect(screen.getByText("Safari on iPhone")).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "Revoke" })[0]!)
    expect(screen.queryByText("Safari on iPhone")).not.toBeInTheDocument()
  })
})
