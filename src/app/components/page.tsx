import { redirect } from "next/navigation"

import { getComponentPages } from "@/lib/component-pages"

// There's no component catalog: /components opens the first component in the
// sidebar. (Static export turns this into a build-time redirect page.)
export default function ComponentsPage() {
  const [first] = getComponentPages()
  redirect(first ? first.href : "/")
}
