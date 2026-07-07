import { PencilIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { EMPLOYEE, type FieldGroupData } from "./data"

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

function DetailGroup({ group }: { group: FieldGroupData }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        {group.title}
      </h3>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {group.fields.map((f) => (
          <DetailField key={f.label} label={f.label} value={f.value} />
        ))}
      </dl>
    </div>
  )
}

export function RecordDetail01() {
  const e = EMPLOYEE

  return (
    <Page
      title={e.name}
      subtitle={e.title}
      badge={
        <Badge
          variant={e.status === "active" ? "secondary" : "outline"}
          className="capitalize"
        >
          {e.status === "active" ? "Active" : "On leave"}
        </Badge>
      }
      hasPadding
      actions={
        <Button variant="outline" size="sm">
          <PencilIcon data-icon="inline-start" />
          Edit
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <Avatar className="size-12">
          <AvatarFallback>{initials(e.name)}</AvatarFallback>
        </Avatar>

        {e.groups.map((group, i) => (
          <div key={group.title} className="flex flex-col gap-6">
            <DetailGroup group={group} />
            {i < e.groups.length - 1 && <Separator />}
          </div>
        ))}

        <Separator />
        <p className="text-xs text-muted-foreground">Record ID: {e.id}</p>
      </div>
    </Page>
  )
}
