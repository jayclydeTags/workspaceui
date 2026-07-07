import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { AccessControl } from "../page"

describe("AccessControl", () => {
  it("shows the first role's permissions by default", () => {
    render(<AccessControl />)
    expect(screen.getByRole("heading", { name: "Owner" })).toBeInTheDocument()
    expect(
      screen.getByText("Full control over the workspace")
    ).toBeInTheDocument()
  })

  it("switches the permission matrix when a different role is selected", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)

    await user.click(screen.getByRole("button", { name: /viewer/i }))
    expect(screen.getByText("Read-only access")).toBeInTheDocument()

    const deleteCheckboxes = screen.getAllByRole("checkbox", {
      name: "delete Projects",
    })
    deleteCheckboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked())
  })

  it("toggles a permission checkbox on click", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)

    const [editCheckbox] = screen.getAllByRole("checkbox", {
      name: "edit Documents",
    })
    expect(editCheckbox).toBeChecked()

    await user.click(editCheckbox)
    expect(editCheckbox).not.toBeChecked()
  })

  it("adds a new role via the dialog", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)

    await user.click(screen.getByRole("button", { name: /add role/i }))
    await user.type(screen.getByLabelText("Name"), "Support")
    await user.type(
      screen.getByLabelText("Description"),
      "Handles customer tickets"
    )
    await user.click(screen.getByRole("button", { name: "Add role" }))

    expect(screen.getByRole("heading", { name: "Support" })).toBeInTheDocument()
    expect(screen.getByText("Handles customer tickets")).toBeInTheDocument()
  })

  it("ignores submission when the name is blank", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)

    await user.click(screen.getByRole("button", { name: /add role/i }))
    await user.click(screen.getByRole("button", { name: "Add role" }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add role" })).toBeInTheDocument()
  })
})
