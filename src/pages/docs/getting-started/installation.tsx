import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock } from "@/components/code-block"
import { Steps, Step } from "@/components/steps"
import { Callout } from "@/components/callout"

export function InstallationPage() {
  useDocumentTitle("Installation")

  return (
    <article className="space-y-10">
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

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick start</h2>
        <Steps>
          <Step>Initialise shadcn/ui if you haven't already</Step>
          <CodeBlock code="npx shadcn@latest init" lang="bash" />
          <Step>Add the component you need</Step>
          <CodeBlock
            code={`npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs\nnpx shadcn@latest add jayclydeTags/workspaceui/workspace`}
            lang="bash"
          />
        </Steps>
        <Callout>
          The CLI automatically installs peer dependencies and resolves registry
          dependencies — <code className="font-mono text-xs">workspace</code>{" "}
          will pull in <code className="font-mono text-xs">workspace-tabs</code>{" "}
          automatically.
        </Callout>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manual installation</h2>
        <p className="text-sm text-muted-foreground">
          Each component page has a <strong>Manual</strong> tab in the
          installation section with the full source and dependency list.
        </p>
      </section>
    </article>
  )
}
