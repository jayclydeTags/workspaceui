import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ACTION_LABEL,
  PERMISSION_ACTIONS,
  RESOURCES,
  RESOURCE_GROUPS,
  type PermissionAction,
} from "@/registry/bases/base/blocks/access-control/data"

// Checkbox renders a span, so its `disabled:` styles never match; dim via data attr.
const LOCKED = "data-disabled:cursor-not-allowed data-disabled:opacity-50"

// The shared Checkbox only draws a tick, so a partial state swaps it for a dash.
const PARTIAL =
  LOCKED +
  " data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:before:h-0.5 data-indeterminate:before:w-2 data-indeterminate:before:rounded-full data-indeterminate:before:bg-primary-foreground data-indeterminate:before:content-[''] data-indeterminate:[&_svg]:hidden"

type Grants = Record<string, PermissionAction[]>

interface PermissionTableProps {
  permissions: Grants
  /** Resource ids whose grants differ from the saved state. */
  changed: Set<string>
  disabled?: boolean
  onToggle: (
    resourceId: string,
    action: PermissionAction,
    granted: boolean
  ) => void
  onToggleResource: (resourceId: string, granted: boolean) => void
  onToggleAction: (action: PermissionAction, granted: boolean) => void
}

function tri(count: number, total: number) {
  return {
    checked: count === total && total > 0,
    indeterminate: count > 0 && count < total,
  }
}

export function PermissionTable({
  permissions,
  changed,
  disabled,
  onToggle,
  onToggleResource,
  onToggleAction,
}: PermissionTableProps) {
  const has = (resourceId: string, action: PermissionAction) =>
    permissions[resourceId]?.includes(action) ?? false

  const rowState = (resourceId: string) =>
    tri(permissions[resourceId]?.length ?? 0, PERMISSION_ACTIONS.length)

  const columnState = (action: PermissionAction) =>
    tri(RESOURCES.filter((r) => has(r.id, action)).length, RESOURCES.length)

  return (
    <>
      {/* Matrix — wide pane (≥ @xl) */}
      <div className="hidden @xl:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="ps-6">Resource</TableHead>
              {PERMISSION_ACTIONS.map((action) => {
                const state = columnState(action)
                return (
                  <TableHead key={action} className="w-20 text-center">
                    <span className="inline-flex flex-col items-center gap-1.5">
                      {ACTION_LABEL[action]}
                      <Checkbox
                        {...state}
                        disabled={disabled}
                        className={PARTIAL}
                        aria-label={`${ACTION_LABEL[action]} on every resource`}
                        onCheckedChange={(granted) =>
                          onToggleAction(action, granted)
                        }
                      />
                    </span>
                  </TableHead>
                )
              })}
              <TableHead className="w-20 pe-6 text-center">
                <span className="inline-flex flex-col items-center gap-1.5">
                  All
                  <span className="size-4" aria-hidden="true" />
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RESOURCE_GROUPS.map((group) => (
              <React.Fragment key={group}>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead
                    colSpan={PERMISSION_ACTIONS.length + 2}
                    scope="colgroup"
                    className="h-8 ps-6 text-xs text-muted-foreground"
                  >
                    {group}
                  </TableHead>
                </TableRow>
                {RESOURCES.filter((r) => r.group === group).map((resource) => (
                  <TableRow
                    key={resource.id}
                    data-changed={changed.has(resource.id) || undefined}
                  >
                    <TableHead
                      scope="row"
                      className="h-auto py-2.5 ps-6 font-normal whitespace-normal"
                    >
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        {resource.name}
                        {changed.has(resource.id) && <EditedDot />}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {resource.description}
                      </span>
                    </TableHead>
                    {PERMISSION_ACTIONS.map((action) => (
                      <TableCell key={action} className="text-center">
                        <Checkbox
                          checked={has(resource.id, action)}
                          disabled={disabled}
                          aria-label={`${ACTION_LABEL[action]} ${resource.name}`}
                          onCheckedChange={(granted) =>
                            onToggle(resource.id, action, granted)
                          }
                          className={cn("mx-auto", LOCKED)}
                        />
                      </TableCell>
                    ))}
                    <TableCell className="pe-6 text-center">
                      <Checkbox
                        {...rowState(resource.id)}
                        disabled={disabled}
                        className={cn("mx-auto", PARTIAL)}
                        aria-label={`All permissions on ${resource.name}`}
                        onCheckedChange={(granted) =>
                          onToggleResource(resource.id, granted)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @xl) */}
      <div className="flex flex-col @xl:hidden">
        {RESOURCE_GROUPS.map((group) => (
          <section key={group} aria-label={group}>
            <h3 className="bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              {group}
            </h3>
            <ul className="divide-y">
              {RESOURCES.filter((r) => r.group === group).map((resource) => (
                <li key={resource.id} className="flex flex-col gap-2 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {resource.name}
                        {changed.has(resource.id) && <EditedDot />}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {resource.description}
                      </span>
                    </div>
                    <label className="flex shrink-0 items-center gap-2 text-sm">
                      <Checkbox
                        {...rowState(resource.id)}
                        disabled={disabled}
                        className={PARTIAL}
                        onCheckedChange={(granted) =>
                          onToggleResource(resource.id, granted)
                        }
                      />
                      All
                      <span className="sr-only">
                        {" "}
                        permissions on {resource.name}
                      </span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {PERMISSION_ACTIONS.map((action) => (
                      <label
                        key={action}
                        className="flex min-h-6 items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={has(resource.id, action)}
                          disabled={disabled}
                          className={LOCKED}
                          onCheckedChange={(granted) =>
                            onToggle(resource.id, action, granted)
                          }
                        />
                        {ACTION_LABEL[action]}
                        <span className="sr-only"> {resource.name}</span>
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}

function EditedDot() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
      Edited
    </span>
  )
}
