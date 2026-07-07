import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLES, STATUSES, type Filters } from "../data"

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
}) {
  const patch = (changes: Partial<Filters>) =>
    onChange({ ...filters, ...changes })

  const active =
    filters.query !== "" || filters.role !== "all" || filters.status !== "all"

  return (
    <div className="flex flex-wrap items-center gap-2">
      <InputGroup className="w-full sm:w-64">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search name or email…"
          value={filters.query}
          onChange={(e) => patch({ query: e.target.value })}
        />
      </InputGroup>

      <Select
        value={filters.role}
        onValueChange={(v) => patch({ role: v as Filters["role"] })}
      >
        <SelectTrigger className="w-auto min-w-32" aria-label="Filter by role">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          {ROLES.map((role) => (
            <SelectItem key={role} value={role} className="capitalize">
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(v) => patch({ status: v as Filters["status"] })}
      >
        <SelectTrigger className="w-auto min-w-32" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((status) => (
            <SelectItem key={status} value={status} className="capitalize">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {active && (
        <Button variant="ghost" size="sm" onClick={() => onChange({ query: "", role: "all", status: "all" })}>
          <XIcon data-icon="inline-start" />
          Clear
        </Button>
      )}
    </div>
  )
}
