import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Met direction palette (Afterglow Studio case study, verified) ──
        // White-first: the Met concept floats white panels over #F5F6F1. Paper is
        // near-white for real breathing room; the cool off-white becomes the alt
        // surface. True black ink. See behance.net/gallery/238108979.
        paper: "#FEFEFD",
        shell: "#EDEEE9", // neutral behind the card frame
        bg: "#FEFEFD",
        "bg-alt": "#F5F6F1",
        cream: "#FEFEFD",
        // `ink` is an object so `text-ink` still resolves to DEFAULT (pure black,
        // unchanged) while the calculator suite's ink-900/700/500/400/300 scale works.
        ink: {
          DEFAULT: "#000000",
          900: "#000000",
          700: "#53554E",
          500: "#7F817B",
          400: "#9CA3AF",
          300: "#BFBFBF",
        },
        "ink-mid": "#53554E",
        // Meets WCAG AA (4.5:1) on paper/bg-alt at caption sizes —
        // see docs/accessibility-review.md.
        "ink-light": "#6B6D62",
        // Cool-neutral surface scale (calculator cards/inputs) — matches the site's
        // bg-alt/shell/border family rather than the suite's original warm grays.
        surface: {
          50: "#F5F6F1",
          100: "#EDEEE9",
          200: "#E0E2DB",
          300: "#D5D6CF",
        },
        accent: { DEFAULT: "var(--accent)", light: "#FDECE5", dark: "#B83A2C" },
        orange: "var(--accent)", // THE RED — #EF4434 (P3-boosted). Never use literal orange.
        coral: "var(--accent)",
        blue: "#3554D9", // cobalt (source-exact)
        cobalt: "#3554D9",
        lime: "#DDE84B", // acid punch — small marks/dividers
        limewash: "#F0F4A6", // pale lime surface for panels (Met type-specimen bg)
        yellow: "#DDE84B", // alias (legacy usages)
        border: "#E0E2DB",
        silver: "#BDBCBD",
        grey: "#7F817B",
        warning: "#B45309", // amber-700 — AA on white for caution text
        success: "#047857",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        elevated: "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        grotesk: ['"Cabinet Grotesk"', "var(--font-inter)", "sans-serif"],
        display: ['"Cabinet Grotesk"', "var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
