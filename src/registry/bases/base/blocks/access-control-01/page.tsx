import * as React from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  INITIAL_PERMISSIONS,
  ROLES,
  type PermissionAction,
  type PermissionMatrix,
  type Role,
} from "./data"
import { PermissionTable } from "./components/permission-table"

export function AccessControl01() {
  const [roles, setRoles] = React.useState<Role[]>(ROLES)
  const [roleId, setRoleId] = React.useState(ROLES[0].id)
  const [permissions, setPermissions] =
    React.useState<PermissionMatrix>(INITIAL_PERMISSIONS)
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  const activeRole = roles.find((r) => r.id === roleId) ?? roles[0]

  function toggle(resourceId: string, action: PermissionAction) {
    setPermissions((prev) => {
      const current = prev[roleId]?.[resourceId] ?? []
      const next = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action]
      return { ...prev, [roleId]: { ...prev[roleId], [resourceId]: next } }
    })
  }

  function addRole(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    const id = `${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
    setRoles((prev) => [
      ...prev,
      { id, name: trimmed, description, memberCount: 0 },
    ])
    setPermissions((prev) => ({ ...prev, [id]: {} }))
    setRoleId(id)
    setName("")
    setDescription("")
    setOpen(false)
  }

  return (
    <Page
      title="Access Control"
      subtitle="Manage role permissions across resources"
      className="@container overflow-hidden"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <PlusIcon data-icon="inline-start" />
                Add Role
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add role</DialogTitle>
            </DialogHeader>
            <form id="add-role-form" onSubmit={addRole}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="role-name">Name</FieldLabel>
                  <Input
                    id="role-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Billing Manager"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="role-description">
                    Description
                  </FieldLabel>
                  <Input
                    id="role-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What this role is for"
                  />
                </Field>
              </FieldGroup>
            </form>
            <DialogFooter>
              <Button type="submit" form="add-role-form">
                Add role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="flex h-full min-h-0 flex-col @sm:flex-row">
        {/* Role list */}
        <aside className="flex shrink-0 gap-1 overflow-x-auto border-b border-border p-2 @sm:w-56 @sm:flex-col @sm:gap-0 @sm:overflow-y-auto @sm:border-r @sm:border-b-0 @sm:p-0 @sm:py-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setRoleId(role.id)}
              className={cn(
                "flex shrink-0 flex-col items-start gap-0.5 rounded-md px-3 py-1.5 text-left text-sm whitespace-nowrap transition-colors hover:bg-muted @sm:w-full @sm:rounded-none @sm:px-4 @sm:py-2.5 @sm:whitespace-normal",
                role.id === roleId && "bg-muted"
              )}
            >
              <span className="font-medium">{role.name}</span>
              <span className="hidden text-xs text-muted-foreground @sm:inline">
                {role.memberCount} members
              </span>
            </button>
          ))}
        </aside>

        {/* Permission matrix */}
        <div className="min-w-0 flex-1 overflow-auto">
          <div className="flex items-center gap-2 px-4 py-4 @sm:px-6">
            <h2 className="text-sm font-semibold">{activeRole.name}</h2>
            <Badge variant="secondary">{activeRole.memberCount} members</Badge>
          </div>
          <p className="-mt-2 px-4 pb-4 text-sm text-muted-foreground @sm:px-6">
            {activeRole.description}
          </p>
          <PermissionTable
            permissions={permissions[roleId] ?? {}}
            onToggle={toggle}
          />
        </div>
      </div>
    </Page>
  )
}
