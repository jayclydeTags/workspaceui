import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Borrowers } from "../page"
import {
  canBorrow,
  emptyDraft,
  isRemovable,
  isValid,
  riskGrade,
  type Borrower,
} from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("riskGrade", () => {
  it("maps scores to grades at the cut-offs", () => {
    expect(riskGrade(740)).toBe("A")
    expect(riskGrade(739)).toBe("B")
    expect(riskGrade(670)).toBe("B")
    expect(riskGrade(580)).toBe("C")
    expect(riskGrade(579)).toBe("D")
  })
})

describe("canBorrow", () => {
  it("requires verified KYC", () => {
    expect(canBorrow({ kyc: "verified" } as Borrower)).toBe(true)
    expect(canBorrow({ kyc: "pending" } as Borrower)).toBe(false)
  })
})

describe("isRemovable", () => {
  it("is false while loans are active", () => {
    expect(isRemovable({ activeLoans: 1 } as Borrower)).toBe(false)
    expect(isRemovable({ activeLoans: 0 } as Borrower)).toBe(true)
  })
})

describe("isValid", () => {
  const filled = { ...emptyDraft(), name: "Iris", email: "iris@x.example" }

  it("rejects a score outside the FICO range", () => {
    expect(isValid({ ...filled, creditScore: 299 })).toBe(false)
    expect(isValid({ ...filled, creditScore: 851 })).toBe(false)
    expect(isValid({ ...filled, creditScore: 700 })).toBe(true)
  })

  it("rejects a malformed email", () => {
    expect(isValid({ ...filled, email: "iris@x" })).toBe(false)
  })
})

describe("Borrowers", () => {
  it("summarises eligible borrowers and outstanding debt", () => {
    render(<Borrowers />)
    expect(
      screen.getByText("5 borrowers · 3 eligible · $197,700 outstanding")
    ).toBeInTheDocument()
  })

  it("searches by name, email, and phone", async () => {
    const user = userEvent.setup()
    render(<Borrowers />)

    await user.type(screen.getByLabelText("Search borrowers"), "fabrikam")

    expect(screen.getAllByText("Nadia Rahman").length).toBeGreaterThan(0)
    expect(screen.queryByText("Iris Muller")).not.toBeInTheDocument()
  })

  it("verifying KYC makes a borrower eligible", async () => {
    const user = userEvent.setup()
    render(<Borrowers />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Devon Park" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Mark verified" }))

    expect(
      screen.getByText("5 borrowers · 4 eligible · $197,700 outstanding")
    ).toBeInTheDocument()
  })

  it("can't delete a borrower with active loans", async () => {
    const user = userEvent.setup()
    render(<Borrowers />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Nadia Rahman" })[0]
    )
    expect(
      await screen.findByRole("menuitem", { name: "Has active loans" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  it("creates a borrower with no loans", async () => {
    const user = userEvent.setup()
    render(<Borrowers />)

    await user.click(screen.getByRole("button", { name: /new borrower/i }))
    await user.type(screen.getByLabelText("Name"), "Ken Adams")
    await user.type(screen.getByLabelText("Email"), "ken@acme.example")
    await user.click(screen.getByRole("button", { name: "Create borrower" }))

    expect(screen.getAllByText("Ken Adams").length).toBeGreaterThan(0)
    expect(
      screen.getByText("6 borrowers · 3 eligible · $197,700 outstanding")
    ).toBeInTheDocument()
  })

  it("blocks a credit score outside the FICO range", async () => {
    const user = userEvent.setup()
    render(<Borrowers />)

    await user.click(screen.getByRole("button", { name: /new borrower/i }))
    await user.type(screen.getByLabelText("Name"), "Ken Adams")
    await user.type(screen.getByLabelText("Email"), "ken@acme.example")
    await user.clear(screen.getByLabelText("Credit score"))
    await user.type(screen.getByLabelText("Credit score"), "900")

    expect(screen.getByRole("button", { name: "Create borrower" })).toBeDisabled()
    expect(screen.getByText("Must be between 300 and 850.")).toBeInTheDocument()
  })

  it("deletes a loan-free borrower after confirmation", async () => {
    const user = userEvent.setup()
    render(<Borrowers />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Owen Blake" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Owen Blake")).not.toBeInTheDocument()
    expect(
      screen.getByText("4 borrowers · 3 eligible · $197,700 outstanding")
    ).toBeInTheDocument()
  })
})
