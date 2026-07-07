import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { LoginSocial } from "../page"

describe("LoginSocial", () => {
  it("renders SSO options and the email form", () => {
    render(<LoginSocial />)
    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /continue with github/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument()
  })

  it("validates the email form on empty submit", async () => {
    const user = userEvent.setup()
    render(<LoginSocial />)
    await user.click(screen.getByRole("button", { name: /^sign in$/i }))
    expect(screen.getByText(/enter your email/i)).toBeInTheDocument()
  })

  it("signs in with the demo credentials", async () => {
    const user = userEvent.setup()
    render(<LoginSocial />)
    await user.type(screen.getByLabelText(/email/i), "demo@acme.com")
    await user.type(screen.getByLabelText(/^password$/i), "password")
    await user.click(screen.getByRole("button", { name: /^sign in$/i }))
    expect(await screen.findByText(/signed in/i)).toBeInTheDocument()
  })
})
