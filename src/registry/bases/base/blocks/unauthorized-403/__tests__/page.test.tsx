import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Unauthorized403 } from "../page"

describe("Unauthorized403", () => {
  it("renders the forbidden state", () => {
    render(<Unauthorized403 />)
    expect(screen.getByText(/you don't have access/i)).toBeInTheDocument()
    expect(screen.getByText(/403/)).toBeInTheDocument()
  })

  it("confirms once access is requested", async () => {
    const user = userEvent.setup()
    render(<Unauthorized403 />)
    await user.click(screen.getByRole("button", { name: /request access/i }))
    expect(screen.getByText(/access request sent/i)).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /request access/i })
    ).not.toBeInTheDocument()
  })
})
