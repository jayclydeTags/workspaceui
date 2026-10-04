import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

  it("has one Browse components link and no Explore blocks button", () => {
    render(<HomePage />)

    expect(
      screen.getAllByRole("link", { name: /Browse components/ })
    ).toHaveLength(1)
    expect(screen.queryByRole("link", { name: /Explore blocks/ })).toBeNull()
  })

  it("no longer has a features section", () => {
    render(<HomePage />)

    for (const title of [
      "Copy, own, adapt",
      "Accessible by default",
      "Drag, drop & split",
    ]) {
      expect(screen.queryByText(title)).toBeNull()
    }
  })

  describe("FAQ", () => {
    const faq = () =>
      screen.getByRole("region", { name: "Frequently asked questions" })

    it("is an accordion with every question collapsed", () => {
      render(<HomePage />)

      const triggers = within(faq()).getAllByRole("button")
      expect(triggers.map((t) => t.textContent)).toEqual([
        "Is WorkspaceUI free for commercial projects?",
        "How do I install a component?",
        "What does my project need?",
        "Can I change the design and behavior?",
        "Can I try a component before installing it?",
        "What's the difference between components and blocks?",
      ])
      for (const trigger of triggers) {
        expect(trigger).toHaveAttribute("aria-expanded", "false")
      }
      expect(within(faq()).queryByText(/MIT licensed/)).toBeNull()
    })

    it("reveals an answer when its question is opened", async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      await user.click(
        screen.getByRole("button", {
          name: "Is WorkspaceUI free for commercial projects?",
        })
      )

      expect(await within(faq()).findByText(/MIT licensed/)).toBeVisible()
    })

    it("renders the install command in an answer as code", async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      await user.click(
        screen.getByRole("button", { name: "How do I install a component?" })
      )

      expect(
        await within(faq()).findByText(
          "npx shadcn@latest add jayclydeTags/workspaceui/workspace",
          { selector: "code" }
        )
      ).toBeInTheDocument()
      expect(faq().textContent).not.toContain("`")
    })
  })
})
