import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest"

import { RepaymentSchedule } from "../page"
import {
  LOAN,
  buildSchedule,
  monthlyPayment,
  nextUnpaid,
  remainingBalance,
  status,
  type Instalment,
} from "../data"

// The ScheduleTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

// `status()` is derived from the clock, so pin it.
const TODAY = new Date("2026-07-08T00:00:00Z")

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(TODAY)
})
afterAll(() => vi.useRealTimers())

describe("monthlyPayment", () => {
  it("amortises at the given rate", () => {
    expect(monthlyPayment(100000, 6, 360)).toBeCloseTo(599.55, 2)
  })

  it("falls back to straight-line at a zero rate", () => {
    expect(monthlyPayment(1200, 0, 12)).toBe(100)
  })
})

describe("buildSchedule", () => {
  const rows = buildSchedule(LOAN)

  it("has one row per instalment", () => {
    expect(rows).toHaveLength(LOAN.termMonths)
    expect(rows[0].due).toBe("2026-02-01")
    expect(rows[11].due).toBe("2027-01-01")
  })

  it("pays the balance down to exactly zero", () => {
    expect(rows[rows.length - 1].balance).toBe(0)
  })

  it("repays the whole principal across the schedule", () => {
    const repaid = rows.reduce((sum, row) => sum + row.principal, 0)
    expect(repaid).toBeCloseTo(LOAN.principal, 2)
  })

  it("front-loads interest", () => {
    expect(rows[0].interest).toBeGreaterThan(rows[11].interest)
  })

  it("marks instalments up to the cursor paid", () => {
    const partial = buildSchedule(LOAN, 5)
    expect(partial.filter((row) => row.paid)).toHaveLength(5)
    expect(partial[5].paid).toBe(false)
  })
})

describe("status", () => {
  const row = (over: Partial<Instalment>) => ({ paid: false, ...over }) as Instalment

  it("is paid whatever the due date", () => {
    expect(status(row({ paid: true, due: "2020-01-01" }), TODAY)).toBe("paid")
  })

  it("is overdue past the due date", () => {
    expect(status(row({ due: "2026-07-01" }), TODAY)).toBe("overdue")
  })

  it("is due on the day", () => {
    expect(status(row({ due: "2026-07-08" }), TODAY)).toBe("due")
  })

  it("is scheduled in the future", () => {
    expect(status(row({ due: "2026-08-01" }), TODAY)).toBe("scheduled")
  })
})

describe("nextUnpaid / remainingBalance", () => {
  it("is the earliest unsettled instalment", () => {
    expect(nextUnpaid(buildSchedule(LOAN, 5))?.n).toBe(6)
  })

  it("returns the original principal before any payment", () => {
    expect(remainingBalance(buildSchedule(LOAN, 0))).toBe(LOAN.principal)
  })

  it("returns the balance after the last settled instalment", () => {
    const rows = buildSchedule(LOAN, 5)
    expect(remainingBalance(rows)).toBe(rows[4].balance)
  })
})

describe("RepaymentSchedule", () => {
  it("shows the derived summary", () => {
    render(<RepaymentSchedule />)
    expect(screen.getByText(/5\/12 paid/)).toBeInTheDocument()
    expect(screen.getByText("Repayment schedule · LN-2041")).toBeInTheDocument()
  })

  it("offers a payment only on the earliest unpaid instalment", () => {
    render(<RepaymentSchedule />)
    // One button in the table, one in the card list — same single instalment.
    expect(screen.getAllByRole("button", { name: "Record payment" })).toHaveLength(2)
  })

  it("recording a payment advances the cursor", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RepaymentSchedule />)

    await user.click(screen.getAllByRole("button", { name: "Record payment" })[0])
    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Record" }))

    expect(screen.getByText(/6\/12 paid/)).toBeInTheDocument()
  })

  it("hides settled instalments on demand", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RepaymentSchedule />)

    await user.click(screen.getByRole("button", { name: "Hide paid" }))

    expect(screen.queryAllByText("paid")).toHaveLength(0)
    expect(screen.getByRole("button", { name: "Show paid" })).toBeInTheDocument()
  })
})
