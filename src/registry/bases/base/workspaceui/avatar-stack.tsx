"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface AvatarStackUser {
  id: string
  name: string
  image?: string
}

export interface AvatarStackProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  users: AvatarStackUser[]
  /** Avatars shown before the rest collapse into a "+N" count. */
  max?: number
  size?: "sm" | "default" | "lg"
}

/** Up to two initials from a display name: "Ada Lovelace" → "AL". */
export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return (first + last).toUpperCase()
}

// Keeps the overflow tooltip readable on large teams.
const MAX_OVERFLOW_NAMES = 8

function summarize(names: string[], hiddenCount: number) {
  if (names.length === 0) return "No members"
  if (hiddenCount === 0) {
    return names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
  }
  return `${names.join(", ")} and ${hiddenCount} more`
}

export function AvatarStack({
  users,
  max = 4,
  size = "default",
  className,
  ...props
}: AvatarStackProps) {
  // Collapsing a single avatar into "+1" saves no space, so show it instead.
  const limit = users.length - max === 1 ? users.length : Math.max(max, 0)
  const visible = users.slice(0, limit)
  const overflow = users.slice(limit)
  const overflowNames = overflow.slice(0, MAX_OVERFLOW_NAMES).map((u) => u.name)
  const unlisted = overflow.length - overflowNames.length

  return (
    <AvatarGroup
      role="group"
      aria-label={summarize(
        visible.map((u) => u.name),
        overflow.length
      )}
      data-slot="avatar-stack"
      className={cn("w-fit", className)}
      {...props}
    >
      {visible.map((user) => (
        <Tooltip key={user.id}>
          <TooltipTrigger
            render={
              <Avatar
                size={size}
                tabIndex={0}
                role="img"
                aria-label={user.name}
                className="outline-none focus-visible:z-10 focus-visible:ring-3! focus-visible:ring-ring/50!"
              />
            }
          >
            {user.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback aria-hidden="true">
              {getInitials(user.name)}
            </AvatarFallback>
          </TooltipTrigger>
          <TooltipContent>{user.name}</TooltipContent>
        </Tooltip>
      ))}
      {overflow.length > 0 && (
        <Tooltip>
          <TooltipTrigger
            render={
              <AvatarGroupCount
                tabIndex={0}
                role="img"
                aria-label={`${overflow.length} more: ${summarize(overflowNames, unlisted)}`}
                className="text-xs font-medium tabular-nums outline-none focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            }
          >
            +{overflow.length}
          </TooltipTrigger>
          <TooltipContent className="block">
            {summarize(overflowNames, unlisted)}
          </TooltipContent>
        </Tooltip>
      )}
    </AvatarGroup>
  )
}
