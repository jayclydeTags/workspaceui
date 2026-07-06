"use client"

import { useEffect, useState } from "react"
import { Clock, Lock, Mail, MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: fixed 14-min lockout anchored to a timestamp so the countdown stays
// accurate across tab-backgrounding; wire to the real unlock time when integrated.
const LOCKOUT_MS = 14 * 60 * 1000
const EMAIL = "alex@acme.com"

function formatClock(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function AccountLocked() {
  const [unlockAt] = useState(() => Date.now() + LOCKOUT_MS)
  const [now, setNow] = useState(() => Date.now())
  const [resetSent, setResetSent] = useState(false)

  const remaining = unlockAt - now
  const unlocked = remaining <= 0

  useEffect(() => {
    if (unlocked) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [unlocked])

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="size-5 text-destructive" />
          </div>

          <h1 className="mt-4 text-sm font-medium" role="alert">
            Account locked
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Too many failed sign-in attempts
          </p>

          <Card size="sm" className="mt-4 w-full bg-muted/50">
            <CardContent className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                {EMAIL}
              </div>
              <div
                className="flex items-center gap-2 text-xs text-muted-foreground"
                aria-live="polite"
              >
                <Clock className="size-3.5 shrink-0" />
                {unlocked ? (
                  "You can sign in again now"
                ) : (
                  <span>
                    Try again in{" "}
                    <span className="font-medium tabular-nums text-foreground">
                      {formatClock(remaining)}
                    </span>
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex w-full flex-col gap-2" aria-live="polite">
            {unlocked ? (
              <Button className="w-full">Return to sign in</Button>
            ) : resetSent ? (
              <div className="flex items-center justify-center gap-2 rounded-md border border-dashed py-2 text-xs text-muted-foreground">
                <MailCheck className="size-3.5 shrink-0 text-foreground" />
                Reset link sent to {EMAIL}
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setResetSent(true)}
              >
                Reset password
              </Button>
            )}
            <Button variant="ghost" className="w-full text-muted-foreground">
              Contact support
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}
