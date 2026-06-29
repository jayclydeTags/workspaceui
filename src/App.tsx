import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Header } from "@/components/header"
import { DocsLayout } from "@/layouts/docs-layout"
import { HomePage } from "@/pages/home"
import { IntroductionPage } from "@/pages/docs/getting-started/introduction"
import { InstallationPage } from "@/pages/docs/getting-started/installation"
import { WorkspaceTabsPage } from "@/pages/docs/components/workspace-tabs"
import { WorkspacePanelPage } from "@/pages/docs/components/workspace-panel"
import { WorkspacePage } from "@/pages/docs/components/workspace"
import { BlocksPage } from "@/pages/docs/blocks"
import { DashboardWithSidebarPage } from "@/pages/docs/blocks/dashboard-with-sidebar"

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<DocsLayout />}>
          <Route
            path="/docs/getting-started/introduction"
            element={<IntroductionPage />}
          />
          <Route
            path="/docs/getting-started/installation"
            element={<InstallationPage />}
          />
          <Route
            path="/docs/components/workspace-tabs"
            element={<WorkspaceTabsPage />}
          />
          <Route
            path="/docs/components/workspace-panel"
            element={<WorkspacePanelPage />}
          />
          <Route
            path="/docs/components/workspace"
            element={<WorkspacePage />}
          />
          <Route path="/docs/blocks" element={<BlocksPage />} />
        </Route>
        {/* Block detail pages use full-width layout (no docs sidebar) */}
        <Route
          path="/docs/blocks/dashboard-with-sidebar"
          element={<DashboardWithSidebarPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}
