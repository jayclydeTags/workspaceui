import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { UsageMeter, getUsageStatus } from "../usage-meter"

describe("getUsageStatus", () => {
  it("classifies usage against the limit", () => {
    expect(getUsageStatus(10, 100)).toBe("ok")
    expect(getUsageStatus(80, 100)).toBe("warning")
    expect(getUsageStatus(100, 100)).toBe("exceeded")
    expect(getUsageStatus(150, 100)).toBe("exceeded")
    expect(getUsageStatus(5, null)).toBe("unlimited")
  })

  it("honors a custom warning threshold", () => {
    expect(getUsageStatus(60, 100, 0.5)).toBe("warning")
    expect(getUsageStatus(60, 100, 0.9)).toBe("ok")
  })
})

describe("UsageMeter", () => {
  it("renders figures, percent, and a labelled progressbar", () => {
    render(
      <UsageMeter label="API requests" used={4200} limit={10000} unit="calls" />
    )
    expect(screen.getByText("4,200 / 10,000 calls")).toBeInTheDocument()
    expect(screen.getByText("42% used")).toBeInTheDocument()

    const bar = screen.getByRole("progressbar", { name: "API requests" })
    expect(bar).toHaveAttribute("aria-valuenow", "42")
    expect(bar).toHaveAttribute(
      "aria-valuetext",
      "4,200 / 10,000 calls, 42% used"
    )
  })

  it("flags the warning state with text, not just color", () => {
    const { container } = render(
      <UsageMeter label="Seats" used={9} limit={10} />
    )
    expect(container.firstChild).toHaveAttribute("data-status", "warning")
    expect(screen.getByText("90% used")).toBeInTheDocument()
  })

  it("reports overage and clamps the bar at 100", () => {
    render(<UsageMeter label="Storage" used={12} limit={10} unit="GB" />)
    expect(screen.getByText("Over limit by 2 GB")).toBeInTheDocument()
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    )
  })

  it("says 'Limit reached' when exactly at the limit", () => {
    render(<UsageMeter label="Projects" used={3} limit={3} />)
    expect(screen.getByText("Limit reached")).toBeInTheDocument()
  })

  it("omits the bar for an unlimited plan", () => {
    render(<UsageMeter label="Members" used={48} limit={null} />)
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    expect(screen.getByText("Unlimited")).toBeInTheDocument()
    expect(screen.getByText("48")).toBeInTheDocument()
  })

  it("uses a custom formatter and renders description and action", () => {
    render(
      <UsageMeter
        label="Bandwidth"
        used={1.5}
        limit={5}
        formatValue={(n) => n.toFixed(1)}
        unit="TB"
        description="Resets Oct 1"
        action={<button type="button">Upgrade</button>}
      />
    )
    expect(screen.getByText("1.5 / 5.0 TB")).toBeInTheDocument()
    expect(screen.getByText("Resets Oct 1")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeInTheDocument()
  })
})
