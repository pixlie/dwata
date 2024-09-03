/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: [
          "Source Serif 4 Variable",
          ...defaultTheme.fontFamily.serif,
        ],
        sans: [
          "Manrope Variable",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
