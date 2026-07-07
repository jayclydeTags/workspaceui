import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Register } from "../page"

describe("Register", () => {
  it("renders the sign-up form", () => {
    render(<Register />)
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
  })

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup()
    render(<Register />)
    await user.click(screen.getByRole("button", { name: /create account/i }))
    expect(screen.getByText(/enter your name/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your email/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a password/i)).toBeInTheDocument()
    expect(screen.getByText(/accept the terms/i)).toBeInTheDocument()
  })

  it("rates password strength as the user types", async () => {
    const user = userEvent.setup()
    render(<Register />)
    await user.type(screen.getByLabelText(/^password$/i), "Ab1!xyzq")
    expect(screen.getByText(/strong/i)).toBeInTheDocument()
  })

  it("reaches the verify-email state on a valid submit", async () => {
    const user = userEvent.setup()
    render(<Register />)
    await user.type(screen.getByLabelText(/full name/i), "Alex Rivera")
    await user.type(screen.getByLabelText(/email/i), "alex@acme.com")
    await user.type(screen.getByLabelText(/^password$/i), "Ab1!xyzq")
    await user.click(screen.getByRole("checkbox"))
    await user.click(screen.getByRole("button", { name: /create account/i }))
    expect(await screen.findByText(/verify your email/i)).toBeInTheDocument()
  })
})
