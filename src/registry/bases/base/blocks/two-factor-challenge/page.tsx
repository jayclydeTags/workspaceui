"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react"
import { KeyRound, Loader2, Smartphone, TriangleAlert } from "lucide-react"

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

// Indeterminate loading ring — honest about variable backend latency.
function SpinnerRing() {
  return (
    <svg viewBox="0 0 44 44" className="size-11" fill="none">
      <circle cx="22" cy="22" r="19" strokeWidth="3" className="stroke-muted" />
      <motion.circle
        cx="22"
        cy="22"
        r="19"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="30 120"
        className="stroke-primary"
        style={{ transformOrigin: "center" }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
    </svg>
  )
}

// Completed ring sweeps closed, then the check draws inside it.
function SuccessRing({ reduceMotion }: { reduceMotion: boolean }) {
  // ponytail: literal green — shadcn's theme has no success token. Swap for a
  // --success var if the design system grows one.
  const green = "stroke-green-600 dark:stroke-green-500"
  return (
    <svg viewBox="0 0 44 44" className="size-11" fill="none">
      <circle cx="22" cy="22" r="19" className="fill-green-600/10 dark:fill-green-500/10" />
      <motion.circle
        cx="22"
        cy="22"
        r="19"
        strokeWidth="3"
        strokeLinecap="round"
        className={green}
        style={{ rotate: -90, transformOrigin: "center" }}
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M14.5 22.5l5 5 10-11"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={green}
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.25,
          delay: reduceMotion ? 0 : 0.35,
          ease: "easeOut",
        }}
      />
    </svg>
  )
}

export function TwoFactorChallenge() {
  const [mode, setMode] = useState<"totp" | "recovery">("totp")
  const [code, setCode] = useState("")
  const [recovery, setRecovery] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const submitted = useRef(false)
  const reduceMotion = useReducedMotion() ?? false
  const [shakeScope, animateShake] = useAnimate()

  function shake() {
    if (reduceMotion || !shakeScope.current) return
    animateShake(
      shakeScope.current,
      { x: [0, -8, 8, -6, 6, 0] },
      { duration: 0.4 }
    )
  }

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
      shake()
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

  const verifying = status === "verifying"
  const success = status === "success"

  return (
    <Page hasHeader={false}>
      <div className="flex min-h-full items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="items-center text-center">
            {/* Badge: mode icon → spinner ring → completed ring + check, all in place */}
            <div className="relative mx-auto flex size-11 items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                {success ? (
                  <motion.div
                    key="success"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <SuccessRing reduceMotion={reduceMotion} />
                  </motion.div>
                ) : verifying ? (
                  <motion.div
                    key="verifying"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                  >
                    <SpinnerRing />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    className="flex size-11 items-center justify-center rounded-full bg-muted"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                  >
                    {mode === "totp" ? (
                      <Smartphone className="size-5" />
                    ) : (
                      <KeyRound className="size-5" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CardTitle
              className={
                success ? "mt-2 text-green-600 dark:text-green-500" : "mt-2"
              }
            >
              {success ? "Verified" : "Two-factor authentication"}
            </CardTitle>
            <CardDescription>
              {success
                ? "Two-factor check passed — signing you in."
                : mode === "totp"
                  ? "Enter the 6-digit code from your authenticator app"
                  : "Enter one of your saved recovery codes"}
            </CardDescription>
          </CardHeader>

          {/* Body collapses away on success — the card stays put, header does the talking */}
          <AnimatePresence initial={false}>
            {!success && (
              <motion.div
                key="body"
                className="overflow-hidden"
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, height: 0 }
                }
                transition={{ duration: 0.25 }}
              >
                {/* py-2: keep the OTP focus ring from being clipped by the
                    overflow-hidden collapse wrapper (CardContent has no y-padding) */}
                <CardContent className="flex flex-col items-center gap-4 py-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={mode}
                      className="flex w-full flex-col items-center gap-4"
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      {mode === "totp" ? (
                        <>
                          <div ref={shakeScope}>
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
                                  <InputOTPSlot
                                    key={i}
                                    index={i}
                                    aria-invalid={status === "error"}
                                  />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>

                          <div className="h-5 text-sm" aria-live="polite">
                            {verifying && (
                              <span className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="size-4 animate-spin" />
                                Verifying…
                              </span>
                            )}
                            {status === "error" && (
                              <span
                                className="flex items-center gap-2 text-destructive"
                                role="alert"
                              >
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
                    </motion.div>
                  </AnimatePresence>

                  <Field orientation="horizontal">
                    <Checkbox id="trust-device" disabled={verifying} />
                    <FieldLabel htmlFor="trust-device" className="font-normal">
                      Trust this device for 30 days
                    </FieldLabel>
                  </Field>

                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-muted-foreground"
                    disabled={verifying}
                    onClick={() => switchMode(mode === "totp" ? "recovery" : "totp")}
                  >
                    {mode === "totp"
                      ? "Use a recovery code instead"
                      : "Use your authenticator app instead"}
                  </Button>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </Page>
  )
}
