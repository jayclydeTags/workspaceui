import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { PasswordInput, scorePassword } from "../password-input"

describe("scorePassword", () => {
  it("scores from weak to strong", () => {
    expect(scorePassword("")).toBe(0)
    expect(scorePassword("short")).toBe(0) // < 8 chars, single case
    expect(scorePassword("lowercaseonly")).toBe(1) // length only
    expect(scorePassword("MixedCase1")).toBe(2) // length + case mix
    expect(scorePassword("MixedCase1!")).toBe(3) // + digit & symbol
  })
})

describe("PasswordInput", () => {
  it("masks by default and toggles visibility", async () => {
    const user = userEvent.setup()
    render(<PasswordInput aria-label="Password" />)
    const input = screen.getByLabelText("Password")
    expect(input).toHaveAttribute("type", "password")

    await user.click(screen.getByRole("button", { name: /show password/i }))
    expect(input).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: /hide password/i }))
    expect(input).toHaveAttribute("type", "password")
  })

  it("shows a live strength label only when showStrength and a value is present", async () => {
    const user = userEvent.setup()
    render(<PasswordInput aria-label="Password" showStrength />)
    expect(screen.queryByText(/strong|weak|good/i)).not.toBeInTheDocument()

    await user.type(screen.getByLabelText("Password"), "MixedCase1!")
    expect(screen.getByText("Strong")).toBeInTheDocument()
  })

  it("omits the meter without showStrength", async () => {
    const user = userEvent.setup()
    render(<PasswordInput aria-label="Password" />)
    await user.type(screen.getByLabelText("Password"), "MixedCase1!")
    expect(screen.queryByText("Strong")).not.toBeInTheDocument()
  })

  it("renders a live requirements checklist that flips as rules are met", async () => {
    const user = userEvent.setup()
    render(<PasswordInput aria-label="Password" showChecklist />)
    // Nothing typed yet — checklist hidden.
    expect(screen.queryByText("A number")).not.toBeInTheDocument()

    const input = screen.getByLabelText("Password")
    await user.type(input, "abc")
    // "A lowercase letter" is met, "A number" is not.
    expect(screen.getByText("A lowercase letter").closest("li")).toHaveTextContent(
      /— met$/
    )
    expect(screen.getByText("A number").closest("li")).toHaveTextContent(
      /not met$/
    )

    await user.clear(input)
    await user.type(input, "MixedCase1!")
    expect(
      screen.getByText("At least 8 characters").closest("li")
    ).toHaveTextContent(/— met$/)
    expect(screen.getByText("A symbol").closest("li")).toHaveTextContent(/— met$/)
  })
})
