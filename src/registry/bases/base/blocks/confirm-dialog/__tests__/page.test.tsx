import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { ConfirmDialogDemo } from "../page"

describe("ConfirmDialog", () => {
  it("removes the item after confirming", async () => {
    const user = userEvent.setup()
    render(<ConfirmDialogDemo />)

    await user.click(screen.getByRole("button", { name: "Revoke Staging" }))
    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Revoke" }))

    expect(screen.queryByText("Staging")).not.toBeInTheDocument()
    expect(screen.getByText("2 keys")).toBeInTheDocument()
  })

  it("keeps the item when cancelled", async () => {
    const user = userEvent.setup()
    render(<ConfirmDialogDemo />)

    await user.click(screen.getByRole("button", { name: "Revoke Production" }))
    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }))

    expect(screen.getByText("Production")).toBeInTheDocument()
    expect(screen.getByText("3 keys")).toBeInTheDocument()
  })
})
