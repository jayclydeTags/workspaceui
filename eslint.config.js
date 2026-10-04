import js from "@eslint/js"
import { plugin as shadcn } from "@shadcn/lint"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  // Generated output — never our code to lint.
  // `templates/` holds standalone starter projects with their own toolchain — not ours to lint.
  globalIgnores([
    "dist",
    "out",
    ".next",
    ".source",
    ".react-router",
    "templates",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: { shadcn },
    settings: {
      shadcn: {
        note: "See DESIGN.md for design rules and approved exceptions.",
      },
    },
    rules: {
      // Adopted at warn; `pnpm lint` caps the warning count so it can only
      // go down. Promote a rule to "error" once its findings are fixed.
      "shadcn/no-restyle": [
        "warn",
        {
          allow: ["layout"],
          contracts: [
            // shadcn's documented contracts (docs/design-systems.md): titles
            // take typography, containers take spacing, avatars take a size.
            { pattern: "^CardTitle$", allow: ["layout", "typography"] },
            {
              pattern: "^Card$|^Empty$|(Content|Header|Footer|Group|Panel)$",
              allow: ["layout", "spacing"],
            },
            {
              // Named Card treatments: quiet info panel and highlighted card.
              pattern: "^Card$",
              allow: [
                "layout",
                "spacing",
                "bg-muted/50",
                "bg-primary/5",
                "ring-primary/40",
              ],
            },
            {
              // Filled primary action in a sidebar (e.g. Quick Create).
              pattern: "^SidebarMenuButton$",
              allow: [
                "layout",
                "bg-primary",
                "text-primary-foreground",
                "hover:bg-primary/90",
                "hover:text-primary-foreground",
                "active:bg-primary/90",
                "active:text-primary-foreground",
                "duration-200",
                "ease-linear",
              ],
            },
            {
              // Rich rows (e.g. notifications) pad themselves and tint unread.
              pattern: "^DropdownMenuItem$",
              allow: ["layout", "spacing", "bg-accent/40"],
            },
            {
              // Segmented control: muted track, raised active segment.
              pattern: "^ToggleGroup$",
              allow: ["layout", "spacing", "bg-muted"],
            },
            {
              pattern: "^ToggleGroupItem$",
              allow: [
                "layout",
                "spacing",
                "rounded-md",
                "text-muted-foreground",
                "hover:bg-transparent",
                "aria-pressed:bg-background",
                "aria-pressed:text-foreground",
                "aria-pressed:shadow-sm",
              ],
            },
            {
              // Compact (text-xs) and code (font-mono) text entry.
              pattern: "^(Input|Textarea)$",
              allow: ["layout", "spacing", "text-xs", "text-sm", "font-mono"],
            },
            {
              // Avatars take a size and placement; org/workspace avatars are
              // rounded squares rather than circles.
              pattern: "^Avatar(Fallback)?$",
              allow: ["layout", "size-*", "rounded-md", "rounded-lg"],
            },
            // Headless primitives: they ship no appearance, so callers style them.
            {
              pattern: "^Collapsible(Trigger|Content)?$",
              allow: [
                "layout",
                "spacing",
                "color",
                "typography",
                "shape",
                "effects",
                "motion",
              ],
            },
          ],
        },
      ],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": [
        "error",
        {
          // Layout values, plus structural CSS that has no design token:
          // property lists, selectors, and keyword radii. rounded-[4px] is
          // shadcn's own Checkbox radius, which the data-grid checkbox matches.
          allow: [
            "layout",
            "transition-[*]",
            "*:data-[slot=*]",
            "rounded-[inherit]",
            "rounded-[4px]",
            "backdrop-blur-[1px]",
          ],
        },
      ],
      // transform/transition are runtime output of dnd-kit and drag offsets.
      "shadcn/no-inline-styles": [
        "error",
        { allow: ["transform", "transition"] },
      ],
      // Marker classes: selector hooks in CSS/JS, not Tailwind utilities.
      "shadcn/no-unknown-classes": [
        "error",
        { allow: ["not-prose", "steps", "cn-input-otp"] },
      ],
      "shadcn/require-static-classes": "error",
    },
  },
  // shadcn primitives own their appearance: they restyle themselves and use
  // structural values like ring-[3px]. Token rules stay on.
  {
    files: ["src/components/ui/**"],
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/require-static-classes": "off",
    },
  },
  // workspaceui components are this design system's own component directory:
  // they compose and style the primitives, so no-restyle is off here. Blocks,
  // docs and site code are callers, and stay strict.
  {
    files: ["src/registry/bases/base/workspaceui/**"],
    rules: { "shadcn/no-restyle": "off" },
  },
  // The stock shadcn Checkbox shipped to consumers has no indeterminate
  // dash, so this block styles it.
  {
    files: [
      "src/registry/bases/base/blocks/access-control/components/permission-table.tsx",
    ],
    rules: {
      "shadcn/no-restyle": [
        "warn",
        {
          allow: ["layout"],
          contracts: [
            {
              pattern: "^Checkbox$",
              allow: ["layout", "color", "shape", "effects"],
            },
          ],
        },
      ],
    },
  },
  // The docs code-block widgets implement their own tab bars on the Tabs
  // primitive, so their authored defaults are component styling.
  {
    files: [
      "src/components/docs/codeblock.tsx",
      "src/components/docs/code-block-command.tsx",
    ],
    rules: { "shadcn/no-restyle": "off" },
  },
  // Brand artwork must keep its fixed colors (Google's G, the WorkspaceUI
  // logo gradient). Configured here, not with inline disables, so the shipped
  // login-social block stays free of lint directives.
  {
    files: [
      "src/registry/bases/base/blocks/login-social/page.tsx",
      "src/components/site/workspaceui-logo.tsx",
    ],
    rules: { "shadcn/no-raw-colors": "off" },
  },
  // Tests use throwaway class names as fixtures.
  {
    files: ["**/__tests__/**"],
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-raw-colors": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/no-inline-styles": "off",
      "shadcn/no-unknown-classes": "off",
      "shadcn/require-static-classes": "off",
    },
  },
])
