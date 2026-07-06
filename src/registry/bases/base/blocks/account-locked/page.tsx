"use client"

import { useEffect, useState } from "react"
import { Clock, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: fixed 14-min lockout; wire to the real unlock timestamp when integrated.
const LOCKOUT_SECONDS = 14 * 60
const EMAIL = "alex@acme.com"

function formatRemaining(total: number) {
  const minutes = Math.ceil(total / 60)
  return `Try again in ${minutes} minute${minutes === 1 ? "" : "s"}`
}

export function AccountLocked() {
  const [remaining, setRemaining] = useState(LOCKOUT_SECONDS)
  const unlocked = remaining <= 0

  useEffect(() => {
    if (unlocked) return
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [unlocked])

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="size-5 text-destructive" />
          </div>

          <h1 className="mt-4 text-sm font-medium">Account locked</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Too many failed sign-in attempts
          </p>

          <Card size="sm" className="mt-4 w-full bg-muted/50">
            <CardContent className="flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                {EMAIL}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5 shrink-0" />
                {unlocked ? "You can sign in again now" : formatRemaining(remaining)}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex w-full flex-col gap-2">
            {unlocked ? (
              <Button className="w-full">Return to sign in</Button>
            ) : (
              <Button variant="outline" className="w-full">
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
