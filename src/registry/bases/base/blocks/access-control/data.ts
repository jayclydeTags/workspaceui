// ── Types ──────────────────────────────────────────────────────────────────

export type PermissionAction = "view" | "create" | "edit" | "delete"

export interface Role {
  id: string
  name: string
  description: string
  memberCount: number
  /** Shipped with the workspace. Built-in roles can be edited but not deleted. */
  builtIn: boolean
  /** Permissions can't change — duplicate the role to customize it. */
  locked?: boolean
}

export interface Resource {
  id: string
  name: string
  description: string
  group: string
}

/** role id → resource id → granted actions */
export type PermissionMatrix = Record<
  string,
  Record<string, PermissionAction[]>
>

// ── Reference data ─────────────────────────────────────────────────────────

export const PERMISSION_ACTIONS: PermissionAction[] = [
  "view",
  "create",
  "edit",
  "delete",
]

export const ACTION_LABEL: Record<PermissionAction, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
}

export const RESOURCES: Resource[] = [
  {
    id: "projects",
    name: "Projects",
    description: "Boards, tasks, and milestones",
    group: "Content",
  },
  {
    id: "documents",
    name: "Documents",
    description: "Shared files and docs",
    group: "Content",
  },
  {
    id: "invoices",
    name: "Invoices",
    description: "Customer billing records",
    group: "Finance",
  },
  {
    id: "billing",
    name: "Billing",
    description: "Plan and payment methods",
    group: "Finance",
  },
  {
    id: "members",
    name: "Members",
    description: "Invitations and member roles",
    group: "Administration",
  },
  {
    id: "api-keys",
    name: "API keys",
    description: "Tokens for integrations",
    group: "Administration",
  },
  {
    id: "settings",
    name: "Settings",
    description: "Workspace configuration",
    group: "Administration",
  },
]

export const RESOURCE_GROUPS = [...new Set(RESOURCES.map((r) => r.group))]

// ── Permission rules ───────────────────────────────────────────────────────

function sortActions(actions: Iterable<PermissionAction>) {
  const set = new Set(actions)
  return PERMISSION_ACTIONS.filter((action) => set.has(action))
}

/**
 * Grants or revokes one action. Every other action depends on `view`:
 * granting one also grants view, and revoking view revokes the rest.
 */
export function setAction(
  current: PermissionAction[],
  action: PermissionAction,
  granted: boolean
): PermissionAction[] {
  if (granted) return sortActions([...current, action, "view"])
  if (action === "view") return []
  return current.filter((a) => a !== action)
}

export function countChanges(
  saved: PermissionMatrix,
  draft: PermissionMatrix,
  roleIds: string[]
) {
  let changes = 0
  for (const roleId of roleIds) {
    for (const resource of RESOURCES) {
      const before = saved[roleId]?.[resource.id] ?? []
      const after = draft[roleId]?.[resource.id] ?? []
      for (const action of PERMISSION_ACTIONS) {
        if (before.includes(action) !== after.includes(action)) changes++
      }
    }
  }
  return changes
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const ROLES: Role[] = [
  {
    id: "owner",
    name: "Owner",
    description:
      "Full control over the workspace, including billing and deletion.",
    memberCount: 1,
    builtIn: true,
    locked: true,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manages settings, billing, and members.",
    memberCount: 3,
    builtIn: true,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Creates and edits content and invoices.",
    memberCount: 12,
    builtIn: true,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to content.",
    memberCount: 28,
    builtIn: true,
  },
]

const ALL = [...PERMISSION_ACTIONS]
const EDIT: PermissionAction[] = ["view", "create", "edit"]
const VIEW: PermissionAction[] = ["view"]

export const INITIAL_PERMISSIONS: PermissionMatrix = {
  owner: Object.fromEntries(RESOURCES.map((r) => [r.id, ALL])),
  admin: {
    projects: ALL,
    documents: ALL,
    invoices: ALL,
    billing: EDIT,
    members: ALL,
    "api-keys": ALL,
    settings: EDIT,
  },
  editor: {
    projects: EDIT,
    documents: EDIT,
    invoices: EDIT,
    billing: [],
    members: VIEW,
    "api-keys": [],
    settings: VIEW,
  },
  viewer: {
    projects: VIEW,
    documents: VIEW,
    invoices: [],
    billing: [],
    members: VIEW,
    "api-keys": [],
    settings: [],
  },
}
