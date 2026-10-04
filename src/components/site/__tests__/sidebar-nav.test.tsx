import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { SidebarNav } from "@/components/site/sidebar-nav"
import type { NavSection } from "@/lib/nav"

let pathname = "/blocks/b-one"
vi.mock("next/navigation", () => ({ usePathname: () => pathname }))

const sections: NavSection[] = [
  {
    title: "Family",
    groups: [
      {
        title: "Group A",
        items: [
          { title: "A one", href: "/blocks/a-one" },
          { title: "A two", href: "/blocks/a-two" },
        ],
      },
      {
        title: "Group B",
        items: [{ title: "B one", href: "/blocks/b-one" }],
      },
    ],
  },
]

describe("SidebarNav groups", () => {
  it("opens the group that holds the current page and leaves the rest closed", () => {
    pathname = "/blocks/b-one"
    render(<SidebarNav sections={sections} />)

    expect(screen.getByRole("link", { name: "B one" })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "A one" })).toBeNull()
  })

  it("lets the user close the active group and open another", async () => {
    pathname = "/blocks/b-one"
    const user = userEvent.setup()
    render(<SidebarNav sections={sections} />)

    await user.click(screen.getByRole("button", { name: /Group B/ }))
    expect(screen.queryByRole("link", { name: "B one" })).toBeNull()

    await user.click(screen.getByRole("button", { name: /Group A/ }))
    expect(screen.getByRole("link", { name: "A two" })).toBeInTheDocument()
  })

  it("opens a different group when navigation moves into it", () => {
    pathname = "/blocks/b-one"
    const { rerender } = render(<SidebarNav sections={sections} />)

    pathname = "/blocks/a-two"
    rerender(<SidebarNav sections={sections} />)

    expect(screen.getByRole("link", { name: "A two" })).toBeInTheDocument()
  })
})
