/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 2px rgba(56,189,248,.45), 0 0 30px rgba(56,189,248,.35)",
      },
      keyframes: {
        pulseSoft: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
      },
      animation: {
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
