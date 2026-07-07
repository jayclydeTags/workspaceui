"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: static demo — "Resend" just restarts the cooldown. Wire it to the
// real magic-link request and pass the actual email in when integrated; keep
// the resend cooldown so users can't spam the endpoint.
const EMAIL = "alex@acme.com"
const RESEND_MS = 30 * 1000

export function MagicLinkSent() {
  const [resendAt, setResendAt] = useState(() => Date.now() + RESEND_MS)
  const [now, setNow] = useState(() => Date.now())

  const remaining = Math.max(0, resendAt - now)
  const canResend = remaining <= 0

  useEffect(() => {
    if (canResend) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [canResend])

  function resend() {
    setResendAt(Date.now() + RESEND_MS)
    setNow(Date.now())
  }

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="size-5 text-primary" />
          </div>

          <h1 className="mt-4 text-sm font-medium">Check your email</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            We sent a magic sign-in link to{" "}
            <span className="font-medium text-foreground">{EMAIL}</span>. Click it
            to sign in — the link expires in 10 minutes.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2" aria-live="polite">
            <Button className="w-full" disabled={!canResend} onClick={resend}>
              {canResend ? (
                "Resend link"
              ) : (
                <>
                  Resend in{" "}
                  <span className="font-medium tabular-nums">
                    {Math.ceil(remaining / 1000)}s
                  </span>
                </>
              )}
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground">
              <ArrowLeft data-icon="inline-start" />
              Use a different email
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}
