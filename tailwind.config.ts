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
        paper: "#F5F6F1",
        bg: "#F5F6F1",
        "bg-alt": "#ECEEE7",
        cream: "#F5F6F1",
        ink: "#0D0D0D",
        "ink-mid": "#55554E",
        "ink-light": "#8A8A80",
        orange: "#DF6E56", // coral — hero accent
        coral: "#DF6E56",
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
