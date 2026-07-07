import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Employee } from "../page"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

describe("Employee", () => {
  it("lists the seeded employees", () => {
    render(<Employee />)
    expect(screen.getAllByText("Sarah Chen").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Mike Johnson").length).toBeGreaterThan(0)
    expect(screen.getByText("7 employees")).toBeInTheDocument()
  })

  it("creates a new employee", async () => {
    const user = userEvent.setup()
    render(<Employee />)

    await user.click(screen.getByRole("button", { name: /new employee/i }))
    await user.type(screen.getByLabelText("Name"), "Alex Kim")
    await user.type(screen.getByLabelText("Email"), "alex.kim@acme.co")
    await user.type(screen.getByLabelText("Department"), "Marketing")
    await user.click(
      screen.getByRole("button", { name: "Create employee" })
    )

    expect(screen.getAllByText("Alex Kim").length).toBeGreaterThan(0)
    expect(screen.getByText("8 employees")).toBeInTheDocument()
  })

  it("edits an existing employee", async () => {
    const user = userEvent.setup()
    render(<Employee />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Mike Johnson" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }))

    const nameInput = screen.getByLabelText("Name")
    await user.clear(nameInput)
    await user.type(nameInput, "Michael Johnson")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(screen.getAllByText("Michael Johnson").length).toBeGreaterThan(0)
    expect(screen.queryByText("Mike Johnson")).not.toBeInTheDocument()
  })

  it("deletes an employee after confirmation", async () => {
    const user = userEvent.setup()
    render(<Employee />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Lena Ortiz" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Lena Ortiz")).not.toBeInTheDocument()
    expect(screen.getByText("6 employees")).toBeInTheDocument()
  })
})
