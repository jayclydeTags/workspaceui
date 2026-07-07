import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { JournalEntries } from "../page"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("JournalEntries", () => {
  it("lists the seeded entries", () => {
    render(<JournalEntries />)
    expect(screen.getAllByText("JE-1001").length).toBeGreaterThan(0)
    expect(screen.getByText("3 entries")).toBeInTheDocument()
  })

  it("blocks submit until debits and credits balance", async () => {
    const user = userEvent.setup()
    render(<JournalEntries />)

    await user.click(screen.getByRole("button", { name: /new entry/i }))
    await user.type(screen.getByLabelText("Reference"), "JE-2000")

    const comboboxes = screen.getAllByRole("combobox")
    await user.click(comboboxes[0])
    await user.click(await screen.findByRole("option", { name: "1000 Cash" }))
    await user.type(screen.getAllByLabelText("Debit")[0], "100")

    expect(screen.getByText(/out of balance/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create entry" })).toBeDisabled()

    await user.click(comboboxes[1])
    await user.click(
      await screen.findByRole("option", { name: "4000 Sales Revenue" })
    )
    await user.type(screen.getAllByLabelText("Credit")[1], "100")

    expect(screen.getByText("Balanced")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Create entry" })
    ).toBeEnabled()

    await user.click(screen.getByRole("button", { name: "Create entry" }))

    expect(screen.getAllByText("JE-2000").length).toBeGreaterThan(0)
    expect(screen.getByText("4 entries")).toBeInTheDocument()
  })

  it("edits an existing entry's memo", async () => {
    const user = userEvent.setup()
    render(<JournalEntries />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for JE-1001" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    const memoInput = screen.getByLabelText("Memo")
    await user.clear(memoInput)
    await user.type(memoInput, "June rent — updated")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(
      screen.getAllByText("June rent — updated").length
    ).toBeGreaterThan(0)
  })

  it("deletes an entry after confirmation", async () => {
    const user = userEvent.setup()
    render(<JournalEntries />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for JE-1003" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("JE-1003")).not.toBeInTheDocument()
    expect(screen.getByText("2 entries")).toBeInTheDocument()
  })
})
