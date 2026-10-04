"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  Delete02Icon,
  LockIcon,
  MoreHorizontalIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  INITIAL_PERMISSIONS,
  PERMISSION_ACTIONS,
  RESOURCES,
  ROLES,
  countChanges,
  setAction,
  type PermissionAction,
  type PermissionMatrix,
  type Role,
} from "@/registry/bases/base/blocks/access-control/data"
import {
  AddRoleDialog,
  BLANK_ROLE,
  type NewRole,
} from "@/registry/bases/base/blocks/access-control/components/add-role-dialog"
import { PermissionTable } from "@/registry/bases/base/blocks/access-control/components/permission-table"

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

function sameGrants(a: PermissionAction[] = [], b: PermissionAction[] = []) {
  return a.length === b.length && a.every((action) => b.includes(action))
}

export function AccessControl({ className }: { className?: string }) {
  const [roles, setRoles] = React.useState<Role[]>(ROLES)
  const [roleId, setRoleId] = React.useState(ROLES[0].id)
  // Edits go to `draft`; `saved` is what's live. Save/Discard reconcile them.
  const [saved, setSaved] =
    React.useState<PermissionMatrix>(INITIAL_PERMISSIONS)
  const [draft, setDraft] =
    React.useState<PermissionMatrix>(INITIAL_PERMISSIONS)
  const [dialog, setDialog] = React.useState<{
    open: boolean
    initial?: Partial<NewRole>
  }>({ open: false })
  const [deleting, setDeleting] = React.useState<Role | null>(null)
  const [announcement, setAnnouncement] = React.useState("")

  const role = roles.find((r) => r.id === roleId) ?? roles[0]
  const grants = draft[role.id] ?? {}

  const editedRoles = roles.filter(
    (r) => countChanges(saved, draft, [r.id]) > 0
  )
  const changes = countChanges(
    saved,
    draft,
    roles.map((r) => r.id)
  )
  const affectedMembers = editedRoles.reduce((n, r) => n + r.memberCount, 0)
  const changedResources = new Set(
    RESOURCES.filter(
      (res) => !sameGrants(saved[role.id]?.[res.id], grants[res.id])
    ).map((res) => res.id)
  )

  function updateRole(
    update: (
      current: Record<string, PermissionAction[]>
    ) => Record<string, PermissionAction[]>
  ) {
    setDraft((prev) => ({ ...prev, [role.id]: update(prev[role.id] ?? {}) }))
  }

  function toggle(
    resourceId: string,
    action: PermissionAction,
    granted: boolean
  ) {
    updateRole((current) => ({
      ...current,
      [resourceId]: setAction(current[resourceId] ?? [], action, granted),
    }))
  }

  function toggleResource(resourceId: string, granted: boolean) {
    updateRole((current) => ({
      ...current,
      [resourceId]: granted ? [...PERMISSION_ACTIONS] : [],
    }))
  }

  function toggleAction(action: PermissionAction, granted: boolean) {
    updateRole((current) =>
      Object.fromEntries(
        RESOURCES.map((res) => [
          res.id,
          setAction(current[res.id] ?? [], action, granted),
        ])
      )
    )
  }

  function save() {
    setSaved(draft)
    setAnnouncement(`Saved ${plural(changes, "change")}.`)
  }

  function discard() {
    setDraft(saved)
    setAnnouncement("Changes discarded.")
  }

  function addRole({ name, description, baseRoleId }: NewRole) {
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`
    // Copy the base role's current draft so unsaved tweaks carry over.
    const base = baseRoleId === BLANK_ROLE ? {} : (draft[baseRoleId] ?? {})
    const copy = Object.fromEntries(
      Object.entries(base).map(([res, actions]) => [res, [...actions]])
    )
    setRoles((prev) => [
      ...prev,
      { id, name, description, memberCount: 0, builtIn: false },
    ])
    setSaved((prev) => ({ ...prev, [id]: copy }))
    setDraft((prev) => ({ ...prev, [id]: copy }))
    setRoleId(id)
    setDialog({ open: false })
    setAnnouncement(`Added role ${name}.`)
  }

  function duplicate(source: Role) {
    setDialog({
      open: true,
      initial: {
        name: `${source.name} copy`,
        description: source.description,
        baseRoleId: source.id,
      },
    })
  }

  function confirmDelete() {
    if (!deleting) return
    const remaining = roles.filter((r) => r.id !== deleting.id)
    setRoles(remaining)
    const drop = (prev: PermissionMatrix) => {
      const next = { ...prev }
      delete next[deleting.id]
      return next
    }
    setSaved(drop)
    setDraft(drop)
    if (roleId === deleting.id) setRoleId(remaining[0].id)
    setAnnouncement(`Deleted role ${deleting.name}.`)
    setDeleting(null)
  }

  return (
    <Page
      title="Access Control"
      subtitle="Decide what each role can see and change."
      className={cn("@container overflow-hidden", className)}
      actions={
        <Button size="sm" onClick={() => setDialog({ open: true })}>
          <HugeiconsIcon
            icon={PlusSignIcon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Add role
        </Button>
      }
    >
      <div className="flex h-full min-h-0 flex-col @2xl:flex-row">
        <nav
          aria-label="Roles"
          className="shrink-0 border-b @2xl:w-60 @2xl:overflow-y-auto @2xl:border-e @2xl:border-b-0"
        >
          <ul className="flex gap-1 overflow-x-auto p-2 @2xl:flex-col">
            {roles.map((r) => {
              const selected = r.id === role.id
              const edited = editedRoles.includes(r)
              return (
                <li key={r.id} className="shrink-0">
                  <button
                    type="button"
                    aria-current={selected || undefined}
                    onClick={() => setRoleId(r.id)}
                    className={cn(
                      "flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-start text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                      selected && "bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
                      {r.locked && (
                        <>
                          <HugeiconsIcon
                            icon={LockIcon}
                            strokeWidth={2}
                            className="size-3.5 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Locked:</span>
                        </>
                      )}
                      {r.name}
                      {edited && (
                        <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className="size-1.5 rounded-full bg-primary"
                          />
                          Edited
                        </span>
                      )}
                    </span>
                    <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                      {plural(r.memberCount, "member")}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <section
          aria-labelledby="role-heading"
          className="@container flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-auto">
            <header className="flex items-start justify-between gap-4 px-4 pt-4 pb-3 @xl:px-6">
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="role-heading" className="text-base font-semibold">
                    {role.name}
                  </h2>
                  <Badge variant="outline">
                    {role.builtIn ? "Built-in" : "Custom"}
                  </Badge>
                  <Badge variant="secondary">
                    <span className="tabular-nums">
                      {plural(role.memberCount, "member")}
                    </span>
                  </Badge>
                </div>
                {role.description && (
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`More actions for ${role.name}`}
                    >
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        strokeWidth={2}
                      />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => duplicate(role)}>
                      <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={role.builtIn}
                      onClick={() => setDeleting(role)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                      Delete role
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>

            <div className="px-4 pb-3 @xl:px-6">
              {role.locked ? (
                <Alert role="note">
                  <HugeiconsIcon icon={LockIcon} strokeWidth={2} />
                  <AlertTitle>{role.name} always has full access</AlertTitle>
                  <AlertDescription>
                    This role can’t be edited. Duplicate it to make a custom
                    role you can change.
                  </AlertDescription>
                  <AlertAction>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => duplicate(role)}
                    >
                      Duplicate
                    </Button>
                  </AlertAction>
                </Alert>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Create, edit, and delete include view access. Use the column
                  and “All” checkboxes to change many at once.
                </p>
              )}
            </div>

            <PermissionTable
              permissions={grants}
              changed={changedResources}
              disabled={role.locked}
              onToggle={toggle}
              onToggleResource={toggleResource}
              onToggleAction={toggleAction}
            />
          </div>

          {changes > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t bg-background px-4 py-3 @xl:px-6">
              <p className="me-auto text-sm">
                <span className="font-medium tabular-nums">
                  {plural(changes, "unsaved change")}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  in {editedRoles.map((r) => r.name).join(", ")} · affects{" "}
                  {plural(affectedMembers, "member")}
                </span>
              </p>
              <Button variant="outline" size="sm" onClick={discard}>
                Discard
              </Button>
              <Button size="sm" onClick={save}>
                Save changes
              </Button>
            </div>
          )}
          <p role="status" className="sr-only">
            {announcement}
          </p>
        </section>
      </div>

      <AddRoleDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        roles={roles}
        initial={dialog.initial}
        onSubmit={addRole}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && deleting.memberCount > 0
                ? `${plural(deleting.memberCount, "member")} will lose this role’s permissions. `
                : ""}
              This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
