import type { Config } from "tailwindcss";

/**
 * FIELD GUIDE token mapping — canonical values live in
 * design-system/lindley/tokens.css (CSS custom properties).
 * Legacy color names (orange/blue/yellow/silver/grey/cream) are
 * aliased into the new system so older pages degrade quietly.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // — semantic (new work uses these) —
        paper: {
          DEFAULT: "var(--paper-50)",
          0: "var(--paper-0)",
          50: "var(--paper-50)",
          100: "var(--paper-100)",
          200: "var(--paper-200)",
          300: "var(--paper-300)",
          400: "var(--paper-400)",
          500: "var(--paper-500)",
          600: "var(--paper-600)",
          700: "var(--paper-700)",
          800: "var(--paper-800)",
          900: "var(--paper-900)",
        },
        vermilion: {
          DEFAULT: "var(--vermilion-500)",
          50: "var(--vermilion-50)",
          100: "var(--vermilion-100)",
          200: "var(--vermilion-200)",
          300: "var(--vermilion-300)",
          400: "var(--vermilion-400)",
          500: "var(--vermilion-500)",
          600: "var(--vermilion-600)",
          700: "var(--vermilion-700)",
          800: "var(--vermilion-800)",
          900: "var(--vermilion-900)",
        },
        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        sunken: "var(--color-surface-sunken)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",

        // — legacy aliases (old pages keep compiling, get quieter) —
        bg: "var(--paper-50)",
        "bg-alt": "var(--paper-100)",
        ink: "var(--paper-900)",
        "ink-mid": "var(--paper-600)",
        "ink-light": "var(--paper-500)",
        orange: "var(--vermilion-500)",
        blue: "var(--paper-700)",
        yellow: "var(--paper-100)",
        silver: "var(--paper-400)",
        grey: "var(--paper-500)",
        border: "var(--paper-200)",
        cream: "var(--paper-100)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Iowan Old Style", "Georgia", "serif"],
        body: ["var(--font-inter)", "-apple-system", "Helvetica Neue", "sans-serif"],
        mono: ["var(--font-plex-mono)", "SF Mono", "Menlo", "monospace"],
        // legacy alias — script accents retired; falls back to display serif
        script: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["var(--text-display-xl)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["var(--text-display-lg)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["var(--text-display-md)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        "display-sm": ["var(--text-display-sm)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "body-xl": ["var(--text-body-xl)", { lineHeight: "1.5" }],
        "body-lg": ["var(--text-body-lg)", { lineHeight: "1.8" }],
        mono: ["var(--text-mono)", { lineHeight: "1.5", letterSpacing: "0.04em" }],
        "mono-sm": ["var(--text-mono-sm)", { lineHeight: "1.5", letterSpacing: "0.08em" }],
      },
      maxWidth: {
        container: "var(--container-max)",
        prose: "42rem",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
