import registry from "../../registry.json"
import { copyBlocks } from "@/lib/copy-blocks"
import type { NavSection } from "@/lib/nav"

// Families are this site's information architecture, not registry data:
// registry.json carries a flat category per block, while the grouping into
// families, the order categories appear in, and "announced but not shipped"
// are ours. Everything else — a block's title and which category it belongs
// to — is read from registry.json (or, for copy-only blocks, lib/copy-blocks)
// so there's one copy of it.
//
// Block order within a category follows registry.json's item order, then the
// copy-only manifest's.
//
// Server-only: this pulls in the ~90KB manifest, so routes that need the tree
// in a client component build it here and pass it down (see the root layout).
interface BlockFamily {
  title: string
  comingSoon?: boolean
  categories: string[]
}

const FAMILIES: BlockFamily[] = [
  {
    title: "Application UI",
    categories: [
      "Forms & Wizards",
      "Dialogs",
      "Detail Views",
      "Boards, Grids & Timelines",
      "Feeds & Notifications",
      "Multi-step Workflows",
      "App Shells",
      "Settings & Permissions",
      "Login",
      "Registration",
      "Password",
      "Two-Factor & OTP",
      "Access",
    ],
  },
  {
    title: "Marketing",
    categories: [
      "Navbars",
      "Hero Sections",
      "Feature Sections",
      "Pricing",
      "Testimonials",
      "Footers",
    ],
  },
  {
    title: "Ecommerce",
    comingSoon: true,
    categories: ["Product Lists", "Product Headers", "Category Filters"],
  },
]

const blocks = [
  ...registry.items
    .filter((item) => item.type === "registry:block")
    .map((item) => ({
      slug: item.name,
      title: item.title,
      category: "categories" in item ? (item.categories?.[0] ?? "") : "",
    })),
  ...copyBlocks.map(({ slug, title, category }) => ({ slug, title, category })),
]

/** Categories that actually have blocks, in family then category order. */
export function getBlockGroups() {
  return FAMILIES.flatMap((family) =>
    family.categories.map((category) => ({
      category,
      items: blocks.filter((block) => block.category === category),
    }))
  ).filter((group) => group.items.length > 0)
}

/**
 * family → category → block, for the blocks sidebar. Coming-soon families list
 * every category as an announcement; shipped ones list only categories that
 * have blocks, so a partly-built family doesn't show empty headings.
 */
export function getBlocksNav(): NavSection[] {
  return FAMILIES.map((family) => ({
    title: family.title,
    comingSoon: family.comingSoon,
    groups: family.categories
      .map((category) => ({
        title: category,
        items: blocks
          .filter((block) => block.category === category)
          .map((block) => ({
            title: block.title,
            href: `/blocks/${block.slug}`,
          })),
      }))
      .filter((group) => family.comingSoon || group.items.length > 0),
  }))
}

/** Title for one block, or undefined when the slug isn't a known block. */
export function getBlockTitle(slug: string) {
  return blocks.find((block) => block.slug === slug)?.title
}
