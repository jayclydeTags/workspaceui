import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Department } from "../page"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("Department", () => {
  it("lists the seeded departments", () => {
    render(<Department />)
    expect(screen.getAllByText("Engineering").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Sales").length).toBeGreaterThan(0)
    expect(screen.getByText("5 departments")).toBeInTheDocument()
  })

  it("creates a new department inline, with no dialog", async () => {
    const user = userEvent.setup()
    render(<Department />)

    await user.click(screen.getByRole("button", { name: /new department/i }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.type(screen.getAllByLabelText("Name")[0], "Marketing")
    await user.type(screen.getAllByLabelText("Code")[0], "mkt")
    await user.type(screen.getAllByLabelText("Manager")[0], "Alex Kim")
    await user.click(screen.getAllByRole("button", { name: "Save" })[0])

    expect(screen.getAllByText("Marketing").length).toBeGreaterThan(0)
    // code is upper-cased on input
    expect(screen.getAllByText("MKT").length).toBeGreaterThan(0)
    expect(screen.getByText("6 departments")).toBeInTheDocument()
  })

  it("discards a blank new-row draft on cancel", async () => {
    const user = userEvent.setup()
    render(<Department />)

    await user.click(screen.getByRole("button", { name: /new department/i }))
    await user.type(screen.getAllByLabelText("Name")[0], "Marketing")
    await user.click(screen.getAllByRole("button", { name: "Cancel" })[0])

    expect(screen.queryByText("Marketing")).not.toBeInTheDocument()
    expect(screen.getByText("5 departments")).toBeInTheDocument()
  })

  it("edits an existing department inline, with no dialog", async () => {
    const user = userEvent.setup()
    render(<Department />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Sales" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    const nameInput = screen.getAllByLabelText("Name")[0]
    await user.clear(nameInput)
    await user.type(nameInput, "Revenue")
    await user.click(screen.getAllByRole("button", { name: "Save" })[0])

    expect(screen.getAllByText("Revenue").length).toBeGreaterThan(0)
    expect(screen.queryByText("Sales")).not.toBeInTheDocument()
  })

  it("deletes a department after confirmation", async () => {
    const user = userEvent.setup()
    render(<Department />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Design" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("dialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Design")).not.toBeInTheDocument()
    expect(screen.getByText("4 departments")).toBeInTheDocument()
  })
})
