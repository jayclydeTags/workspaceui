import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { AccessControl } from "../page"
import {
  countChanges,
  setAction,
  INITIAL_PERMISSIONS,
  type PermissionMatrix,
} from "../data"

// The block renders a wide matrix and a narrow card list (CSS picks one); the
// first match of a label is the matrix.
const box = (name: string) => screen.getAllByRole("checkbox", { name })[0]

async function selectRole(
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp
) {
  await user.click(
    within(screen.getByRole("navigation", { name: "Roles" })).getByRole(
      "button",
      { name }
    )
  )
}

describe("setAction", () => {
  it("grants view along with any other action", () => {
    expect(setAction([], "delete", true)).toEqual(["view", "delete"])
  })

  it("revokes everything when view is revoked", () => {
    expect(setAction(["view", "edit"], "view", false)).toEqual([])
  })

  it("revokes a single non-view action", () => {
    expect(setAction(["view", "edit"], "edit", false)).toEqual(["view"])
  })
})

describe("countChanges", () => {
  it("counts cell-level differences", () => {
    const draft: PermissionMatrix = {
      ...INITIAL_PERMISSIONS,
      viewer: { ...INITIAL_PERMISSIONS.viewer, invoices: ["view", "edit"] },
    }
    expect(countChanges(INITIAL_PERMISSIONS, draft, ["viewer"])).toBe(2)
  })
})

describe("AccessControl", () => {
  it("opens on the locked Owner role with read-only permissions", () => {
    render(<AccessControl />)
    expect(screen.getByRole("heading", { name: "Owner" })).toBeInTheDocument()
    expect(screen.getByText("Owner always has full access")).toBeInTheDocument()
    expect(box("Edit Projects")).toHaveAttribute("aria-disabled", "true")
  })

  it("marks the selected role in the role list", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)
    await selectRole(user, /viewer/i)
    expect(
      within(screen.getByRole("navigation", { name: "Roles" })).getByRole(
        "button",
        { name: /viewer/i }
      )
    ).toHaveAttribute("aria-current", "true")
    expect(screen.getByText("Read-only access to content.")).toBeInTheDocument()
  })

  it("grants view automatically when another action is granted", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)
    await selectRole(user, /viewer/i)

    expect(box("View Invoices")).not.toBeChecked()
    await user.click(box("Edit Invoices"))
    expect(box("Edit Invoices")).toBeChecked()
    expect(box("View Invoices")).toBeChecked()

    await user.click(box("View Invoices"))
    expect(box("Edit Invoices")).not.toBeChecked()
  })

  it("grants a whole resource or a whole column at once", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)
    await selectRole(user, /editor/i)

    await user.click(box("All permissions on Billing"))
    for (const action of ["View", "Create", "Edit", "Delete"]) {
      expect(box(`${action} Billing`)).toBeChecked()
    }

    await user.click(box("Delete on every resource"))
    expect(box("Delete API keys")).toBeChecked()
    expect(box("View API keys")).toBeChecked()
  })

  it("stages edits until they're saved or discarded", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)
    await selectRole(user, /viewer/i)

    await user.click(box("Create Documents"))
    expect(screen.getByText("1 unsaved change")).toBeInTheDocument()
    expect(screen.getByText(/affects 28 members/)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Discard" }))
    expect(box("Create Documents")).not.toBeChecked()
    expect(screen.queryByText(/unsaved change/)).not.toBeInTheDocument()

    await user.click(box("Create Documents"))
    await user.click(screen.getByRole("button", { name: "Save changes" }))
    expect(box("Create Documents")).toBeChecked()
    expect(screen.queryByText(/unsaved change/)).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("Saved 1 change.")
  })

  it("adds a role that starts from an existing role's permissions", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)

    await user.click(screen.getByRole("button", { name: "Add role" }))
    const dialog = screen.getByRole("dialog")
    await user.type(within(dialog).getByLabelText("Name"), "Support")
    await user.type(
      within(dialog).getByLabelText("Description"),
      "Handles customer tickets"
    )
    await user.click(
      within(dialog).getByRole("combobox", { name: "Start from" })
    )
    await user.click(await screen.findByRole("option", { name: "Editor" }))
    await user.click(within(dialog).getByRole("button", { name: "Add role" }))

    expect(screen.getByRole("heading", { name: "Support" })).toBeInTheDocument()
    expect(screen.getByText("Custom")).toBeInTheDocument()
    expect(box("Edit Invoices")).toBeChecked()
    expect(box("Delete Invoices")).not.toBeChecked()
    expect(screen.queryByText(/unsaved change/)).not.toBeInTheDocument()
  })

  it("submits the add-role form with Enter", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)
    await user.click(screen.getByRole("button", { name: "Add role" }))
    await user.type(
      within(screen.getByRole("dialog")).getByLabelText("Name"),
      "Auditor{Enter}"
    )
    expect(screen.getByRole("heading", { name: "Auditor" })).toBeInTheDocument()
  })

  it("defaults new roles to the least-privileged role", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)
    await user.click(screen.getByRole("button", { name: "Add role" }))
    expect(
      within(screen.getByRole("dialog")).getByRole("combobox", {
        name: "Start from",
      })
    ).toHaveTextContent("Viewer")
  })

  it("validates the role name on submit", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)
    await user.click(screen.getByRole("button", { name: "Add role" }))
    const dialog = screen.getByRole("dialog")
    const submit = within(dialog).getByRole("button", { name: "Add role" })

    await user.click(submit)
    expect(
      within(dialog).getByText("Enter a name for the role.")
    ).toBeInTheDocument()
    expect(within(dialog).getByLabelText("Name")).toHaveFocus()

    await user.type(within(dialog).getByLabelText("Name"), "editor")
    await user.click(submit)
    expect(
      within(dialog).getByText("A role named “editor” already exists.")
    ).toBeInTheDocument()
  })

  it("duplicates the locked Owner role into an editable copy", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)

    await user.click(screen.getByRole("button", { name: "Duplicate" }))
    const dialog = screen.getByRole("dialog")
    expect(within(dialog).getByLabelText("Name")).toHaveValue("Owner copy")
    await user.click(within(dialog).getByRole("button", { name: "Add role" }))

    expect(
      screen.getByRole("heading", { name: "Owner copy" })
    ).toBeInTheDocument()
    expect(box("Delete Settings")).toBeChecked()
    expect(box("Delete Settings")).not.toHaveAttribute("aria-disabled", "true")
  })

  it("deletes a custom role after confirmation, but not built-in ones", async () => {
    const user = userEvent.setup()
    render(<AccessControl />)

    await user.click(
      screen.getByRole("button", { name: "More actions for Owner" })
    )
    expect(
      await screen.findByRole("menuitem", { name: "Delete role" })
    ).toHaveAttribute("aria-disabled", "true")
    await user.keyboard("{Escape}")

    await user.click(screen.getByRole("button", { name: "Add role" }))
    await user.type(
      within(screen.getByRole("dialog")).getByLabelText("Name"),
      "Temp"
    )
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Add role",
      })
    )

    await user.click(
      screen.getByRole("button", { name: "More actions for Temp" })
    )
    await user.click(
      await screen.findByRole("menuitem", { name: "Delete role" })
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete role",
      })
    )

    expect(
      within(screen.getByRole("navigation", { name: "Roles" })).queryByRole(
        "button",
        { name: /temp/i }
      )
    ).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Owner" })).toBeInTheDocument()
  })
})
