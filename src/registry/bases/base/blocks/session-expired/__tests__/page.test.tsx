import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { SessionExpired } from "../page"

describe("SessionExpired", () => {
  it("renders the re-auth prompt", () => {
    render(<SessionExpired />)
    expect(screen.getByText(/session expired/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it("errors on a wrong password", async () => {
    const user = userEvent.setup()
    render(<SessionExpired />)
    await user.type(screen.getByLabelText(/password/i), "nope")
    await user.click(screen.getByRole("button", { name: /continue/i }))
    expect(await screen.findByText(/incorrect password/i)).toBeInTheDocument()
  })

  it("re-authenticates with the correct password", async () => {
    const user = userEvent.setup()
    render(<SessionExpired />)
    await user.type(screen.getByLabelText(/password/i), "password")
    await user.click(screen.getByRole("button", { name: /continue/i }))
    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument()
  })
})
