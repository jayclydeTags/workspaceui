import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import HomePage from "@/app/(marketing)/page"

describe("home page", () => {
  it("leads with a Browse components button that opens the components", () => {
    render(<HomePage />)

    expect(
      screen.getByRole("link", { name: /Browse components/ })
    ).toHaveAttribute("href", "/components")
    expect(screen.queryByRole("link", { name: /Get started/ })).toBeNull()
  })

  it("doesn't link to the removed docs", () => {
    const { container } = render(<HomePage />)

    const hrefs = [...container.querySelectorAll("a")].map((a) =>
      a.getAttribute("href")
    )
    expect(hrefs.some((href) => href?.startsWith("/docs"))).toBe(false)
  })

  it("has one Browse components link, not a duplicate further down", () => {
    render(<HomePage />)
    expect(
      screen.getAllByRole("link", { name: /Browse components/ })
    ).toHaveLength(1)
  })

  it("answers common questions in an FAQ section", () => {
    render(<HomePage />)

    const faq = screen.getByRole("region", {
      name: "Frequently asked questions",
    })
    const questions = within(faq)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent)
    expect(questions).toEqual([
      "Is WorkspaceUI free for commercial projects?",
      "How do I install a component?",
      "What does my project need?",
      "Can I change the design and behavior?",
      "Can I try a component before installing it?",
      "What's the difference between components and blocks?",
    ])
  })

  it("renders the install command in the FAQ as code", () => {
    render(<HomePage />)

    const faq = screen.getByRole("region", {
      name: "Frequently asked questions",
    })
    expect(
      within(faq).getByText(
        "npx shadcn@latest add jayclydeTags/workspaceui/workspace",
        { selector: "code" }
      )
    ).toBeInTheDocument()
    expect(faq.textContent).not.toContain("`")
  })
})
