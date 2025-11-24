/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2a8aea",
        accent: "#FFD84D",
        "background-light": "#f6f7f8",
        "background-dark": "#111921",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};