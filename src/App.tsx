import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { FumaProvider } from "@/lib/fumadocs-provider"

import { Header } from "@/components/header"
import { DocsLayout } from "@/layouts/docs-layout"
import { BlocksLayout } from "@/layouts/blocks-layout"
import { HomePage } from "@/pages/home"
import { DocPage } from "@/pages/docs/doc-page"
import { Dashboard01Page } from "@/pages/docs/blocks/dashboard-01"
import { ActivityLog01Page } from "@/pages/docs/blocks/activity-log-01"

export function App() {
  return (
    <BrowserRouter>
      <FumaProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<DocsLayout />}>
            <Route path="/docs/*" element={<DocPage />} />
          </Route>
          <Route element={<BlocksLayout />}>
            <Route path="/blocks" element={<Navigate to="/blocks/dashboard-01" replace />} />
            <Route path="/blocks/dashboard-01" element={<Dashboard01Page />} />
            <Route path="/blocks/activity-log-01" element={<ActivityLog01Page />} />
          </Route>
        </Routes>
      </FumaProvider>
    </BrowserRouter>
  )
}
