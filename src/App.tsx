import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import { Header } from "@/components/header"
import { DocsLayout } from "@/layouts/docs-layout"
import { BlocksLayout } from "@/layouts/blocks-layout"
import { HomePage } from "@/pages/home"
import { IntroductionPage } from "@/pages/docs/getting-started/introduction"
import { InstallationPage } from "@/pages/docs/getting-started/installation"
import { WorkspaceTabsPage } from "@/pages/docs/components/workspace-tabs"
import { WorkspacePanelPage } from "@/pages/docs/components/workspace-panel"
import { WorkspacePage } from "@/pages/docs/components/workspace"
import { Dashboard01Page } from "@/pages/docs/blocks/dashboard-01"
import { ActivityLog01Page } from "@/pages/docs/blocks/activity-log-01"

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
        </Route>
        <Route element={<BlocksLayout />}>
          <Route path="/blocks" element={<Navigate to="/blocks/dashboard-01" replace />} />
          <Route path="/blocks/dashboard-01" element={<Dashboard01Page />} />
          <Route path="/blocks/activity-log-01" element={<ActivityLog01Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
