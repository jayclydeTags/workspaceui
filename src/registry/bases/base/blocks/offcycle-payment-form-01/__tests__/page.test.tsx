import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { OffcyclePaymentForm01 } from "../page"
import { emptyPayment, isComplete } from "../data"

describe("OffcyclePaymentForm01", () => {
  it("renders the form with the submit disabled until complete", () => {
    render(<OffcyclePaymentForm01 />)
    expect(screen.getByLabelText("Amount (USD)")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /submit for approval/i })
    ).toBeDisabled()
  })

  // radix Select can't be driven in jsdom, so validate the gate logic directly.
  it("isComplete requires employee, positive amount, date, and reason", () => {
    expect(isComplete(emptyPayment())).toBe(false)
    expect(
      isComplete({
        employeeId: "1",
        type: "bonus",
        amount: "500",
        payDate: "2026-04-01",
        reason: "Q1 spot bonus",
      })
    ).toBe(true)
    expect(
      isComplete({
        employeeId: "1",
        type: "bonus",
        amount: "0",
        payDate: "2026-04-01",
        reason: "x",
      })
    ).toBe(false)
  })
})
