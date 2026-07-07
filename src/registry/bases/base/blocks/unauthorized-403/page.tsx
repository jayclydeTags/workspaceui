"use client"

import { useState } from "react"
import { ArrowLeft, MailCheck, ShieldX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: static demo — "Request access" just flips to the sent state. Wire it
// to the real access-request endpoint and pass the actual resource name in when
// integrated.
const RESOURCE = "Billing settings"

export function Unauthorized403() {
  const [requested, setRequested] = useState(false)

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="size-5 text-destructive" />
          </div>

          <h1 className="mt-4 text-sm font-medium" role="alert">
            You don&apos;t have access
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Your account isn&apos;t permitted to view{" "}
            <span className="font-medium text-foreground">{RESOURCE}</span>. Ask an
            admin for access or head back.
          </p>

          <Card size="sm" className="mt-4 w-full bg-muted/50">
            <CardContent className="text-left text-xs text-muted-foreground">
              Error 403 — Forbidden. If you think this is a mistake, contact your
              workspace administrator.
            </CardContent>
          </Card>

          <div className="mt-6 flex w-full flex-col gap-2" aria-live="polite">
            {requested ? (
              <div className="flex items-center justify-center gap-2 rounded-md border border-dashed py-2 text-xs text-muted-foreground">
                <MailCheck className="size-3.5 shrink-0 text-foreground" />
                Access request sent to your admin
              </div>
            ) : (
              <Button className="w-full" onClick={() => setRequested(true)}>
                Request access
              </Button>
            )}
            <Button variant="ghost" className="w-full text-muted-foreground">
              <ArrowLeft data-icon="inline-start" />
              Back to dashboard
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}
