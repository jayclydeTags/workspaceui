import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { ResetPassword } from "../page"

describe("ResetPassword", () => {
  it("renders the new-password form", () => {
    render(<ResetPassword />)
    expect(
      screen.getByRole("button", { name: /update password/i })
    ).toBeInTheDocument()
  })

  it("rejects mismatched passwords", async () => {
    const user = userEvent.setup()
    render(<ResetPassword />)
    await user.type(screen.getByLabelText(/new password/i), "Ab1!xyzq")
    await user.type(screen.getByLabelText(/confirm password/i), "different")
    await user.click(screen.getByRole("button", { name: /update password/i }))
    expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
  })

  it("confirms once a valid matching password is submitted", async () => {
    const user = userEvent.setup()
    render(<ResetPassword />)
    await user.type(screen.getByLabelText(/new password/i), "Ab1!xyzq")
    await user.type(screen.getByLabelText(/confirm password/i), "Ab1!xyzq")
    await user.click(screen.getByRole("button", { name: /update password/i }))
    expect(await screen.findByText(/password updated/i)).toBeInTheDocument()
  })
})
