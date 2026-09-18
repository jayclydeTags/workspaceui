export interface CategoryGroup {
  title: string
  links: { label: string; href: string }[]
}

export interface Collection {
  title: string
  description: string
  href: string
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    title: "Women",
    links: [
      { label: "New arrivals", href: "#" },
      { label: "Dresses", href: "#" },
      { label: "Knitwear", href: "#" },
      { label: "Outerwear", href: "#" },
      { label: "Shoes", href: "#" },
    ],
  },
  {
    title: "Men",
    links: [
      { label: "New arrivals", href: "#" },
      { label: "Shirts", href: "#" },
      { label: "Trousers", href: "#" },
      { label: "Jackets", href: "#" },
      { label: "Accessories", href: "#" },
    ],
  },
]

export const COLLECTIONS: Collection[] = [
  {
    title: "Summer edit",
    description: "Light layers for long days.",
    href: "#",
  },
  {
    title: "Essentials",
    description: "The pieces you reach for most.",
    href: "#",
  },
]

export const LINKS = [
  { label: "Collections", href: "#" },
  { label: "Journal", href: "#" },
  { label: "Stores", href: "#" },
]

export const CART_COUNT = 2
