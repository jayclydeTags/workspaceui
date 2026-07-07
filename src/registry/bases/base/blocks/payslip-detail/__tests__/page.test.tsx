import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { PayslipDetail } from "../page"
import { EARNINGS, DEDUCTIONS, formatCurrency, sum } from "../data"

describe("PayslipDetail", () => {
  it("renders the employee header and every line item", () => {
    render(<PayslipDetail />)
    expect(
      screen.getByRole("heading", { name: /Payslip · Sarah Chen/ })
    ).toBeInTheDocument()
    for (const item of [...EARNINGS, ...DEDUCTIONS]) {
      expect(screen.getAllByText(item.label).length).toBeGreaterThanOrEqual(1)
    }
  })

  it("shows net pay as earnings minus deductions", () => {
    render(<PayslipDetail />)
    const net = sum(EARNINGS, "current") - sum(DEDUCTIONS, "current")
    expect(screen.getAllByText(formatCurrency(net)).length).toBeGreaterThanOrEqual(1)
  })
})
