"use client"

import { useState } from "react"
import { Ban, LifeBuoy, MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: static demo — "Appeal" flips to the sent state. Wire the appeal and
// support actions and pass the real suspension reason in when integrated.
const REASON = "Terms of Service violation"

export function AccountSuspended() {
  const [appealed, setAppealed] = useState(false)

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
            <Ban className="size-5 text-destructive" />
          </div>

          <h1 className="mt-4 text-sm font-medium" role="alert">
            Account suspended
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Access to this account has been suspended and you&apos;ve been signed
            out. Contact support if you believe this was in error.
          </p>

          <Card size="sm" className="mt-4 w-full bg-muted/50">
            <CardContent className="text-left text-xs text-muted-foreground">
              Reason:{" "}
              <span className="font-medium text-foreground">{REASON}</span>
            </CardContent>
          </Card>

          <div className="mt-6 flex w-full flex-col gap-2" aria-live="polite">
            {appealed ? (
              <div className="flex items-center justify-center gap-2 rounded-md border border-dashed py-2 text-xs text-muted-foreground">
                <MailCheck className="size-3.5 shrink-0 text-foreground" />
                Appeal submitted — we&apos;ll be in touch
              </div>
            ) : (
              <Button className="w-full" onClick={() => setAppealed(true)}>
                Appeal suspension
              </Button>
            )}
            <Button variant="ghost" className="w-full text-muted-foreground">
              <LifeBuoy data-icon="inline-start" />
              Contact support
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}
