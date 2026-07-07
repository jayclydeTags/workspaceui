// ── Types ──────────────────────────────────────────────────────────────────

export type PermissionAction = "view" | "create" | "edit" | "delete"

export interface Role {
  id: string
  name: string
  description: string
  memberCount: number
}

export interface Resource {
  id: string
  name: string
  description: string
}

export type PermissionMatrix = Record<
  string,
  Record<string, PermissionAction[]>
>

// ── Mock data ──────────────────────────────────────────────────────────────

export const PERMISSION_ACTIONS: PermissionAction[] = [
  "view",
  "create",
  "edit",
  "delete",
]

export const ROLES: Role[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full control over the workspace",
    memberCount: 1,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manages settings, billing, and members",
    memberCount: 3,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Creates and edits most resources",
    memberCount: 12,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access",
    memberCount: 28,
  },
]

export const RESOURCES: Resource[] = [
  { id: "projects", name: "Projects", description: "Project boards and tasks" },
  { id: "documents", name: "Documents", description: "Shared files and docs" },
  { id: "invoices", name: "Invoices", description: "Billing records" },
  { id: "users", name: "Users", description: "Team member accounts" },
  { id: "settings", name: "Settings", description: "Workspace configuration" },
]

export const INITIAL_PERMISSIONS: PermissionMatrix = {
  owner: Object.fromEntries(
    RESOURCES.map((r) => [r.id, [...PERMISSION_ACTIONS]])
  ),
  admin: Object.fromEntries(
    RESOURCES.map((r) => [
      r.id,
      r.id === "settings"
        ? PERMISSION_ACTIONS.filter((a) => a !== "delete")
        : [...PERMISSION_ACTIONS],
    ])
  ),
  editor: Object.fromEntries(
    RESOURCES.map((r) => [
      r.id,
      r.id === "users" || r.id === "settings"
        ? ["view"]
        : (["view", "create", "edit"] as PermissionAction[]),
    ])
  ),
  viewer: Object.fromEntries(
    RESOURCES.map((r) => [r.id, ["view"] as PermissionAction[]])
  ),
}
