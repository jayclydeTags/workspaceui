import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Studio as BareStudio, defineStory } from "@/components/studio/studio"

interface Args {
  label: string
  count: number
  loud: boolean
  tone: "calm" | "angry"
}

function Preview({ label, count, loud, tone }: Args) {
  return (
    <p data-testid="preview">
      {label}:{count}:{String(loud)}:{tone}
    </p>
  )
}

const Studio = defineStory<Args>({
  args: { label: "Hello", count: 2, loud: false, tone: "calm" },
  controls: {
    label: { type: "text" },
    count: { type: "number", min: 0 },
    loud: { type: "boolean" },
    tone: { type: "select", options: ["calm", "angry"], group: "style" },
  },
  preview: Preview,
})

const slots = {
  slug: "thing",
  title: "Thing",
  description: "A thing.",
  examples: [
    { id: "thing", label: "Overview", node: <p>overview demo</p> },
    { id: "thing-loading", label: "Loading", node: <p>loading demo</p> },
  ],
  prev: { title: "Avatar Stack", href: "/components/avatar-stack" },
  next: { title: "Usage Meter", href: "/components/usage-meter" },
  install: "npx shadcn@latest add jayclydeTags/workspaceui/thing",
  api: [
    { type: "heading" as const, text: "Thing" },
    {
      type: "table" as const,
      columns: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`label`", "`string`", "-", "What it says."],
        ["`loud`", "`boolean`", "`false`", "Shout it."],
      ],
    },
  ],
}

const playground = () => screen.getByTestId("preview")

