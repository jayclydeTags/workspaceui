"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

// ponytail: strength is a 0–3 heuristic (length + character classes), enough to
// drive the meter and gate weak passwords. Swap for zxcvbn if real entropy
// scoring is needed — keep the 0–3 scale the meter reads.
export function scorePassword(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++
  return score as 0 | 1 | 2 | 3
}

const STRENGTH = ["Too weak", "Weak", "Good", "Strong"] as const

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /** Show a live strength meter below the input. Use only on new-password fields. */
  showStrength?: boolean
}

export function PasswordInput({
  showStrength,
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)
  // Track the value ourselves when uncontrolled so the meter can read it.
  const [internal, setInternal] = React.useState(
    defaultValue != null ? String(defaultValue) : ""
  )
  const isControlled = value !== undefined
  const current = isControlled ? String(value) : internal
  const strength = scorePassword(current)

  return (
    <>
      <InputGroup>
        <InputGroupInput
          type={visible ? "text" : "password"}
          className={className}
          {...(isControlled ? { value } : { defaultValue })}
          onChange={(e) => {
            if (!isControlled) setInternal(e.target.value)
            onChange?.(e)
          }}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            // Skip in the tab order — the toggle is a convenience, not a stop.
            tabIndex={-1}
            disabled={props.disabled}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {showStrength && current && (
        <div className="flex items-center gap-2" aria-live="polite">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i < strength ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {STRENGTH[strength]}
          </span>
        </div>
      )}
    </>
  )
}
