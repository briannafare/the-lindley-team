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
        // ── Met direction palette (Afterglow) ──
        paper: "#FBFAF5",
        shell: "#F0EFE9", // neutral behind the card frame
        bg: "#FBFAF5",
        "bg-alt": "#F4F3ED",
        cream: "#FBFAF5",
        ink: "#0D0D0D",
        "ink-mid": "#55554E",
        // Darkened from #8A8A80 for WCAG AA contrast (4.5:1) on paper/bg-alt at small
        // caption sizes — see docs/accessibility-review.md.
        "ink-light": "#6E6E64",
        orange: "var(--accent)", // Sanity's vivid P3 orange (with sRGB fallback in globals.css)
        coral: "var(--accent)",
        blue: "#3554D9", // cobalt
        cobalt: "#3554D9",
        lime: "#DDE84B", // acid punch
        yellow: "#DDE84B", // alias (legacy usages)
        border: "#DCDCD4",
        silver: "#BDBCBD",
        grey: "#818081",
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
