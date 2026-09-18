import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Navbar01 } from "../navbar-01/navbar"
import { Navbar02 } from "../navbar-02/navbar"
import { Navbar03 } from "../navbar-03/navbar"
import { Navbar04 } from "../navbar-04/navbar"
import { Navbar05 } from "../navbar-05/navbar"
import { Navbar06 } from "../navbar-06/navbar"
import { Navbar07 } from "../navbar-07/navbar"
import { Navbar08 } from "../navbar-08/navbar"
import { Navbar09 } from "../navbar-09/navbar"
import { Navbar10 } from "../navbar-10/navbar"
import { Navbar11 } from "../navbar-11/navbar"
import { Navbar12 } from "../navbar-12/navbar"

const NAVBARS = {
  Navbar01,
  Navbar02,
  Navbar03,
  Navbar04,
  Navbar05,
  Navbar06,
  Navbar07,
  Navbar08,
  Navbar09,
  Navbar10,
  Navbar11,
  Navbar12,
}

describe.each(Object.entries(NAVBARS))("%s", (_, Navbar) => {
  it("renders a banner with the home link", () => {
    render(<Navbar />)
    const banner = screen.getByRole("banner")
    expect(within(banner).getByRole("link", { name: /acme/i })).toBeVisible()
  })

  // jsdom ignores the responsive classes, so the menu button every navbar
  // ships (mobile-only in some, always-on in others) is reachable in all.
  it("opens its menu from the menu button and closes on Escape", async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    await user.click(screen.getByRole("button", { name: "Open menu" }))
    const dialog = await screen.findByRole("dialog")
    const nav = within(dialog).getByRole("navigation")
    expect(within(nav).getAllByRole("link").length).toBeGreaterThan(0)

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})

describe("mega and dropdown menus", () => {
  it("Navbar06 shows grouped links and featured posts", async () => {
    const user = userEvent.setup()
    render(<Navbar06 />)

    await user.click(screen.getByRole("button", { name: "Product" }))

    expect(await screen.findByText("From the blog")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /dashboards/i })).toBeVisible()
  })

  it("Navbar07 shows the footer call to action", async () => {
    const user = userEvent.setup()
    render(<Navbar07 />)

    await user.click(screen.getByRole("button", { name: "Platform" }))

    expect(
      await screen.findByRole("link", { name: "Start a free trial" })
    ).toBeInTheDocument()
  })

  it("Navbar09 lists collections and announces the cart count", async () => {
    const user = userEvent.setup()
    render(<Navbar09 />)

    expect(
      screen.getByRole("button", { name: "Cart, 2 items" })
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Shop" }))
    expect(
      await screen.findByRole("link", { name: /summer edit/i })
    ).toBeInTheDocument()
  })
})

describe("Navbar11 newsletter", () => {
  it("confirms a subscription after submitting an email", async () => {
    const user = userEvent.setup()
    render(<Navbar11 />)

    await user.click(screen.getByRole("button", { name: "Open menu" }))
    await user.type(await screen.findByLabelText("Email"), "ada@example.com")
    await user.click(screen.getByRole("button", { name: "Subscribe" }))

    expect(screen.getByRole("status")).toHaveTextContent(/check your inbox/i)
  })
})
