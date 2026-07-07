import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { AccountSuspended } from "../page"

describe("AccountSuspended", () => {
  it("renders the suspended state with a reason", () => {
    render(<AccountSuspended />)
    expect(screen.getByText(/account suspended/i)).toBeInTheDocument()
    expect(screen.getByText(/terms of service violation/i)).toBeInTheDocument()
  })

  it("confirms once an appeal is submitted", async () => {
    const user = userEvent.setup()
    render(<AccountSuspended />)
    await user.click(screen.getByRole("button", { name: /appeal suspension/i }))
    expect(screen.getByText(/appeal submitted/i)).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /appeal suspension/i })
    ).not.toBeInTheDocument()
  })
})
