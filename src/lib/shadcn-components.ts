// The shadcn/ui primitives this site has installed (src/components/ui), shown on
// /components next to WorkspaceUI's own. Pure data — no `source` — so tests can
// check it against the ui directory.
//
// Descriptions are short summaries of what each primitive is for; the full API
// lives on ui.shadcn.com, which every page links to.
export interface ShadcnComponent {
  slug: string
  title: string
  description: string
}

export const SHADCN_COMPONENTS: ShadcnComponent[] = [
  {
    slug: "accordion",
    title: "Accordion",
    description:
      "A vertically stacked set of headings that each reveal a section of content.",
  },
  {
    slug: "alert",
    title: "Alert",
    description: "Displays a callout for user attention.",
  },
  {
    slug: "alert-dialog",
    title: "Alert Dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    slug: "attachment",
    title: "Attachment",
    description:
      "A file or media chip with a preview, upload status, and actions.",
  },
  {
    slug: "avatar",
    title: "Avatar",
    description: "An image element with a fallback for representing a user.",
  },
  {
    slug: "badge",
    title: "Badge",
    description: "Displays a badge or a component that looks like a badge.",
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    description:
      "Displays the path to the current resource using a hierarchy of links.",
  },
  {
    slug: "button",
    title: "Button",
    description: "Displays a button or a component that looks like a button.",
  },
  {
    slug: "button-group",
    title: "Button Group",
    description:
      "A container that groups related buttons together with consistent styling.",
  },
  {
    slug: "card",
    title: "Card",
    description: "Displays a card with a header, content, and a footer.",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description:
      "A control that allows the user to toggle between checked and not checked.",
  },
  {
    slug: "collapsible",
    title: "Collapsible",
    description:
      "An interactive component which expands and collapses a panel.",
  },
  {
    slug: "command",
    title: "Command",
    description:
      "A command menu with search, grouping, and keyboard navigation.",
  },
  {
    slug: "dialog",
    title: "Dialog",
    description:
      "A window overlaid on the primary window, rendering the content underneath inert.",
  },
  {
    slug: "drawer",
    title: "Drawer",
    description: "A panel that slides in from the edge of the screen.",
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    description:
      "Displays a menu of actions or functions, triggered by a button.",
  },
  {
    slug: "empty",
    title: "Empty",
    description: "Displays an empty state with an icon, message, and actions.",
  },
  {
    slug: "field",
    title: "Field",
    description:
      "Combines labels, controls, and help text to compose accessible form fields.",
  },
  {
    slug: "input",
    title: "Input",
    description: "A form input field.",
  },
  {
    slug: "input-group",
    title: "Input Group",
    description: "Adds addons, buttons, and helper content to inputs.",
  },
  {
    slug: "input-otp",
    title: "Input OTP",
    description: "An accessible one-time password input with paste support.",
  },
  {
    slug: "item",
    title: "Item",
    description:
      "A flexible row for lists, with media, title, description, and actions.",
  },
  {
    slug: "kbd",
    title: "Kbd",
    description: "Displays textual keyboard input, such as a shortcut.",
  },
  {
    slug: "label",
    title: "Label",
    description: "Renders an accessible label associated with a control.",
  },
  {
    slug: "navigation-menu",
    title: "Navigation Menu",
    description: "A collection of links and menus for navigating a site.",
  },
  {
    slug: "pagination",
    title: "Pagination",
    description: "Page navigation with next and previous links.",
  },
  {
    slug: "popover",
    title: "Popover",
    description: "Displays rich content in a portal, triggered by a button.",
  },
  {
    slug: "progress",
    title: "Progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
  },
  {
    slug: "resizable",
    title: "Resizable",
    description:
      "Accessible resizable panel groups and layouts with keyboard support.",
  },
  {
    slug: "select",
    title: "Select",
    description:
      "Displays a list of options for the user to pick from, triggered by a button.",
  },
  {
    slug: "separator",
    title: "Separator",
    description: "Visually or semantically separates content.",
  },
  {
    slug: "sheet",
    title: "Sheet",
    description:
      "Extends the dialog to display content that complements the main screen.",
  },
  {
    slug: "sidebar",
    title: "Sidebar",
    description: "A composable, themeable sidebar.",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    description: "A placeholder shown while content is loading.",
  },
  {
    slug: "spinner",
    title: "Spinner",
    description: "An indicator that shows a loading state.",
  },
  {
    slug: "table",
    title: "Table",
    description: "A responsive table.",
  },
  {
    slug: "tabs",
    title: "Tabs",
    description: "A set of layered sections of content, shown one at a time.",
  },
  {
    slug: "textarea",
    title: "Textarea",
    description: "A multi-line text input.",
  },
  {
    slug: "toggle",
    title: "Toggle",
    description: "A two-state button that can be either on or off.",
  },
  {
    slug: "toggle-group",
    title: "Toggle Group",
    description: "A set of two-state buttons that can be toggled on or off.",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description:
      "A popup that shows information about an element on hover or focus.",
  },
]

export const shadcnDocsUrl = (slug: string) =>
  `https://ui.shadcn.com/docs/components/base/${slug}`

export const shadcnInstallCommand = (slug: string) =>
  `npx shadcn@latest add ${slug}`

export const getShadcnComponent = (slug: string) =>
  SHADCN_COMPONENTS.find((component) => component.slug === slug)
