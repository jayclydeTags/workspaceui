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
        { type: "page", name: "Workspace Tabs", url: "/docs/components/workspace-tabs" },
        { type: "page", name: "Workspace Panel", url: "/docs/components/workspace-panel" },
        { type: "page", name: "Workspace", url: "/docs/components/workspace" },
      ],
    },
  ],
}
