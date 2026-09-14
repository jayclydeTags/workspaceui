"use client"

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useSearchParams } from "next/navigation"

import { DynamicCodeBlock } from "@/components/dynamic-codeblock"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CREATE_PREVIEWS,
  CREATE_PREVIEW_READY,
  CREATE_THEME_MESSAGE,
  type CreatePreviewSlug,
} from "@/lib/create-previews"
import {
  ACCENT_COLORS,
  BASE_COLORS,
  DEFAULT_THEME,
  FONTS,
  FONT_KEYS,
  RADII,
  fontSnippet,
  parseThemeParams,
  themeToParams,
  toCss,
  toRegistryItem,
  type BaseColor,
  type FontKey,
  type Radius,
  type ThemeAccent,
  type ThemeConfig,
} from "@/lib/create-theme"
import { STYLES, STYLE_KEYS, type StyleKey } from "@/lib/create-styles"
import { accentScales, baseColors } from "@/lib/create-theme-data"

const THEME_FILE = "workspaceui-theme.json"
const INSTALL_COMMAND = `npx shadcn@latest add ./${THEME_FILE}`

const titleCase = (value: string) =>
  value
    .split("-")
    .map((word) => word[0]!.toUpperCase() + word.slice(1))
    .join(" ")

const pick = <T,>(list: readonly T[]) =>
  list[Math.floor(Math.random() * list.length)]!

const previewSrc = (slug: CreatePreviewSlug, params: string) =>
  `/create/preview/${slug}${params ? `?${params}` : ""}`

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-3 shrink-0 rounded-full ring-1 ring-foreground/15"
      style={{ background: color }}
    />
  )
}

interface Option<T extends string> {
  value: T
  label: ReactNode
}

const baseOptions: Option<BaseColor>[] = BASE_COLORS.map((value) => ({
  value,
  label: (
    <>
      <Swatch color={baseColors[value].light["muted-foreground"]} />
      {titleCase(value)}
    </>
  ),
}))

const accentOptions: Option<ThemeAccent>[] = [
  { value: "base", label: "Match base" },
  ...ACCENT_COLORS.map((value) => ({
    value,
    label: (
      <>
        <Swatch color={accentScales[value]["500"]} />
        {titleCase(value)}
      </>
    ),
  })),
]

const fontOptions: Option<FontKey>[] = FONT_KEYS.map((value) => ({
  value,
  label: FONTS[value].label,
}))

const styleOptions: Option<StyleKey>[] = STYLE_KEYS.map((value) => ({
  value,
  label: STYLES[value].label,
}))

const previewOptions: Option<CreatePreviewSlug>[] = CREATE_PREVIEWS.map(
  ({ slug, label }) => ({ value: slug, label })
)

