"use client"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { defineStory } from "@/components/studio/studio"

interface Args {
  fallback: string
  badge: boolean
  group: boolean
  size: "sm" | "default" | "lg"
}

function Preview({ fallback, badge, group, size }: Args) {
  if (group) {
    return (
      <AvatarGroup>
        {["AL", "GH", "AT"].map((initials) => (
          <Avatar key={initials} size={size}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    )
  }
  return (
    <Avatar size={size}>
      <AvatarFallback>{fallback}</AvatarFallback>
      {badge && <AvatarBadge />}
    </Avatar>
  )
}

export default defineStory<Args>({
  args: { fallback: "CN", badge: false, group: false, size: "default" },
  controls: {
    fallback: { type: "text", description: "Shown when the image is missing." },
    badge: {
      type: "boolean",
      description: "A status dot (ignored in a group).",
    },
    group: {
      type: "boolean",
      group: "style",
      description: "Overlapping avatars with a +N count.",
    },
    size: { type: "select", group: "style", options: ["sm", "default", "lg"] },
  },
  preview: Preview,
})
