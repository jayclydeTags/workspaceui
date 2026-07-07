import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { PayrollCalendar } from "../page"
import { PAY_PERIODS, nextPeriod } from "../data"

describe("PayrollCalendar", () => {
  it("renders every pay period", () => {
    render(<PayrollCalendar />)
    for (const p of PAY_PERIODS) {
      expect(screen.getByText(p.period)).toBeInTheDocument()
    }
  })

  it("highlights the next unpaid pay date", () => {
    render(<PayrollCalendar />)
    const next = nextPeriod(PAY_PERIODS)!
    expect(screen.getByText("Next pay date")).toBeInTheDocument()
    expect(screen.getAllByText(next.payDate).length).toBeGreaterThanOrEqual(1)
  })
})
