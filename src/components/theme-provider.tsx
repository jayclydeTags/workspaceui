"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type Resolved = "light" | "dark"

const STORAGE_KEY = "theme"

// No-flash script: runs from the static HTML in <body> before paint, so the
// correct theme class is set before React hydrates. Rendered by the server
// layout (an RSC), never by a client component — which is what avoids React
// 19's "script tag while rendering" warning that next-themes tripped.
export const themeScript = `(function(){try{var e=localStorage.getItem("${STORAGE_KEY}")||"system";var d=e==="dark"||(e==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: Resolved
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const systemTheme = (): Resolved =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

function apply(resolved: Resolved) {
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
  root.style.colorScheme = resolved
}

const storedTheme = (): Theme =>
  typeof window === "undefined"
    ? "system"
    : ((localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system")

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Seed from what the no-flash script already decided — no mount effect needed.
  const [theme, setThemeState] = React.useState<Theme>(storedTheme)
  const [resolved, setResolved] = React.useState<Resolved>(() => {
    if (typeof window === "undefined") return "light"
    const t = storedTheme()
    return t === "system" ? systemTheme() : t
  })

  // Follow the OS while in system mode.
  React.useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      const r = systemTheme()
      setResolved(r)
      apply(r)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore (private mode / storage disabled)
    }
    const r = next === "system" ? systemTheme() : next
    setResolved(r)
    apply(r)
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme: resolved, setTheme }),
    [theme, resolved, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
