import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { VerifyEmail } from "../page"

describe("VerifyEmail", () => {
  it("renders the confirm-your-email prompt with a resend cooldown", () => {
    render(<VerifyEmail />)
    expect(screen.getByText(/confirm your email/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /resend/i })
    ).toBeDisabled()
  })

  it("moves to the confirmed state once verified", async () => {
    const user = userEvent.setup()
    render(<VerifyEmail />)
    await user.click(screen.getByRole("button", { name: /i've verified/i }))
    expect(screen.getByText(/email confirmed/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument()
  })
})
