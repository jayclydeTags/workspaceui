"use client"

import * as React from "react"
import { Check, Eye, EyeOff, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Progress } from "@/components/ui/progress"

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

// Indexed by score (0–3). Index 0 is unused — nothing is filled at score 0.
// Targets Progress's indicator via its data-slot, since the component
// doesn't expose an indicatorClassName prop.
const STRENGTH_INDICATOR = [
  "",
  "[&_[data-slot=progress-indicator]]:bg-destructive",
  "[&_[data-slot=progress-indicator]]:bg-warning",
  "[&_[data-slot=progress-indicator]]:bg-success",
] as const
const STRENGTH_TEXT = [
  "text-muted-foreground",
  "text-destructive",
  "text-warning",
  "text-success",
] as const

/** The rules the checklist validates against, in display order. Exported so the
 *  same set can gate submission (`passwordRequirements.every((r) => r.test(pw))`). */
export const passwordRequirements = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "An uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "A lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "A number", test: (pw: string) => /\d/.test(pw) },
  { label: "A symbol", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
] as const

export interface PasswordInputProps extends Omit<
  React.ComponentProps<"input">,
  "type"
> {
  /** Show a live strength meter below the input. Use only on new-password fields. */
  showStrength?: boolean
  /** Show a live requirements checklist below the input. Use only on new-password fields. */
  showChecklist?: boolean
}

export function PasswordInput({
  showStrength,
  showChecklist,
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

  const strengthId = React.useId()
  const checklistId = React.useId()
  const describedBy =
    [showStrength && strengthId, showChecklist && checklistId]
      .filter(Boolean)
      .join(" ") || undefined

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
          aria-describedby={
            [props["aria-describedby"], describedBy]
              .filter(Boolean)
              .join(" ") || undefined
          }
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
        <div
          id={strengthId}
          className="flex items-center gap-2"
          aria-live="polite"
        >
          <Progress
            value={(strength / 3) * 100}
            aria-label={`Password strength: ${STRENGTH[strength]}`}
            className={cn("flex-1 gap-0", STRENGTH_INDICATOR[strength])}
          />
          <span
            className={cn("text-xs tabular-nums", STRENGTH_TEXT[strength])}
            aria-hidden="true"
          >
            {STRENGTH[strength]}
          </span>
        </div>
      )}
      {showChecklist && (
        <ul
          id={checklistId}
          className="m-0 flex flex-col gap-1 p-0"
          aria-live="polite"
        >
          {passwordRequirements.map(({ label, test }) => {
            const met = test(current)
            return (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  met ? "text-success" : "text-destructive"
                )}
              >
                {met ? (
                  <Check className="size-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <X className="size-3.5 shrink-0" aria-hidden="true" />
                )}
                <span>{label}</span>
                <span className="sr-only">{met ? "— met" : "— not met"}</span>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
