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
        // Base neutrals match the source exactly: cool gallery off-white #F5F6F1
        // + true black — NOT warm cream. See behance.net/gallery/238108979.
        paper: "#F5F6F1",
        shell: "#E9EAE5", // neutral behind the card frame
        bg: "#F5F6F1",
        "bg-alt": "#EDEEE8",
        cream: "#F5F6F1",
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
        border: "#D9DBD3",
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