function ControlSelect<T extends string>({
  label,
  value,
  options,
  onValueChange,
  hideLabel = false,
}: {
  label: string
  value: T
  options: Option<T>[]
  onValueChange: (value: T) => void
  hideLabel?: boolean
}) {
  const id = useId()
  const items = useMemo(
    () => Object.fromEntries(options.map((o) => [o.value, o.label])),
    [options]
  )

  return (
    <div className="grid gap-1.5">
      <Label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "text-xs text-muted-foreground"}
      >
        {label}
      </Label>
      <Select
        items={items}
        value={value}
        onValueChange={(next) => {
          if (next) onValueChange(next as T)
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const RADIUS_SIZES: Record<Radius, string> = {
  0: "None",
  0.3: "XS",
  0.5: "SM",
  0.625: "MD",
  0.75: "LG",
  1: "XL",
}

// Select values are strings, so radii are keyed by their string form.
const radiusOptions: Option<string>[] = RADII.map((r) => ({
  value: String(r),
  label: (
    <>
      {RADIUS_SIZES[r]}
      <span className="text-muted-foreground">{r}rem</span>
    </>
  ),
}))

function CodePanel({
  lang,
  code,
  title,
}: {
  lang: string
  code: string
  title?: string
}) {
  return (
    <div className="min-w-0 [&_[role=region]]:max-h-72">
      <DynamicCodeBlock
        lang={lang}
        code={code}
        codeblock={title ? { title } : undefined}
      />
    </div>
  )
}

function GetCodeDialog({ config }: { config: ThemeConfig }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button className="w-full" />}>
        Get code
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-4rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Get code</DialogTitle>
          <DialogDescription>
            Install the theme with the shadcn CLI, or paste the CSS into your
            globals.css yourself.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="cli" className="min-w-0">
          <TabsList>
            <TabsTrigger value="cli">shadcn CLI</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
          <TabsContent value="cli" className="grid min-w-0 gap-3 pt-2">
            <p className="text-muted-foreground">
              1. Save this as <code>{THEME_FILE}</code> in your project root.
            </p>
            <CodePanel
              lang="json"
              code={JSON.stringify(toRegistryItem(config), null, 2)}
              title={THEME_FILE}
            />
            <p className="text-muted-foreground">
              2. Add it — the CLI merges the variables into your CSS file.
            </p>
            <CodePanel lang="bash" code={INSTALL_COMMAND} />
          </TabsContent>
          <TabsContent value="css" className="grid min-w-0 gap-3 pt-2">
            <p className="text-muted-foreground">
              Replace the matching blocks in your globals.css.
            </p>
            <CodePanel lang="css" code={toCss(config)} title="globals.css" />
          </TabsContent>
        </Tabs>

        <div className="grid min-w-0 gap-3">
          <h3 className="font-medium">
            Component style: {STYLES[config.style].label}
          </h3>
          <p className="text-muted-foreground">
            Styles change the components&apos; own classes, not the theme. Set
            the style in <code>components.json</code>:
          </p>
          <CodePanel
            lang="json"
            code={`"style": "base-${config.style}"`}
            title="components.json"
          />
          <p className="text-muted-foreground">
            Then re-add your components so the CLI fetches that style. This
            overwrites local edits to them — add only the components you use
            instead of <code>--all</code> to limit it.
          </p>
          <CodePanel
            lang="bash"
            code="npx shadcn@latest add --all --overwrite"
          />
        </div>

        <div className="grid min-w-0 gap-3">
          <p className="text-muted-foreground">
            Either way, load the fonts in your root layout so the theme&apos;s
            font variables resolve.
          </p>
          <CodePanel
            lang="tsx"
            code={fontSnippet(config)}
            title="app/layout.tsx"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ThemeCreator() {
  const searchParams = useSearchParams()
  const [config, setConfig] = useState(() =>
    parseThemeParams(new URLSearchParams(searchParams.toString()))
  )
  const params = themeToParams(config).toString()

  const [preview, setPreview] = useState<CreatePreviewSlug>(
    CREATE_PREVIEWS[0].slug
  )
  // Only rebuilt when switching previews: theme changes are posted into the
  // live frame instead, so they don't reload it.
  const [frameSrc, setFrameSrc] = useState(() =>
    previewSrc(CREATE_PREVIEWS[0].slug, params)
  )
  const [linkCopied, setLinkCopied] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  // Read by the ready handler, which is registered once.
  const paramsRef = useRef(params)

  useEffect(() => {
    paramsRef.current = params
    iframeRef.current?.contentWindow?.postMessage(
      { type: CREATE_THEME_MESSAGE, params },
      window.location.origin
    )
    window.history.replaceState(
      null,
      "",
      params ? `?${params}` : window.location.pathname
    )
  }, [params])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const frame = iframeRef.current?.contentWindow
      if (e.origin !== window.location.origin || e.source !== frame) return
      if (e.data?.type !== CREATE_PREVIEW_READY) return
      frame?.postMessage(
        { type: CREATE_THEME_MESSAGE, params: paramsRef.current },
        window.location.origin
      )
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const update =
    <K extends keyof ThemeConfig>(key: K) =>
    (value: ThemeConfig[K]) =>
      setConfig((current) => ({ ...current, [key]: value }))

  function shuffle() {
    setConfig({
      style: pick(STYLE_KEYS),
      base: pick(BASE_COLORS),
      accent: pick(ACCENT_COLORS),
      chart: pick(ACCENT_COLORS),
      radius: pick(RADII),
      heading: pick(FONT_KEYS),
      body: pick(FONT_KEYS),
    })
  }

  function switchPreview(slug: CreatePreviewSlug) {
    setPreview(slug)
    setFrameSrc(previewSrc(slug, params))
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const previewLabel = CREATE_PREVIEWS.find((p) => p.slug === preview)!.label

  return (
    <div className="flex flex-col md:h-[calc(100svh-3.5rem)] md:flex-row md:overflow-hidden">
      <aside
        aria-label="Theme controls"
        className="flex shrink-0 flex-col gap-5 border-b p-4 md:w-64 md:overflow-y-auto md:border-e md:border-b-0"
      >
        <div className="grid gap-1">
          <h1 className="text-base font-semibold">Create a theme</h1>
          <p className="text-sm text-muted-foreground">
            Tune the tokens and see them on real WorkspaceUI blocks.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <ControlSelect
              label="Style"
              value={config.style}
              options={styleOptions}
              onValueChange={update("style")}
            />
            <p className="text-xs text-muted-foreground">
              {STYLES[config.style].description}
            </p>
          </div>
          <ControlSelect
            label="Base color"
            value={config.base}
            options={baseOptions}
            onValueChange={update("base")}
          />
          <ControlSelect
            label="Accent"
            value={config.accent}
            options={accentOptions}
            onValueChange={update("accent")}
          />
          <ControlSelect
            label="Chart colors"
            value={config.chart}
            options={accentOptions}
            onValueChange={update("chart")}
          />
          <ControlSelect
            label="Radius"
            value={String(config.radius)}
            options={radiusOptions}
            onValueChange={(value) => {
              const next = RADII.find((r) => String(r) === value)
              if (next !== undefined) update("radius")(next)
            }}
          />
          <ControlSelect
            label="Heading font"
            value={config.heading}
            options={fontOptions}
            onValueChange={update("heading")}
          />
          <ControlSelect
            label="Body font"
            value={config.body}
            options={fontOptions}
            onValueChange={update("body")}
          />
        </div>

        <div className="mt-auto grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={shuffle}>
              Shuffle
            </Button>
            <Button variant="outline" onClick={() => setConfig(DEFAULT_THEME)}>
              Reset
            </Button>
          </div>
          <Button variant="outline" onClick={copyLink}>
            {linkCopied ? "Link copied" : "Copy link"}
          </Button>
          <GetCodeDialog config={config} />
        </div>
      </aside>

      <section
        aria-label="Theme preview"
        className="flex min-h-[80svh] min-w-0 flex-1 flex-col gap-3 bg-muted/40 p-4 md:min-h-0"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="w-44">
            <ControlSelect
              label="Preview block"
              hideLabel
              value={preview}
              options={previewOptions}
              onValueChange={switchPreview}
            />
          </div>
          <ThemeToggle />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border bg-background">
          <iframe
            ref={iframeRef}
            src={frameSrc}
            title={`${previewLabel} preview`}
            className="h-full w-full border-0"
          />
        </div>
      </section>
    </div>
  )
}
