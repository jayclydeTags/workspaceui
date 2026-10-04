"use client"

import { defineStory } from "@/components/studio/studio"
import {
  AvatarStack,
  type AvatarStackUser,
} from "@/registry/bases/base/workspaceui/avatar-stack"

const NAMES = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Linus Torvalds",
  "Margaret Hamilton",
  "Dennis Ritchie",
  "Barbara Liskov",
  "Edsger Dijkstra",
  "Radia Perlman",
  "Ken Thompson",
  "Frances Allen",
]

interface Args {
  count: number
  max?: number
  size: "sm" | "default" | "lg"
}

function Preview({ count, max, size }: Args) {
  const users: AvatarStackUser[] = NAMES.slice(
    0,
    Math.min(Math.max(count, 0), NAMES.length)
  ).map((name, i) => ({ id: String(i), name }))
  return <AvatarStack users={users} max={max} size={size} />
}

export default defineStory<Args>({
  args: { count: 7, max: 4, size: "default" },
  controls: {
    count: {
      type: "number",
      label: "Users",
      min: 0,
      max: NAMES.length,
      description: "How many users to pass in (playground only).",
    },
    max: {
      type: "number",
      min: 1,
      description: 'Avatars shown before the rest collapse into "+N".',
    },
    size: { group: "style", type: "select", options: ["sm", "default", "lg"] },
  },
  preview: Preview,
})
