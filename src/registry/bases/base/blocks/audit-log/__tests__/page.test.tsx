import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { AuditLog } from "../page"

describe("AuditLog", () => {
  it("lists seeded audit entries with before → after values", () => {
    render(<AuditLog />)
    expect(screen.getByText("10 changes")).toBeInTheDocument()
    expect(screen.getByText("Invoice #1024")).toBeInTheDocument()
    // before value rendered struck-through, after value emphasized
    expect(screen.getByText("draft")).toBeInTheDocument()
    expect(screen.getByText("sent")).toBeInTheDocument()
  })

  it("filters by search across actor, record, and field", async () => {
    const user = userEvent.setup()
    render(<AuditLog />)

    await user.type(
      screen.getByPlaceholderText("Search actor, record, field…"),
      "credit_limit"
    )

    expect(screen.getByText("1 changes")).toBeInTheDocument()
    expect(screen.getByText("Customer Acme Co.")).toBeInTheDocument()
    expect(screen.queryByText("Invoice #1024")).not.toBeInTheDocument()
  })

  it("filters by action", async () => {
    const user = userEvent.setup()
    render(<AuditLog />)

    await user.click(screen.getByRole("button", { name: /action/i }))
    await user.click(
      await screen.findByRole("menuitemcheckbox", { name: "deleted" })
    )

    expect(screen.getByText("1 changes")).toBeInTheDocument()
    expect(screen.getByText("Discount SUMMER25")).toBeInTheDocument()
  })
})
