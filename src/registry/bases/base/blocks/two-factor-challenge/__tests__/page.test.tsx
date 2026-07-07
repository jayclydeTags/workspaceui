import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { TwoFactorChallenge } from "../page"

describe("TwoFactorChallenge", () => {
  it("renders the authenticator-app prompt", () => {
    render(<TwoFactorChallenge />)
    expect(screen.getByText(/two-factor authentication/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/authentication code/i)).toBeInTheDocument()
  })

  it("errors on an incorrect authenticator code", async () => {
    const user = userEvent.setup()
    render(<TwoFactorChallenge />)
    await user.type(screen.getByLabelText(/authentication code/i), "000000")
    expect(await screen.findByText(/incorrect code/i)).toBeInTheDocument()
  })

  it("verifies with the correct authenticator code", async () => {
    const user = userEvent.setup()
    render(<TwoFactorChallenge />)
    await user.type(screen.getByLabelText(/authentication code/i), "123456")
    expect(await screen.findByText(/^verified$/i)).toBeInTheDocument()
  })

  it("switches to recovery-code entry", async () => {
    const user = userEvent.setup()
    render(<TwoFactorChallenge />)
    await user.click(screen.getByRole("button", { name: /use a recovery code/i }))
    expect(screen.getByLabelText(/recovery code/i)).toBeInTheDocument()
    await user.type(screen.getByLabelText(/recovery code/i), "acme-4x9k-7qp2")
    await user.click(screen.getByRole("button", { name: /^verify$/i }))
    expect(await screen.findByText(/^verified$/i)).toBeInTheDocument()
  })
})
