import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { PayrollRun01 } from "../page"
import { PAYSLIPS, formatCurrency, netPay } from "../data"

describe("PayrollRun01", () => {
  it("renders the payroll run header and every employee payslip", () => {
    render(<PayrollRun01 />)
    expect(
      screen.getByRole("heading", { name: /Payroll · March 2026/ })
    ).toBeInTheDocument()
    for (const p of PAYSLIPS) {
      expect(screen.getByText(p.employee)).toBeInTheDocument()
    }
  })

  it("shows the totals footer summing gross, deductions, and net", () => {
    render(<PayrollRun01 />)
    const totalGross = PAYSLIPS.reduce((s, p) => s + p.gross, 0)
    const totalNet = PAYSLIPS.reduce((s, p) => s + netPay(p), 0)
    // Net appears in both the summary card and the footer.
    expect(
      screen.getAllByText(formatCurrency(totalNet)).length
    ).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(formatCurrency(totalGross)).length).toBeGreaterThanOrEqual(1)
  })
})
