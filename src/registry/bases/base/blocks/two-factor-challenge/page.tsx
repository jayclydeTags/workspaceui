"use client"

import { useRef, useState } from "react"
import { CheckCircle2, KeyRound, Loader2, Smartphone, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Page } from "@/registry/bases/base/workspaceui/page"

// ponytail: fixed demo secrets so every state is reachable without a backend.
// Wire the verify calls to the real 2FA endpoint when integrated; keep the
// authenticator/recovery-code toggle and the state machine.
const DEMO_CODE = "123456"
const DEMO_RECOVERY = "ACME-4X9K-7QP2"

type Status = "idle" | "verifying" | "error" | "success"

export function TwoFactorChallenge() {
  const [mode, setMode] = useState<"totp" | "recovery">("totp")
  const [code, setCode] = useState("")
  const [recovery, setRecovery] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const submitted = useRef(false)

  async function verify(value: string, expected: string) {
    if (submitted.current) return
    submitted.current = true
    setStatus("verifying")
    // ponytail: fake latency so the pending state is visible; drop when wired.
    await new Promise((r) => setTimeout(r, 600))
    if (value === expected) {
      setStatus("success")
    } else {
      setStatus("error")
      setCode("")
      submitted.current = false
    }
  }

  function onCodeChange(value: string) {
    if (status === "error") setStatus("idle")
    setCode(value)
    if (value.length === 6) verify(value, DEMO_CODE)
  }

  function switchMode(next: "totp" | "recovery") {
    setMode(next)
    setStatus("idle")
    setCode("")
    setRecovery("")
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
              Two-factor check passed — signing you in.
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
              {mode === "totp" ? (
                <Smartphone className="size-5" />
              ) : (
                <KeyRound className="size-5" />
              )}
            </div>
            <CardTitle className="mt-2">Two-factor authentication</CardTitle>
            <CardDescription>
              {mode === "totp"
                ? "Enter the 6-digit code from your authenticator app"
                : "Enter one of your saved recovery codes"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {mode === "totp" ? (
              <>
                <InputOTP
                  maxLength={6}
                  value={code}
                  disabled={verifying}
                  onChange={onCodeChange}
                  aria-invalid={status === "error"}
                  aria-label="Authentication code"
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
              </>
            ) : (
              <form
                className="w-full"
                onSubmit={(e) => {
                  e.preventDefault()
                  verify(recovery.trim().toUpperCase(), DEMO_RECOVERY)
                }}
              >
                <Field data-invalid={status === "error"}>
                  <FieldLabel htmlFor="recovery-code">Recovery code</FieldLabel>
                  <Input
                    id="recovery-code"
                    placeholder="ACME-XXXX-XXXX"
                    autoComplete="one-time-code"
                    value={recovery}
                    disabled={verifying}
                    aria-invalid={status === "error"}
                    onChange={(e) => {
                      if (status === "error") setStatus("idle")
                      setRecovery(e.target.value)
                    }}
                  />
                  {status === "error" && (
                    <FieldError>That recovery code isn&apos;t valid.</FieldError>
                  )}
                </Field>
                <Button type="submit" className="mt-4 w-full" disabled={verifying}>
                  {verifying && (
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                  )}
                  {verifying ? "Verifying…" : "Verify"}
                </Button>
              </form>
            )}

            <Field orientation="horizontal">
              <Checkbox id="trust-device" disabled={verifying} />
              <FieldLabel htmlFor="trust-device" className="font-normal">
                Trust this device for 30 days
              </FieldLabel>
            </Field>

            <Button
              variant="link"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={() => switchMode(mode === "totp" ? "recovery" : "totp")}
            >
              {mode === "totp"
                ? "Use a recovery code instead"
                : "Use your authenticator app instead"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
