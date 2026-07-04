import { HomeLayout as FumaHomeLayout } from "fumadocs-ui/layouts/home"

import { WorkspaceUILogo } from "@/components/workspaceui-logo"

const links = [
  { text: "Docs", url: "/docs/getting-started/introduction", active: "nested-url" as const },
  { text: "Components", url: "/docs/components/workspace", active: "nested-url" as const },
  { text: "Blocks", url: "/blocks", active: "nested-url" as const },
]

// Shared top-nav chrome for the marketing home and the blocks browser
// (was duplicated in _home.tsx + blocks.tsx under react-router).
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <FumaHomeLayout
      links={links}
      githubUrl="https://github.com/jayclydeTags/workspaceui"
      nav={{ title: <WorkspaceUILogo className="h-5 w-auto" /> }}
    >
      {children}
    </FumaHomeLayout>
  )
}
