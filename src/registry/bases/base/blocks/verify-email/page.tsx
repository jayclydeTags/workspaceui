"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, MailOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: static demo — "Resend" restarts the cooldown and "I've verified"
// flips to the confirmed state to stand in for the real link click. Wire resend
// and the verification poll/callback when integrated; keep the resend cooldown.
const EMAIL = "alex@acme.com"
const RESEND_MS = 30 * 1000

export function VerifyEmail() {
  const [resendAt, setResendAt] = useState(() => Date.now() + RESEND_MS)
  const [now, setNow] = useState(() => Date.now())
  const [verified, setVerified] = useState(false)

  const remaining = Math.max(0, resendAt - now)
  const canResend = remaining <= 0

  useEffect(() => {
    if (canResend || verified) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [canResend, verified])

  function resend() {
    setResendAt(Date.now() + RESEND_MS)
    setNow(Date.now())
  }

  if (verified) {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-5 text-primary" />
            </div>
            <h1 className="mt-4 text-sm font-medium">Email confirmed</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Your address is verified — your account is ready.
            </p>
            <Button className="mt-4 w-full max-w-xs">Continue</Button>
          </div>
        </div>
      </Page>
    )
  }

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-muted">
            <MailOpen className="size-5" />
          </div>

          <h1 className="mt-4 text-sm font-medium">Confirm your email</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            We sent a confirmation link to{" "}
            <span className="font-medium text-foreground">{EMAIL}</span>. Open it to
            activate your account.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2" aria-live="polite">
            <Button
              variant="outline"
              className="w-full"
              disabled={!canResend}
              onClick={resend}
            >
              {canResend ? (
                "Resend confirmation email"
              ) : (
                <>
                  Resend in{" "}
                  <span className="font-medium tabular-nums">
                    {Math.ceil(remaining / 1000)}s
                  </span>
                </>
              )}
            </Button>
            {/* ponytail: demo shortcut standing in for the emailed link click. */}
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setVerified(true)}
            >
              I&apos;ve verified my email
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}
