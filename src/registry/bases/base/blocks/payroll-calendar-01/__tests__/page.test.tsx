import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { PayrollCalendar01 } from "../page"
import { PAY_PERIODS, nextPeriod } from "../data"

describe("PayrollCalendar01", () => {
  it("renders every pay period", () => {
    render(<PayrollCalendar01 />)
    for (const p of PAY_PERIODS) {
      expect(screen.getByText(p.period)).toBeInTheDocument()
    }
  })

  it("highlights the next unpaid pay date", () => {
    render(<PayrollCalendar01 />)
    const next = nextPeriod(PAY_PERIODS)!
    expect(screen.getByText("Next pay date")).toBeInTheDocument()
    expect(screen.getAllByText(next.payDate).length).toBeGreaterThanOrEqual(1)
  })
})
