import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  MoreHorizontalIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  emptyDraft,
  isValid,
  type Department,
  type DepartmentDraft,
} from "../data"

function StatusBadge({ status }: { status: Department["status"] }) {
  return (
    <Badge
      variant={status === "active" ? "secondary" : "outline"}
      className="capitalize"
    >
      {status}
    </Badge>
  )
}

/** Draft field inputs shared by the new-row and edit-row forms. */
function DraftFields({
  draft,
  onChange,
}: {
  draft: DepartmentDraft
  onChange: (changes: Partial<DepartmentDraft>) => void
}) {
  return (
    <>
      <Input
        aria-label="Name"
        value={draft.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="e.g. Engineering"
        className="h-8"
      />
      <Input
        aria-label="Code"
        value={draft.code}
        onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
        placeholder="e.g. ENG"
        className="h-8"
      />
      <Input
        aria-label="Manager"
        value={draft.manager}
        onChange={(e) => onChange({ manager: e.target.value })}
        placeholder="e.g. Sarah Chen"
        className="h-8"
      />
      <Select
        value={draft.status}
        onValueChange={(v) =>
          onChange({ status: (v as DepartmentDraft["status"]) ?? "active" })
        }
      >
        <SelectTrigger aria-label="Status" className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}

function SaveCancelActions({
  draft,
  onSave,
  onCancel,
}: {
  draft: DepartmentDraft
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Save"
        disabled={!isValid(draft)}
        onClick={onSave}
      >
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Cancel"
        onClick={onCancel}
      >
        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
      </Button>
    </div>
  )
}

export function DataTable({
  departments,
  isCreating,
  onCreate,
  onCancelCreate,
  onUpdate,
  onDelete,
}: {
  departments: Department[]
  isCreating: boolean
  onCreate: (draft: DepartmentDraft) => void
  onCancelCreate: () => void
  onUpdate: (id: string, draft: DepartmentDraft) => void
  onDelete: (dept: Department) => void
}) {
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [draft, setDraft] = React.useState<DepartmentDraft>(emptyDraft)
  const [newDraft, setNewDraft] = React.useState<DepartmentDraft>(emptyDraft)

  const anyRowEditing = isCreating || editingId !== null

  // Reset the new-row form each time create mode is (re)entered — diffed
  // during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect.
  const [seededCreating, setSeededCreating] = React.useState(false)
  if (isCreating !== seededCreating) {
    setSeededCreating(isCreating)
    if (isCreating) setNewDraft(emptyDraft())
  }

  function startEdit(dept: Department) {
    setEditingId(dept.id)
    setDraft({
      name: dept.name,
      code: dept.code,
      manager: dept.manager,
      status: dept.status,
    })
  }

  function saveEdit() {
    if (!editingId || !isValid(draft)) return
    onUpdate(editingId, draft)
    setEditingId(null)
  }

  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="hidden @md:table-cell">Manager</TableHead>
              <TableHead className="text-right">Headcount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isCreating && (
              <TableRow>
                <TableCell className="px-6">
                  <Input
                    aria-label="Name"
                    autoFocus
                    value={newDraft.name}
                    onChange={(e) =>
                      setNewDraft((d) => ({ ...d, name: e.target.value }))
                    }
                    placeholder="e.g. Engineering"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    aria-label="Code"
                    value={newDraft.code}
                    onChange={(e) =>
                      setNewDraft((d) => ({
                        ...d,
                        code: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="e.g. ENG"
                    className="h-8"
                  />
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  <Input
                    aria-label="Manager"
                    value={newDraft.manager}
                    onChange={(e) =>
                      setNewDraft((d) => ({ ...d, manager: e.target.value }))
                    }
                    placeholder="e.g. Sarah Chen"
                    className="h-8"
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  0
                </TableCell>
                <TableCell>
                  <Select
                    value={newDraft.status}
                    onValueChange={(v) =>
                      setNewDraft((d) => ({
                        ...d,
                        status: (v as DepartmentDraft["status"]) ?? "active",
                      }))
                    }
                  >
                    <SelectTrigger aria-label="Status" className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="pr-6">
                  <SaveCancelActions
                    draft={newDraft}
                    onSave={() => onCreate(newDraft)}
                    onCancel={onCancelCreate}
                  />
                </TableCell>
              </TableRow>
            )}
            {departments.map((dept) =>
              editingId === dept.id ? (
                <TableRow key={dept.id}>
                  <TableCell className="px-6">
                    <Input
                      aria-label="Name"
                      autoFocus
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, name: e.target.value }))
                      }
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      aria-label="Code"
                      value={draft.code}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell className="hidden @md:table-cell">
                    <Input
                      aria-label="Manager"
                      value={draft.manager}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, manager: e.target.value }))
                      }
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell className="text-right">{dept.headcount}</TableCell>
                  <TableCell>
                    <Select
                      value={draft.status}
                      onValueChange={(v) =>
                        setDraft((d) => ({
                          ...d,
                          status: (v as DepartmentDraft["status"]) ?? "active",
                        }))
                      }
                    >
                      <SelectTrigger aria-label="Status" className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="pr-6">
                    <SaveCancelActions
                      draft={draft}
                      onSave={saveEdit}
                      onCancel={() => setEditingId(null)}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={dept.id}>
                  <TableCell className="px-6 font-medium">
                    {dept.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{dept.code}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground @md:table-cell">
                    {dept.manager}
                  </TableCell>
                  <TableCell className="text-right">{dept.headcount}</TableCell>
                  <TableCell>
                    <StatusBadge status={dept.status} />
                  </TableCell>
                  <TableCell className="pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${dept.name}`}
                            disabled={anyRowEditing}
                          >
                            <HugeiconsIcon
                              icon={MoreHorizontalIcon}
                              strokeWidth={2}
                            />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEdit(dept)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete(dept)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {isCreating && (
          <li className="flex flex-col gap-2 px-4 py-3">
            <DraftFields
              draft={newDraft}
              onChange={(changes) => setNewDraft((d) => ({ ...d, ...changes }))}
            />
            <SaveCancelActions
              draft={newDraft}
              onSave={() => onCreate(newDraft)}
              onCancel={onCancelCreate}
            />
          </li>
        )}
        {departments.map((dept) =>
          editingId === dept.id ? (
            <li key={dept.id} className="flex flex-col gap-2 px-4 py-3">
              <DraftFields
                draft={draft}
                onChange={(changes) => setDraft((d) => ({ ...d, ...changes }))}
              />
              <SaveCancelActions
                draft={draft}
                onSave={saveEdit}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li key={dept.id} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {dept.name}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {dept.code}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {dept.manager} · {dept.headcount} people
                </p>
                <div className="mt-1.5">
                  <StatusBadge status={dept.status} />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${dept.name}`}
                      disabled={anyRowEditing}
                    >
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        strokeWidth={2}
                      />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startEdit(dept)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(dept)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          )
        )}
      </ul>
    </>
  )
}
