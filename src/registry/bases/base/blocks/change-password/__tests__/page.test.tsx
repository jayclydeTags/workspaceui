import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { ChangePassword } from "../page"

describe("ChangePassword", () => {
  it("requires the current password", async () => {
    const user = userEvent.setup()
    render(<ChangePassword />)
    await user.click(screen.getByRole("button", { name: /update password/i }))
    expect(
      screen
        .getAllByRole("alert")
        .some((el) => /enter your current password/i.test(el.textContent ?? ""))
    ).toBe(true)
  })

  it("rejects a wrong current password", async () => {
    const user = userEvent.setup()
    render(<ChangePassword />)
    await user.type(screen.getByLabelText(/current password/i), "wrongpass")
    await user.type(screen.getByLabelText(/^new password$/i), "Ab1!xyzq")
    await user.type(screen.getByLabelText(/confirm new password/i), "Ab1!xyzq")
    await user.click(screen.getByRole("button", { name: /update password/i }))
    expect(await screen.findByText(/current password is incorrect/i)).toBeInTheDocument()
  })

  it("changes the password with the correct current password", async () => {
    const user = userEvent.setup()
    render(<ChangePassword />)
    await user.type(screen.getByLabelText(/current password/i), "password")
    await user.type(screen.getByLabelText(/^new password$/i), "Ab1!xyzq")
    await user.type(screen.getByLabelText(/confirm new password/i), "Ab1!xyzq")
    await user.click(screen.getByRole("button", { name: /update password/i }))
    expect(await screen.findByText(/password changed/i)).toBeInTheDocument()
  })
})
