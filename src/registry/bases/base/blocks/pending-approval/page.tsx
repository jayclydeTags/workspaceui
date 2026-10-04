"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, Mail01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: static status screen — swap the email and wire "Check status" /
// "Sign out" to the real endpoints when integrated.
const EMAIL = "alex@acme.com"

export function PendingApproval() {
  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-warning/10">
            <HugeiconsIcon
              icon={Clock01Icon}
              strokeWidth={2}
              className="size-5 text-warning"
            />
          </div>

          <h1 className="mt-4 text-sm font-medium" role="status">
            Awaiting approval
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Your account is under review. An administrator will approve access
            shortly — this usually takes less than a day.
          </p>

          <Card size="sm" className="mt-4 w-full bg-muted/50">
            <CardContent className="flex items-center gap-2 text-left text-xs text-muted-foreground">
              <HugeiconsIcon
                icon={Mail01Icon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
              We&apos;ll email{" "}
              <span className="font-medium text-foreground">{EMAIL}</span> once
              you&apos;re approved
            </CardContent>
          </Card>

          <div className="mt-6 flex w-full flex-col gap-2">
            <Button variant="outline" className="w-full">
              Check status
            </Button>
            <Button variant="ghost" className="w-full">
              <span className="text-muted-foreground group-hover/button:text-foreground">
                Sign out
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}