describe("Studio", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      // Stacked (below lg) layout: jsdom has no layout, and the resizable
      // panel group throws on pointer events without one.
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    )
  })

  describe("inspector", () => {
    it("is a single panel with no tabs", () => {
      render(<Studio {...slots} />)
      expect(screen.queryByRole("tablist")).toBeNull()
      expect(screen.queryByRole("tab")).toBeNull()
    })

    it("lists name, description, props, variations, installation, then the API", () => {
      render(<Studio {...slots} />)

      const panel = screen.getByRole("complementary", {
        name: "Component details",
      })
      const headings = within(panel)
        .getAllByRole("heading")
        .map((h) => h.textContent)
      expect(headings).toEqual([
        "Thing",
        "Props",
        "Variations",
        "Installation",
        "API reference",
        "Thing",
      ])
      expect(within(panel).getByText("A thing.")).toBeInTheDocument()
    })

    it("puts style controls under Variations and the rest under Props", () => {
      render(<Studio {...slots} />)

      expect(screen.getByRole("textbox", { name: "label" })).toBeInTheDocument()
      expect(screen.getByRole("combobox", { name: "tone" })).toBeInTheDocument()
    })

    it("shows the install command", () => {
      render(<Studio {...slots} />)
      expect(
        screen.getByText("npx shadcn@latest add jayclydeTags/workspaceui/thing")
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Copy to clipboard" })
      ).toBeInTheDocument()
    })

    it("lays the API table out as a stacked entry per prop", () => {
      render(<Studio {...slots} />)

      const label = screen
        .getByText("label", { selector: "dt code" })
        .closest("div")!
      expect(within(label).getByText("string")).toBeInTheDocument()
      expect(within(label).getByText("What it says.")).toBeInTheDocument()
      // an empty default ("-") is left out, a real one is labelled
      expect(within(label).queryByText(/Default/)).toBeNull()
      const loud = screen
        .getByText("loud", { selector: "dt code" })
        .closest("div")!
      expect(within(loud).getByText(/Default:/)).toBeInTheDocument()
    })

    it("omits the controls and API sections when there is nothing to show", () => {
      render(<BareStudio {...slots} api={[]} />)

      const panel = screen.getByRole("complementary", {
        name: "Component details",
      })
      const headings = within(panel)
        .getAllByRole("heading")
        .map((h) => h.textContent)
      expect(headings).toEqual(["Thing", "Installation"])
    })
  })

  describe("controls", () => {
    it("renders the playground with the story's initial args", () => {
      render(<Studio {...slots} />)
      expect(playground()).toHaveTextContent("Hello:2:false:calm")
    })

    it("updates the playground as controls change", async () => {
      const user = userEvent.setup()
      render(<Studio {...slots} />)

      const label = screen.getByRole("textbox", { name: "label" })
      await user.clear(label)
      await user.keyboard("Bye")
      await user.click(screen.getByRole("checkbox", { name: "loud" }))

      expect(playground()).toHaveTextContent("Bye:2:true:calm")
    })

    it("restores the initial args on Reset", async () => {
      const user = userEvent.setup()
      render(<Studio {...slots} />)

      const label = screen.getByRole("textbox", { name: "label" })
      await user.clear(label)
      await user.keyboard("Bye")
      await user.click(screen.getByRole("button", { name: "Reset" }))

      expect(playground()).toHaveTextContent("Hello:2:false:calm")
      expect(screen.getByRole("textbox", { name: "label" })).toHaveValue(
        "Hello"
      )
    })
  })

  describe("external docs", () => {
    it("links to the official docs when the slots give a docsUrl", () => {
      render(
        <Studio
          {...slots}
          api={[]}
          docsUrl="https://ui.shadcn.com/docs/components/base/thing"
        />
      )

      const panel = screen.getByRole("complementary", {
        name: "Component details",
      })
      const link = within(panel).getByRole("link", {
        name: /View on ui\.shadcn\.com/,
      })
      expect(link).toHaveAttribute(
        "href",
        "https://ui.shadcn.com/docs/components/base/thing"
      )
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"))
    })

    it("shows no docs link for a component with its own API table", () => {
      render(<Studio {...slots} />)
      expect(screen.queryByRole("link", { name: /ui\.shadcn\.com/ })).toBeNull()
    })
  })

  describe("component info toggle", () => {
    const panel = () =>
      screen.queryByRole("complementary", { name: "Component details" })

    it("shows the panel by default", () => {
      render(<Studio {...slots} />)

      expect(panel()).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Component info" })
      ).toHaveAttribute("aria-pressed", "true")
    })

    it("hides and re-shows the panel without remounting the canvas", async () => {
      const user = userEvent.setup()
      render(<Studio {...slots} />)
      const toggle = screen.getByRole("button", { name: "Component info" })
      const before = playground()

      await user.click(toggle)
      expect(panel()).toBeNull()
      expect(toggle).toHaveAttribute("aria-pressed", "false")
      expect(playground()).toBe(before)

      await user.click(toggle)
      expect(panel()).toBeInTheDocument()
    })

    it("keeps the current control values while the panel is hidden", async () => {
      const user = userEvent.setup()
      render(<Studio {...slots} />)

      await user.click(screen.getByRole("checkbox", { name: "loud" }))
      await user.click(screen.getByRole("button", { name: "Component info" }))
      expect(playground()).toHaveTextContent("Hello:2:true:calm")

      await user.click(screen.getByRole("button", { name: "Component info" }))
      expect(screen.getByRole("checkbox", { name: "loud" })).toBeChecked()
    })
  })

  describe("toolbar tooltips", () => {
    it.each([
      ["Reload canvas", /Reload the component/],
      ["Tablet", /768px/],
      ["Mobile", /384px/],
      ["Component info", /Hide component info/],
      ["Next component: Usage Meter", /Next: Usage Meter/],
    ])("explains the %s button on hover", async (name, text) => {
      const user = userEvent.setup()
      render(<Studio {...slots} examples={[]} />)

      await user.hover(
        screen.getByRole(name.startsWith("Next") ? "link" : "button", { name })
      )

      expect(await screen.findByText(text)).toBeInTheDocument()
    })

    it("flips the info tooltip once the panel is hidden", async () => {
      const user = userEvent.setup()
      render(<Studio {...slots} examples={[]} />)

      const toggle = screen.getByRole("button", { name: "Component info" })
      await user.click(toggle)
      await user.unhover(toggle)
      await user.hover(toggle)

      expect(await screen.findByText("Show component info")).toBeInTheDocument()
    })
  })

  describe("canvas", () => {
    it("shows only the component: no Playground or Variants sections", () => {
      render(<Studio {...slots} examples={[]} />)

      expect(screen.queryByRole("region", { name: "Playground" })).toBeNull()
      expect(screen.queryByText("Playground")).toBeNull()
      expect(screen.queryByText("Variants")).toBeNull()
      // one preview, however many variations the story has
      expect(screen.getAllByTestId("preview")).toHaveLength(1)
    })

    it("applies a variation to the component", async () => {
      const user = userEvent.setup()
      render(<Studio {...slots} examples={[]} />)

      await user.click(screen.getByRole("combobox", { name: "tone" }))
      await user.click(await screen.findByRole("option", { name: "angry" }))

      expect(playground()).toHaveTextContent("Hello:2:false:angry")
    })

    it("names the component in the toolbar instead of a dropdown", () => {
      render(<Studio {...slots} examples={[]} />)

      expect(screen.queryByRole("combobox", { name: "Jump to" })).toBeNull()
      expect(
        within(screen.getByRole("region", { name: "Canvas" })).getByText(
          "Thing"
        )
      ).toBeInTheDocument()
    })

    it("links to the previous and next components", () => {
      render(<Studio {...slots} examples={[]} />)

      expect(
        screen.getByRole("link", { name: "Previous component: Avatar Stack" })
      ).toHaveAttribute("href", "/components/avatar-stack")
      expect(
        screen.getByRole("link", { name: "Next component: Usage Meter" })
      ).toHaveAttribute("href", "/components/usage-meter")
    })

    it("disables the arrows at either end of the list", () => {
      render(
        <Studio {...slots} examples={[]} prev={undefined} next={undefined} />
      )

      expect(
        screen.getByRole("button", { name: "Previous component" })
      ).toBeDisabled()
      expect(
        screen.getByRole("button", { name: "Next component" })
      ).toBeDisabled()
    })

    it("without a story, puts the examples on the canvas", () => {
      render(<BareStudio {...slots} />)

      expect(screen.getByText("overview demo")).toBeInTheDocument()
      expect(screen.getByText("loading demo")).toBeInTheDocument()
      // labelled, since there's more than one to tell apart
      expect(screen.getByText("Loading")).toBeInTheDocument()
    })

    it("does not label a lone example", () => {
      render(<BareStudio {...slots} examples={[slots.examples[0]!]} />)

      expect(screen.getByText("overview demo")).toBeInTheDocument()
      expect(screen.queryByText("Overview")).toBeNull()
    })
  })
})
