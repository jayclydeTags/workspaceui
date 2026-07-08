import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Disbursements } from "../page"
import {
  DISBURSEMENTS,
  committed,
  emptyDraft,
  isValid,
  remaining,
  wouldOverdraw,
} from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("committed / remaining", () => {
  it("counts released and scheduled tranches", () => {
    expect(committed(DISBURSEMENTS, "LN-2041")).toBe(60000)
  })

  it("ignores failed tranches", () => {
    expect(committed(DISBURSEMENTS, "LN-2045")).toBe(0)
    expect(remaining(DISBURSEMENTS, "LN-2045")).toBe(18000)
  })

  it("excludes the row being edited from its own headroom", () => {
    expect(remaining(DISBURSEMENTS, "LN-2041")).toBe(0)
    expect(remaining(DISBURSEMENTS, "LN-2041", "2")).toBe(20000)
  })
})

describe("wouldOverdraw", () => {
  const draft = { ...emptyDraft(), borrower: "X", loan: "LN-2043" }

  it("is true past the approved principal", () => {
    expect(wouldOverdraw(DISBURSEMENTS, { ...draft, amount: 30000 })).toBe(true)
    expect(wouldOverdraw(DISBURSEMENTS, { ...draft, amount: 25000 })).toBe(false)
  })
})

describe("isValid", () => {
  it("requires a borrower and a positive amount", () => {
    expect(isValid({ ...emptyDraft(), borrower: "X", amount: 0 })).toBe(false)
    expect(isValid({ ...emptyDraft(), borrower: "X", amount: 1 })).toBe(true)
  })
})

describe("Disbursements", () => {
  it("summarises released funds and scheduled tranches", () => {
    render(<Disbursements />)
    expect(screen.getByText("$140,000 released · 2 scheduled")).toBeInTheDocument()
  })

  it("filters by loan", async () => {
    const user = userEvent.setup()
    render(<Disbursements />)

    await user.click(screen.getByLabelText("Filter by loan"))
    await user.click(await screen.findByRole("option", { name: "LN-2045" }))

    expect(screen.getAllByText("Sofia Marchetti").length).toBeGreaterThan(0)
    expect(screen.queryByText("Iris Muller")).not.toBeInTheDocument()
  })

  it("blocks a tranche that would overdraw the approved principal", async () => {
    const user = userEvent.setup()
    render(<Disbursements />)

    await user.click(screen.getByRole("button", { name: /schedule disbursement/i }))
    await user.click(screen.getByLabelText("Loan"))
    await user.click(await screen.findByRole("option", { name: "LN-2043" }))
    await user.type(screen.getByLabelText("Borrower"), "Nadia Rahman")
    await user.type(screen.getByLabelText("Amount"), "30000")

    expect(screen.getByRole("button", { name: "Schedule" })).toBeDisabled()
    expect(screen.getByText("Only $25,000 left on LN-2043.")).toBeInTheDocument()

    await user.clear(screen.getByLabelText("Amount"))
    await user.type(screen.getByLabelText("Amount"), "25000")
    await user.click(screen.getByRole("button", { name: "Schedule" }))

    expect(screen.getByText("$140,000 released · 3 scheduled")).toBeInTheDocument()
  })

  it("releasing a tranche adds it to released funds", async () => {
    const user = userEvent.setup()
    render(<Disbursements />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2041 $20,000" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Release" }))

    expect(screen.getByText("$160,000 released · 1 scheduled")).toBeInTheDocument()
  })

  it("a settled tranche is read-only", async () => {
    const user = userEvent.setup()
    render(<Disbursements />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2043 $100,000" })[0]
    )
    expect(await screen.findByRole("menuitem", { name: "Settled" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })

  it("failing a tranche frees the loan's headroom", async () => {
    const user = userEvent.setup()
    render(<Disbursements />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2041 $20,000" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Mark failed" }))

    await user.click(screen.getByRole("button", { name: /schedule disbursement/i }))
    expect(
      screen.getByText("$20,000 of approved principal left on LN-2041.")
    ).toBeInTheDocument()
  })

  it("deletes a scheduled tranche after confirmation", async () => {
    const user = userEvent.setup()
    render(<Disbursements />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for LN-2043 $25,000" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.getByText("$140,000 released · 1 scheduled")).toBeInTheDocument()
  })
})
