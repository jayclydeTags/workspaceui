"use client"

import { Building2, ChevronRight, ShieldX } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: static demo data — swap the blocked workspace and the switch list for
// the caller's real memberships and wire the row/sign-out actions when integrated.
const BLOCKED = "Globex Corp"
const WORKSPACES = [
  { id: "acme", name: "Acme Inc", role: "Owner" },
  { id: "hooli", name: "Hooli", role: "Member" },
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export function ForbiddenWorkspace() {
  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="size-5 text-destructive" />
          </div>

          <h1 className="mt-4 text-sm font-medium" role="alert">
            You&apos;re not a member of {BLOCKED}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Your account doesn&apos;t have access to this workspace. Switch to one
            you belong to, or ask an admin to invite you.
          </p>

          <Card size="sm" className="mt-4 w-full">
            <CardContent className="flex flex-col gap-1 p-1.5">
              {WORKSPACES.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
                >
                  <Avatar className="size-8 rounded-md">
                    <AvatarFallback className="rounded-md text-xs">
                      {initials(ws.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ws.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{ws.role}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="mt-4 flex w-full flex-col gap-2">
            <Button variant="outline" className="w-full">
              <Building2 data-icon="inline-start" />
              Request access to {BLOCKED}
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground">
              Sign in with a different account
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}
