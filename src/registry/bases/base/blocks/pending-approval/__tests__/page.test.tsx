import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { PendingApproval } from "../page"

describe("PendingApproval", () => {
  it("renders the awaiting-approval status and actions", () => {
    render(<PendingApproval />)
    expect(screen.getByText(/awaiting approval/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /check status/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument()
  })
})
