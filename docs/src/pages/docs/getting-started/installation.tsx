import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock, InlineCode } from "@/components/code-block"

const SETUP_CODE = `// 1. Make sure you have a Next.js or Vite project with Tailwind CSS and shadcn/ui initialised.
// 2. Run the add command for the component you want:`

const NEXTJS_SETUP = `# Install shadcn/ui if you haven't already
npx shadcn@latest init

# Add workspace-tabs
npx shadcn@latest add https://workspaceui.vercel.app/r/workspace-tabs.json

# Add workspace (includes workspace-tabs)
npx shadcn@latest add https://workspaceui.vercel.app/r/workspace.json`

export function InstallationPage() {
  useDocumentTitle("Installation")

  return (
    <article className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Installation</h1>
        <p className="text-muted-foreground">
          WorkspaceUI components are distributed via the shadcn registry. Each
          component is added to your project as editable source code — no
          package to maintain.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Prerequisites</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• React 18 or 19</li>
          <li>• Tailwind CSS v4</li>
          <li>• shadcn/ui initialised in your project</li>
          <li>• TypeScript (recommended)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Add a component</h2>
        <p className="text-muted-foreground">
          Use the shadcn CLI to install any component. The CLI handles
          dependencies automatically.
        </p>
        <CodeBlock code={NEXTJS_SETUP} lang="bash" />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Manual installation</h2>
        <p className="text-muted-foreground">
          If you prefer to copy files manually, each component page has a Code
          tab showing the full source. Copy the file into{" "}
          <code className="font-mono text-xs">
            your-project/components/ui/
          </code>{" "}
          and install the listed dependencies.
        </p>
        <InlineCode code={SETUP_CODE} />
      </section>
    </article>
  )
}
