import { redirect } from "next/navigation"

import { getBlockPages } from "@/lib/block-taxonomy"

// There's no block gallery: /blocks opens the first block in the sidebar.
// (Static export turns this into a build-time redirect page.)
export default function BlocksPage() {
  const [first] = getBlockPages()
  redirect(first ? first.href : "/")
}
