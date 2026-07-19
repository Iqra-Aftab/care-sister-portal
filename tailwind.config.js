/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#FAF8F5",
        "sand-deep": "#F1ECE4",
        sage: {
          DEFAULT: "#8EAA90",
          deep: "#6E8C71",
          mist: "#E4EBE2",
        },
        slate: {
          DEFAULT: "#2C332D",
          soft: "#5B6459",
        },
        warmth: "#E7C3AC",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.04)", opacity: "1" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        breathe: "breathe 6s ease-in-out infinite",
        rise: "rise 0.7s ease-out both",
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
};
