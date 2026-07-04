// Source-file manifest for each block's Code tab. `src` is the path (relative
// to the block's registry dir) read at build time via fs; `path` is the display
// path shown in the file tree. Replaces the per-route `?raw` imports (Turbopack
// doesn't support `?raw`) that lived in the old src/app/routes/blocks.*.tsx.
export interface BlockFileRef {
  name: string
  path: string
  src: string
}

export const blockFiles: Record<string, BlockFileRef[]> = {
  "dashboard-01": [
    { name: "page.tsx", path: "app/dashboard/page.tsx", src: "page.tsx" },
    {
      name: "app-sidebar.tsx",
      path: "components/blocks/dashboard-01/components/app-sidebar.tsx",
      src: "components/app-sidebar.tsx",
    },
    {
      name: "dashboard-content.tsx",
      path: "components/blocks/dashboard-01/components/dashboard-content.tsx",
      src: "components/dashboard-content.tsx",
    },
  ],
  "activity-log-01": [
    { name: "page.tsx", path: "app/activity-log/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/activity-log/data.ts", src: "data.ts" },
    {
      name: "data-table.tsx",
      path: "components/blocks/activity-log-01/components/data-table.tsx",
      src: "components/data-table.tsx",
    },
  ],
  "activity-feed-01": [
    { name: "page.tsx", path: "app/activity-feed/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/activity-feed/data.ts", src: "data.ts" },
  ],
  "access-control-01": [
    { name: "page.tsx", path: "app/access-control/page.tsx", src: "page.tsx" },
    { name: "data.ts", path: "app/access-control/data.ts", src: "data.ts" },
    {
      name: "permission-table.tsx",
      path: "components/blocks/access-control-01/components/permission-table.tsx",
      src: "components/permission-table.tsx",
    },
  ],
}
