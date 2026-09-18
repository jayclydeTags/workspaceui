// Blocks the /create canvas can show, in switcher order. Slugs must exist in
// registry.json and lib/blocks.ts (checked by create-previews.test.ts).
export const CREATE_PREVIEWS = [
  { slug: "dashboard-01", label: "Dashboard" },
  { slug: "dashboard-shell", label: "App shell" },
  { slug: "task-board", label: "Task board" },
  { slug: "inbound-receiving", label: "Receiving" },
  { slug: "settings", label: "Settings" },
  { slug: "login", label: "Login" },
] as const

export type CreatePreviewSlug = (typeof CREATE_PREVIEWS)[number]["slug"]

/** postMessage type the canvas uses to push a theme into its preview iframe. */
export const CREATE_THEME_MESSAGE = "workspaceui:create-theme"
/** postMessage type the iframe sends once it's listening, so no theme is lost. */
export const CREATE_PREVIEW_READY = "workspaceui:create-preview-ready"
