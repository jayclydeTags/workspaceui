import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { TwoFactorSetup } from "../page"

describe("TwoFactorSetup", () => {
  it("renders the enrollment step with a setup key", () => {
    render(<TwoFactorSetup />)
    expect(screen.getByText(/set up two-factor auth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/authenticator code/i)).toBeInTheDocument()
  })

  it("errors on a wrong code", async () => {
    const user = userEvent.setup()
    render(<TwoFactorSetup />)
    await user.type(screen.getByLabelText(/authenticator code/i), "000000")
    expect(await screen.findByText(/didn't match/i)).toBeInTheDocument()
  })

  it("enables 2FA with the correct code", async () => {
    const user = userEvent.setup()
    render(<TwoFactorSetup />)
    await user.type(screen.getByLabelText(/authenticator code/i), "123456")
    expect(await screen.findByText(/two-factor enabled/i)).toBeInTheDocument()
  })
})
