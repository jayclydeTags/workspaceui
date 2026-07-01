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

export default function Root() {
  return (
    <FumaProvider>
      <Outlet />
    </FumaProvider>
  )
}
