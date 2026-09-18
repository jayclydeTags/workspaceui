import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { MetricCard } from "../metric-card"

describe("MetricCard", () => {
  it("renders the label, value, and delta with a direction in text", () => {
    render(
      <MetricCard
        label="Monthly recurring revenue"
        value="$48,210"
        delta={12.5}
        deltaLabel="vs last month"
      />
    )
    expect(screen.getByText("Monthly recurring revenue")).toBeInTheDocument()
    expect(screen.getByText("$48,210")).toBeInTheDocument()
    expect(screen.getByText("vs last month")).toBeInTheDocument()
    const delta = screen.getByText(/\+12\.5%/)
    expect(delta).toHaveTextContent("Up +12.5%")
    expect(delta).toHaveClass("text-success")
  })

  it("colors a decrease as negative by default", () => {
    render(<MetricCard label="Active users" value="1,204" delta={-3.2} />)
    const delta = screen.getByText(/3\.2%/)
    expect(delta).toHaveTextContent("Down -3.2%")
    expect(delta).toHaveClass("text-destructive")
  })

  it("treats a decrease as good when invertDelta is set", () => {
    render(<MetricCard label="Churn" value="2.1%" delta={-0.4} invertDelta />)
    expect(screen.getByText(/0\.4%/)).toHaveClass("text-success")
  })

  it("renders a neutral zero delta", () => {
    render(<MetricCard label="Seats" value="40" delta={0} />)
    const delta = screen.getByText(/0%/)
    expect(delta).toHaveTextContent("No change, 0%")
    expect(delta).toHaveClass("text-muted-foreground")
  })

  it("draws a sparkline only for two or more points", () => {
    const { container, rerender } = render(
      <MetricCard label="Signups" value="320" trend={[4, 8, 6, 12]} />
    )
    expect(container.querySelector("polyline")).toBeInTheDocument()

    rerender(<MetricCard label="Signups" value="320" trend={[4]} />)
    expect(container.querySelector("polyline")).not.toBeInTheDocument()
  })

  it("draws a flat sparkline for a constant series", () => {
    const { container } = render(
      <MetricCard label="Uptime" value="100%" trend={[5, 5, 5]} />
    )
    expect(container.querySelector("polyline")).toHaveAttribute(
      "points",
      "0.00,16.00 48.00,16.00 96.00,16.00"
    )
  })

  it("shows a skeleton and hides the value while loading", () => {
    const { container } = render(
      <MetricCard label="Revenue" value="$1" delta={4} loading />
    )
    expect(screen.getByText("Revenue")).toBeInTheDocument()
    expect(screen.queryByText("$1")).not.toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute("aria-busy", "true")
    expect(
      container.querySelectorAll("[data-slot=skeleton]").length
    ).toBeGreaterThan(0)
  })
})
