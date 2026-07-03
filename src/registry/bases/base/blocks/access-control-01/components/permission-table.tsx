import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PERMISSION_ACTIONS, RESOURCES, type PermissionAction } from "../data"

export function PermissionTable({
  permissions,
  onToggle,
}: {
  permissions: Record<string, PermissionAction[]>
  onToggle: (resourceId: string, action: PermissionAction) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Resource</TableHead>
              {PERMISSION_ACTIONS.map((action) => (
                <TableHead key={action} className="text-center capitalize">
                  {action}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {RESOURCES.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="px-6">
                  <p className="font-medium">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {resource.description}
                  </p>
                </TableCell>
                {PERMISSION_ACTIONS.map((action) => (
                  <TableCell key={action} className="text-center">
                    <Checkbox
                      checked={
                        permissions[resource.id]?.includes(action) ?? false
                      }
                      onCheckedChange={() => onToggle(resource.id, action)}
                      aria-label={`${action} ${resource.name}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="divide-y divide-border @sm:hidden">
        {RESOURCES.map((resource) => (
          <li key={resource.id} className="px-4 py-3">
            <p className="text-sm font-medium">{resource.name}</p>
            <p className="text-xs text-muted-foreground">
              {resource.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {PERMISSION_ACTIONS.map((action) => (
                <label
                  key={action}
                  className="flex items-center gap-1.5 text-sm capitalize"
                >
                  <Checkbox
                    checked={
                      permissions[resource.id]?.includes(action) ?? false
                    }
                    onCheckedChange={() => onToggle(resource.id, action)}
                    aria-label={`${action} ${resource.name}`}
                  />
                  {action}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
