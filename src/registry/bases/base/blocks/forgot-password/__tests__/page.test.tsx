import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { ForgotPassword } from "../page"

describe("ForgotPassword", () => {
  it("renders the request form", () => {
    render(<ForgotPassword />)
    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeInTheDocument()
  })

  it("validates the email", async () => {
    const user = userEvent.setup()
    render(<ForgotPassword />)
    await user.click(screen.getByRole("button", { name: /send reset link/i }))
    expect(screen.getByRole("alert")).toHaveTextContent(/enter your email/i)
  })

  it("shows the check-your-email state on submit", async () => {
    const user = userEvent.setup()
    render(<ForgotPassword />)
    await user.type(screen.getByLabelText(/email/i), "alex@acme.com")
    await user.click(screen.getByRole("button", { name: /send reset link/i }))
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument()
  })
})
