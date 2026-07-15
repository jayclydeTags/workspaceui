// Detail-page and download paths are derived from the slug, never stored —
// avoids drift. Kept fs-free (separate from templates.ts, which reads manifests
// with `fs`) so `"use client"` components like the gallery can import these
// pure helpers without dragging Node's `fs` into the browser bundle.
export function templateUrl(slug: string): string {
  return `/templates/${slug}`
}

export function templateZipPath(slug: string): string {
  return `/templates/${slug}.zip`
}
