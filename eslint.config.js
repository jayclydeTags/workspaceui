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
        "warn",
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
  // The stock shadcn Checkbox and Progress shipped to consumers have no
  // indeterminate dash or indicator-color API, so these files style them.
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
  {
    files: [
      "src/registry/bases/base/workspaceui/password-input.tsx",
      "src/registry/bases/base/workspaceui/usage-meter.tsx",
    ],
    rules: {
      "shadcn/no-restyle": [
        "warn",
        {
          allow: ["layout"],
          contracts: [{ pattern: "^Progress$", allow: ["layout", "color"] }],
        },
      ],
    },
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
