import Link from "next/link"

// ponytail: placeholder home. The real landing page (_home._index.tsx) +
// HomeLayout get ported in Phase 2 alongside the blocks routes.
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">WorkspaceUI</h1>
      <Link className="text-fd-primary underline" href="/docs/getting-started/introduction">
        Documentation
      </Link>
    </main>
  )
}
