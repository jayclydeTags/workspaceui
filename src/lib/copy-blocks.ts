// Copy-only blocks: shown in the /blocks gallery with Preview and Code tabs,
// but deliberately not published in registry.json — there's no `npx shadcn
// add` for them; consumers copy the source from the Code tab. Metadata only
// (no components) so server code can read it; the component map lives in
// lib/blocks.ts beside the registry one.
export const COPY_BLOCKS_DIR = "src/blocks"

export interface CopyBlock {
  slug: string
  title: string
  description: string
  category: string
  /** Source files relative to the block's folder, in Code-tab order. */
  files: string[]
}

const navbar = (
  slug: string,
  title: string,
  description: string,
  files = ["navbar.tsx"]
): CopyBlock => ({ slug, title, description, category: "Navbars", files })

export const copyBlocks: CopyBlock[] = [
  navbar(
    "navbar-01",
    "Links right",
    "Logo left, links and a dropdown on the right, with log in and sign up buttons."
  ),
  navbar(
    "navbar-02",
    "Centered links",
    "Logo left, links centered in the bar, and a single call to action."
  ),
  navbar(
    "navbar-03",
    "Centered logo",
    "Links on the left, the logo centered, and an action on the right."
  ),
  navbar(
    "navbar-04",
    "Menu button",
    "Logo and call to action, with every link in a slide-out menu at all widths."
  ),
  navbar(
    "navbar-05",
    "Floating pill",
    "A rounded bar that floats over the page and stays pinned while scrolling."
  ),
  navbar(
    "navbar-06",
    "Mega menu with posts",
    "A wide product menu with grouped links and featured blog posts.",
    ["navbar.tsx", "data.ts"]
  ),
  navbar(
    "navbar-07",
    "Mega menu with footer",
    "Three columns of grouped links above a call-to-action footer strip.",
    ["navbar.tsx", "data.ts"]
  ),
  navbar(
    "navbar-08",
    "Dropdown panels",
    "Compact panels under each trigger — a single list and a two-column menu.",
    ["navbar.tsx", "data.ts"]
  ),
  navbar(
    "navbar-09",
    "Store mega menu",
    "Shop categories and collection cards, with search and a cart count.",
    ["navbar.tsx", "data.ts"]
  ),
  navbar(
    "navbar-10",
    "Full-screen menu",
    "A full-screen overlay with oversized links, contact, and social icons."
  ),
  navbar(
    "navbar-11",
    "Full-screen split menu",
    "Full-screen links beside a panel with a newsletter form and contact details."
  ),
  navbar(
    "navbar-12",
    "Side drawer",
    "A wide drawer with large links and contact details at the foot."
  ),
]

export function getCopyBlock(slug: string) {
  return copyBlocks.find((block) => block.slug === slug)
}
