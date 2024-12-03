import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#00A859", // Brazilian green
        success: "#4CAF50",
        border: "#E5E7EB",
        background: "#FFFFFF",
        foreground: "#002F6C", // Dark blue
        muted: "#6B7280",
        accent: {
          green: "#00A859", // Brazilian green
          blue: "#002F6C", // Dark blue
          yellow: "#FFDE59", // Brazilian yellow
          light: "#E6F3ED", // Light green background
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;