"use client"

import {
  AvatarStack,
  type AvatarStackUser,
} from "@/registry/bases/base/workspaceui/avatar-stack"

const team: AvatarStackUser[] = [
  { id: "1", name: "Ada Lovelace" },
  { id: "2", name: "Grace Hopper" },
  { id: "3", name: "Alan Turing" },
  { id: "4", name: "Katherine Johnson" },
  { id: "5", name: "Linus Torvalds" },
  { id: "6", name: "Margaret Hamilton" },
  { id: "7", name: "Dennis Ritchie" },
]

export function AvatarStackDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <AvatarStack users={team} size="sm" />
      <AvatarStack users={team} />
      <AvatarStack users={team} size="lg" max={3} />
    </div>
  )
}
