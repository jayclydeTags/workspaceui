import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Login } from "../page"

describe("Login", () => {
  it("renders the sign-in form", () => {
    render(<Login />)
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
  })

  it("shows inline validation errors on empty submit", async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.click(screen.getByRole("button", { name: /^sign in$/i }))
    expect(screen.getByText(/enter your email/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your password/i)).toBeInTheDocument()
  })

  it("shows an invalid-credentials banner for wrong credentials", async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.type(screen.getByLabelText(/email/i), "nope@acme.com")
    await user.type(screen.getByLabelText(/^password$/i), "wrong")
    await user.click(screen.getByRole("button", { name: /^sign in$/i }))
    expect(await screen.findByText(/incorrect email or password/i)).toBeInTheDocument()
  })

  it("reaches the signed-in state with the demo credentials", async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.type(screen.getByLabelText(/email/i), "demo@acme.com")
    await user.type(screen.getByLabelText(/^password$/i), "password")
    await user.click(screen.getByRole("button", { name: /^sign in$/i }))
    expect(await screen.findByText(/signed in/i)).toBeInTheDocument()
  })
})
