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
        primary: "#00AB55", // Vibrant Brazilian green
        success: "#36B37E",
        border: "#E5E7EB",
        background: "#FFFFFF",
        foreground: "#1B3A6A", // Richer dark blue
        muted: "#637381",
        accent: {
          green: "#00AB55", // Vibrant Brazilian green
          blue: "#1B3A6A", // Richer dark blue
          yellow: "#FFC107", // Warmer Brazilian yellow
          light: "#E6F7ED", // Softer light green background
          orange: "#FF7A45", // Accent orange for CTAs
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 2px 4px 0 rgba(0,0,0,0.05)',
        'card': '0 0 24px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;