/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#faf6f1",
          100: "#f0e6d8",
          200: "#e0cbb0",
          300: "#c9a67a",
          400: "#b8844f",
          500: "#a66d3c",
          600: "#8f5732",
          700: "#74432c",
          800: "#5f3828",
          900: "#4f3024",
          950: "#2a1810",
        },
        surface: {
          DEFAULT: "#141210",
          card: "#1c1917",
          elevated: "#292524",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(166, 109, 60, 0.35)",
        card: "0 4px 24px -4px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
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
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
