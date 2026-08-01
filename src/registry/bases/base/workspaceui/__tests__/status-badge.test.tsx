import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { StatusBadge } from "../status-badge"

type OrderStatus = "paid" | "pending" | "overdue"

const variantMap: Record<OrderStatus, "default" | "secondary" | "destructive"> =
  {
    paid: "default",
    pending: "secondary",
    overdue: "destructive",
  }

describe("StatusBadge", () => {
  it("renders the status as the label when no labelMap is given", () => {
    render(<StatusBadge status="pending" variantMap={variantMap} />)
    expect(screen.getByText("pending")).toBeInTheDocument()
  })

  it("prefers the labelMap entry over the raw status", () => {
    render(
      <StatusBadge<OrderStatus>
        status="overdue"
        variantMap={variantMap}
        labelMap={{ paid: "Paid", pending: "Pending", overdue: "Past Due" }}
      />
    )
    expect(screen.getByText("Past Due")).toBeInTheDocument()
    expect(screen.queryByText("overdue")).not.toBeInTheDocument()
  })

  it("forwards extra Badge props like className", () => {
    render(
      <StatusBadge
        status="paid"
        variantMap={variantMap}
        className="capitalize"
      />
    )
    expect(screen.getByText("paid")).toHaveClass("capitalize")
  })
})
