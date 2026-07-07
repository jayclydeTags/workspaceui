import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { UpgradeRequired } from "../page"

describe("UpgradeRequired", () => {
  it("renders the plan-gated state", () => {
    render(<UpgradeRequired />)
    expect(screen.getByText(/upgrade to unlock/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /upgrade to pro/i })
    ).toBeInTheDocument()
  })

  it("confirms once an admin upgrade is requested", async () => {
    const user = userEvent.setup()
    render(<UpgradeRequired />)
    await user.click(screen.getByRole("button", { name: /ask an admin/i }))
    expect(screen.getByText(/upgrade request sent/i)).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /ask an admin/i })
    ).not.toBeInTheDocument()
  })
})
