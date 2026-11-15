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
        obsidian: {
          950: "#070507",
          900: "#0d090d",
          850: "#130e13",
          800: "#1b141b",
          750: "#241b24",
          700: "#2d222d",
          600: "#3d2e3d",
        },
        steel: {
          50: "#fafafa",
          100: "#f5f5f7",
          200: "#e5e5ea",
          300: "#d1d1d8",
          400: "#9e9ea7",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
        },
        crimson: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        condensed: ["var(--font-barlow-condensed)", "sans-serif"],
        sans: ["var(--font-barlow)", "sans-serif"],
      },
      boxShadow: {
        "red-glow": "0 0 30px rgba(220, 38, 38, 0.45)",
        "red-sm": "0 0 16px rgba(220, 38, 38, 0.25)",
        "glass-red":
          "0 16px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(220, 38, 38, 0.15)",
      },
      backgroundImage: {
        "crimson-gradient":
          "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #991b1b 100%)",
        "rose-gradient":
          "linear-gradient(135deg, #ffffff 0%, #fecaca 40%, #ef4444 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
