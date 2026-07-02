import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import { FumaProvider } from "@/lib/fumadocs-provider"
import "@/index.css"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var stored = localStorage.getItem("theme");
                var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (stored === "dark" || (!stored && prefersDark)) {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
        <meta
          name="description"
          content="Open-source workspace UI components built with React and Tailwind CSS."
        />
        <title>WorkspaceUI</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

// Rendered during initial SPA hydration, before route modules/clientLoaders
// resolve — avoids a blank flash and silences react-router's HydrateFallback warning.
export function HydrateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
    </div>
  )
}

export default function Root() {
  return (
    <FumaProvider>
      <Outlet />
    </FumaProvider>
  )
}
