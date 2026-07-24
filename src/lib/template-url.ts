// The detail-page path is derived from the slug, never stored — avoids drift.
// Kept fs-free (separate from templates.ts, which reads manifests with `fs`) so
// `"use client"` components like the gallery can import this pure helper without
// dragging Node's `fs` into the browser bundle.
export function templateUrl(slug: string): string {
  return `/templates/${slug}`
}
