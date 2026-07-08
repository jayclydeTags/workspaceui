import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { LoanApplications } from "../page"
import {
  dti,
  emptyDraft,
  isApprovable,
  isValid,
  monthlyPayment,
  type LoanApplication,
} from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("monthlyPayment", () => {
  it("amortises at the given rate", () => {
    // Textbook: $100k, 6% APR, 30y → $599.55/mo.
    expect(monthlyPayment(100000, 6, 360)).toBeCloseTo(599.55, 2)
  })

  it("falls back to straight-line at a zero rate", () => {
    expect(monthlyPayment(1200, 0, 12)).toBe(100)
  })

  it("is 0 for a non-loan", () => {
    expect(monthlyPayment(0, 6, 360)).toBe(0)
    expect(monthlyPayment(1000, 6, 0)).toBe(0)
  })
})

describe("dti", () => {
  it("includes the payment on this loan", () => {
    // 1200 payment on 0% / 12mo of 14,400, plus 600 debts, over 6,000 income.
    const app = {
      amount: 14400,
      rate: 0,
      termMonths: 12,
      monthlyIncome: 6000,
      monthlyDebts: 600,
    } as LoanApplication
    expect(dti(app)).toBeCloseTo(0.3, 5)
  })

  it("is Infinity with no income", () => {
    expect(dti({ ...emptyDraft(), monthlyIncome: 0 })).toBe(Infinity)
  })
})

describe("isApprovable", () => {
  const base = {
    amount: 14400,
    rate: 0,
    termMonths: 12,
    monthlyIncome: 6000,
    status: "submitted",
  } as LoanApplication

  it("is false over the DTI ceiling", () => {
    expect(isApprovable({ ...base, monthlyDebts: 1500 })).toBe(false) // 45%
    expect(isApprovable({ ...base, monthlyDebts: 1300 })).toBe(true) // ~42%
  })

  it("is false once decided", () => {
    expect(isApprovable({ ...base, monthlyDebts: 0, status: "approved" })).toBe(false)
  })
})

describe("isValid", () => {
  it("requires an income to assess against", () => {
    const d = { ...emptyDraft(), reference: "LN-1", borrower: "X", amount: 1000 }
    expect(isValid(d)).toBe(false)
    expect(isValid({ ...d, monthlyIncome: 5000 })).toBe(true)
  })
})

describe("LoanApplications", () => {
  it("summarises the pending pipeline", () => {
    render(<LoanApplications />)
    expect(screen.getByText("3 pending · $253,000 in pipeline")).toBeInTheDocument()
  })

  it("filters by status", async () => {
    const user = userEvent.setup()
    render(<LoanApplications />)

    await user.click(screen.getByLabelText("Filter by status"))
    await user.click(await screen.findByRole("option", { name: "rejected" }))

    expect(screen.getAllByText("Owen Blake").length).toBeGreaterThan(0)
    expect(screen.queryByText("Iris Muller")).not.toBeInTheDocument()
  })

  it("can't approve an application over the DTI ceiling", async () => {
    const user = userEvent.setup()
    render(<LoanApplications />)

    // Devon Park: 66% DTI.
    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2042" })[0]
    )
    expect(await screen.findByRole("menuitem", { name: "DTI too high" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    // Rejecting is always available.
    expect(screen.getByRole("menuitem", { name: "Reject" })).toBeInTheDocument()
  })

  it("approves an affordable application, dropping it out of pending", async () => {
    const user = userEvent.setup()
    render(<LoanApplications />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2041" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Approve" }))

    expect(screen.getByText("2 pending · $253,000 in pipeline")).toBeInTheDocument()
  })

  it("a decided application offers no further decision", async () => {
    const user = userEvent.setup()
    render(<LoanApplications />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2043" })[0]
    )
    await screen.findByRole("menuitem", { name: "Edit" })
    expect(screen.queryByRole("menuitem", { name: "Reject" })).not.toBeInTheDocument()
  })

  it("lowering the debts brings an application back under the ceiling", async () => {
    const user = userEvent.setup()
    render(<LoanApplications />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2042" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))
    await user.clear(screen.getByLabelText("Monthly debts"))
    await user.type(screen.getByLabelText("Monthly debts"), "300")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2042" })[0]
    )
    expect(await screen.findByRole("menuitem", { name: "Approve" })).toBeInTheDocument()
  })

  it("deletes an application after confirmation", async () => {
    const user = userEvent.setup()
    render(<LoanApplications />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2045" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("LN-2045")).not.toBeInTheDocument()
    expect(screen.getByText("2 pending · $235,000 in pipeline")).toBeInTheDocument()
  })
})
