"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Loader2, ShieldCheck, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: fixed demo code + 30s resend cooldown so the verify/error/resend
// states are all reachable without a backend. Wire the check and resend to the
// real endpoints when integrated; keep the state machine and cooldown.
const DEMO_CODE = "123456"
const RESEND_MS = 30 * 1000
const DESTINATION = "•••• 4291"

type Status = "idle" | "verifying" | "error" | "success"

export function OtpVerify() {
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [resendAt, setResendAt] = useState(() => Date.now() + RESEND_MS)
  const [now, setNow] = useState(() => Date.now())
  const submitted = useRef(false)

  const remaining = Math.max(0, resendAt - now)
  const canResend = remaining <= 0

  useEffect(() => {
    if (canResend) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [canResend])

  async function verify(value: string) {
    if (submitted.current) return
    submitted.current = true
    setStatus("verifying")
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 600))
    if (value === DEMO_CODE) {
      setStatus("success")
    } else {
      setStatus("error")
      setCode("")
      submitted.current = false
    }
  }

  function onChange(value: string) {
    if (status === "error") setStatus("idle")
    setCode(value)
    if (value.length === 6) verify(value)
  }

  function resend() {
    setResendAt(Date.now() + RESEND_MS)
    setNow(Date.now())
    setCode("")
    setStatus("idle")
    submitted.current = false
  }

  if (status === "success") {
    return (
      <Page hasHeader={false}>
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-5 text-primary" />
            </div>
            <h1 className="mt-4 text-sm font-medium">Verified</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Your identity is confirmed — continuing to your account.
            </p>
          </div>
        </div>
      </Page>
    )
  }

  const verifying = status === "verifying"

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle className="mt-2">Enter verification code</CardTitle>
            <CardDescription>
              We sent a 6-digit code to your phone ending in {DESTINATION}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <InputOTP
              maxLength={6}
              value={code}
              disabled={verifying}
              onChange={onChange}
              aria-invalid={status === "error"}
              aria-label="Verification code"
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} aria-invalid={status === "error"} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className="h-5 text-sm" aria-live="polite">
              {verifying && (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Verifying…
                </span>
              )}
              {status === "error" && (
                <span className="flex items-center gap-2 text-destructive" role="alert">
                  <TriangleAlert className="size-4" />
                  Incorrect code. Try again.
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground" aria-live="polite">
              {canResend ? (
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={resend}
                >
                  Resend code
                </Button>
              ) : (
                <>
                  Resend code in{" "}
                  <span className="font-medium tabular-nums text-foreground">
                    {Math.ceil(remaining / 1000)}s
                  </span>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
