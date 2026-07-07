import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { OtpVerify } from "../page"

describe("OtpVerify", () => {
  it("renders the code-entry prompt", () => {
    render(<OtpVerify />)
    expect(screen.getByText(/enter verification code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument()
  })

  it("shows an error for an incorrect code", async () => {
    const user = userEvent.setup()
    render(<OtpVerify />)
    await user.type(screen.getByLabelText(/verification code/i), "000000")
    expect(await screen.findByText(/incorrect code/i)).toBeInTheDocument()
  })

  it("verifies with the correct code", async () => {
    const user = userEvent.setup()
    render(<OtpVerify />)
    await user.type(screen.getByLabelText(/verification code/i), "123456")
    expect(await screen.findByText(/^verified$/i)).toBeInTheDocument()
  })
})
