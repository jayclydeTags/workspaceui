import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { ProjectTeam } from "../page"
import { emptyDraft, isLastLead, isValid, type Member } from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

const lead = { id: "1", role: "lead" } as Member
const member = { id: "2", role: "member" } as Member

describe("isLastLead", () => {
  it("is true for the only lead", () => {
    expect(isLastLead([lead, member], lead)).toBe(true)
  })

  it("is false once a second lead exists", () => {
    const other = { id: "3", role: "lead" } as Member
    expect(isLastLead([lead, other], lead)).toBe(false)
  })

  it("is false for a non-lead", () => {
    expect(isLastLead([lead, member], member)).toBe(false)
  })
})

describe("isValid", () => {
  const filled = { ...emptyDraft(), name: "Ava Chen", email: "ava@example.com" }

  it("rejects a malformed email", () => {
    expect(isValid({ ...filled, email: "ava@example" })).toBe(false)
  })

  it("rejects an over-allocation", () => {
    expect(isValid({ ...filled, allocation: 41 })).toBe(false)
    expect(isValid({ ...filled, allocation: 40 })).toBe(true)
  })
})

describe("ProjectTeam", () => {
  it("lists the team with total allocation", () => {
    render(<ProjectTeam />)
    expect(screen.getAllByText("Ava Chen").length).toBeGreaterThan(0)
    expect(
      screen.getByText("5 members · 102h / week allocated")
    ).toBeInTheDocument()
  })

  it("adds a member", async () => {
    const user = userEvent.setup()
    render(<ProjectTeam />)

    await user.click(screen.getByRole("button", { name: /add member/i }))
    await user.type(screen.getByLabelText("Name"), "Sam Ortiz")
    await user.type(screen.getByLabelText("Email"), "sam.ortiz@example.com")
    await user.click(screen.getByRole("button", { name: "Add to team" }))

    expect(screen.getAllByText("Sam Ortiz").length).toBeGreaterThan(0)
    expect(
      screen.getByText("6 members · 122h / week allocated")
    ).toBeInTheDocument()
  })

  it("blocks an allocation over a full week", async () => {
    const user = userEvent.setup()
    render(<ProjectTeam />)

    await user.click(screen.getByRole("button", { name: /add member/i }))
    await user.type(screen.getByLabelText("Name"), "Sam Ortiz")
    await user.type(screen.getByLabelText("Email"), "sam.ortiz@example.com")
    await user.clear(screen.getByLabelText("Allocation (h / week)"))
    await user.type(screen.getByLabelText("Allocation (h / week)"), "45")

    expect(screen.getByRole("button", { name: "Add to team" })).toBeDisabled()
    expect(
      screen.getByText("Can't allocate more than 40h a week.")
    ).toBeInTheDocument()
  })

  it("can't remove or demote the only lead", async () => {
    const user = userEvent.setup()
    render(<ProjectTeam />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Ava Chen" })[0]
    )
    expect(await screen.findByRole("menuitem", { name: "Last lead" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )

    await user.click(screen.getByRole("menuitem", { name: "Edit" }))
    expect(screen.getByLabelText("Role")).toBeDisabled()
    expect(
      screen.getByText("The only lead — promote someone else first.")
    ).toBeInTheDocument()
  })

  it("removes a member once a second lead exists", async () => {
    const user = userEvent.setup()
    render(<ProjectTeam />)

    // Promote Marcus, then Ava is no longer the last lead.
    await user.click(
      screen.getAllByRole("button", { name: "Actions for Marcus Webb" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))
    await user.click(screen.getByLabelText("Role"))
    await user.click(await screen.findByRole("option", { name: "lead" }))
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Ava Chen" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Remove" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Remove" }))

    expect(screen.queryByText("Ava Chen")).not.toBeInTheDocument()
    expect(
      screen.getByText("4 members · 62h / week allocated")
    ).toBeInTheDocument()
  })
})
