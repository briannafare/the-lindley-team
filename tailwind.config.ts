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
        ink: "#000000",
        "ink-mid": "#53554E",
        // Meets WCAG AA (4.5:1) on paper/bg-alt at caption sizes —
        // see docs/accessibility-review.md.
        "ink-light": "#6B6D62",
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
