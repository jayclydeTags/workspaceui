"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import {
  CREATE_PREVIEW_READY,
  CREATE_THEME_MESSAGE,
} from "@/lib/create-previews"
import { parseThemeParams, toPreviewCss } from "@/lib/create-theme"

// Runs inside the /create/preview iframe. Seeds from the iframe URL, then
// follows themes the parent canvas posts — so tweaking a control restyles the
// block without reloading it (and without losing its local UI state).
export function PreviewThemeBridge({
  fontVariables,
}: {
  fontVariables: string
}) {
  const searchParams = useSearchParams()
  const [config, setConfig] = useState(() =>
    parseThemeParams(new URLSearchParams(searchParams.toString()))
  )

  // On <html>, not a wrapper: blocks portal dialogs and menus into <body>.
  useEffect(() => {
    const classes = fontVariables.split(" ")
    document.documentElement.classList.add(...classes)
    return () => document.documentElement.classList.remove(...classes)
  }, [fontVariables])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type !== CREATE_THEME_MESSAGE) return
      if (typeof e.data.params !== "string") return
      setConfig(parseThemeParams(new URLSearchParams(e.data.params)))
    }
    window.addEventListener("message", onMessage)
    // The parent's theme may have changed since this frame's URL was built.
    window.parent.postMessage(
      { type: CREATE_PREVIEW_READY },
      window.location.origin
    )
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return <style>{toPreviewCss(config)}</style>
}
