import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

import { Contacts } from "../page"
import {
  accountsWithoutPrimary,
  isValid,
  emptyDraft,
  setPrimary,
  type Contact,
} from "../data"

// The DataTable renders both a wide-pane table and a narrow-pane card list;
// jsdom keeps both in the DOM (they're only hidden via CSS), so most queries
// match twice — use the first match / getAllBy.

const c = (id: string, account: string, primary: boolean) =>
  ({ id, account, primary }) as Contact

describe("setPrimary", () => {
  it("demotes the previous primary on the same account", () => {
    const result = setPrimary([c("1", "A", true), c("2", "A", false)], "2")
    expect(result.map((x) => x.primary)).toEqual([false, true])
  })

  it("leaves other accounts alone", () => {
    const result = setPrimary([c("1", "A", true), c("2", "B", false)], "2")
    expect(result[0].primary).toBe(true)
  })
})

describe("accountsWithoutPrimary", () => {
  it("finds accounts with no primary contact", () => {
    expect(
      accountsWithoutPrimary([c("1", "A", true), c("2", "B", false)])
    ).toEqual(["B"])
  })
})

describe("isValid", () => {
  it("requires a name and a well-formed email", () => {
    expect(isValid({ ...emptyDraft(), name: "Iris", email: "iris@x" })).toBe(false)
    expect(isValid({ ...emptyDraft(), name: "Iris", email: "iris@x.example" })).toBe(
      true
    )
  })
})

describe("Contacts", () => {
  it("lists contacts and warns about accounts with no primary", () => {
    render(<Contacts />)
    expect(screen.getByText("5 contacts")).toBeInTheDocument()
    expect(screen.getByText("Fabrikam has no primary contact.")).toBeInTheDocument()
  })

  it("searches across name, account, and email", async () => {
    const user = userEvent.setup()
    render(<Contacts />)

    await user.type(screen.getByLabelText("Search contacts"), "northwind")

    expect(screen.getAllByText("Iris Muller").length).toBeGreaterThan(0)
    expect(screen.queryByText("Devon Park")).not.toBeInTheDocument()
  })

  it("promoting a contact demotes the previous primary", async () => {
    const user = userEvent.setup()
    render(<Contacts />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Ray Whitfield" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Make primary" }))

    expect(
      screen.getAllByLabelText("Primary contact for Northwind").length
    ).toBeGreaterThan(0)
    await user.click(
      screen.getAllByRole("button", { name: "Actions for Iris Muller" })[0]
    )
    expect(
      await screen.findByRole("menuitem", { name: "Make primary" })
    ).toBeInTheDocument()
  })

  it("clears the warning once the account has a primary", async () => {
    const user = userEvent.setup()
    render(<Contacts />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Nadia Rahman" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Make primary" }))

    expect(screen.queryByText(/has no primary contact/)).not.toBeInTheDocument()
  })

  it("creates a contact", async () => {
    const user = userEvent.setup()
    render(<Contacts />)

    await user.click(screen.getByRole("button", { name: /new contact/i }))
    await user.type(screen.getByLabelText("Name"), "Ken Adams")
    await user.type(screen.getByLabelText("Email"), "ken@northwind.example")
    await user.click(screen.getByRole("button", { name: "Create contact" }))

    expect(screen.getAllByText("Ken Adams").length).toBeGreaterThan(0)
    expect(screen.getByText("6 contacts")).toBeInTheDocument()
  })

  it("deletes a contact after confirmation", async () => {
    const user = userEvent.setup()
    render(<Contacts />)

    await user.click(
      screen.getAllByRole("button", { name: "Actions for Owen Blake" })[0]
    )
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }))

    const dialog = screen.getByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))

    expect(screen.queryByText("Owen Blake")).not.toBeInTheDocument()
    expect(screen.getByText("4 contacts")).toBeInTheDocument()
  })
})
