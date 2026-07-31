import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FEFEFD",
        shell: "#EDEEE9",
        bg: "#FEFEFD",
        "bg-alt": "#F5F6F1",
        cream: "#FEFEFD",
        ink: {
          900: "#000000",
          700: "#53554E",
          500: "#7F817B",
          400: "#9CA3AF",
          300: "#BFBFBF",
        },
        accent: {
          DEFAULT: "#ef4434",
          light: "#FDECE5",
          dark: "#B83A2C",
        },
        orange: "var(--accent)",
        coral: "var(--accent)",
        blue: "#3554D9",
        cobalt: "#3554D9",
        lime: "#DDE84B",
        limewash: "#F0F4A6",
        yellow: "#DDE84B",
        border: "#E0E2DB",
        silver: "#BDBCBD",
        grey: "#7F817B",
      },
      fontFamily: {
        display: ["Cabinet Grotesk", "var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        elevated: "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        "input-focus": "0 0 0 3px rgba(239,68,68,0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
