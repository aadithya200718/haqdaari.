/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: "#F5A623",
        trust: "#1A56DB",
        success: "#10B981",
        warning: "#FBBF24",
        destructive: "#EF4444",
        surface: {
          light: "#FFFFFF",
          dark: "rgba(255,255,255,0.06)",
        },
        bg: {
          light: "#F5F4F0",
          dark: "#0A0F1E",
        },
        txt: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
        hindi: ['"Noto Sans Devanagari"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
