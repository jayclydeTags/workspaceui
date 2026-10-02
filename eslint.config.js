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
      "shadcn/no-restyle": ["warn", { allow: ["layout"] }],
      "shadcn/no-raw-colors": "warn",
      "shadcn/no-arbitrary-values": ["warn", { allow: ["layout"] }],
      "shadcn/no-inline-styles": "warn",
      // Marker classes: selector hooks in CSS/JS, not Tailwind utilities.
      "shadcn/no-unknown-classes": [
        "warn",
        { allow: ["not-prose", "steps", "cn-input-otp"] },
      ],
      "shadcn/require-static-classes": "warn",
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
