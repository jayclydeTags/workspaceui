import type * as PageTree from "fumadocs-core/page-tree"

export const pageTree: PageTree.Root = {
  name: "Documentation",
  children: [
    {
      type: "folder",
      name: "Getting Started",
      defaultOpen: true,
      children: [
        { type: "page", name: "Introduction", url: "/docs/getting-started/introduction" },
        { type: "page", name: "Installation", url: "/docs/getting-started/installation" },
      ],
    },
    {
      type: "folder",
      name: "Components",
      defaultOpen: true,
      children: [
        { type: "page", name: "Workspace", url: "/docs/components/workspace" },
        { type: "page", name: "Page", url: "/docs/components/page" },
      ],
    },
  ],
}
