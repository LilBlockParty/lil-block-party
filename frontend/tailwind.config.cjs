/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Londrina Solid", ...fontFamily.sans],
        balsamiq: ["Balsamiq", ...fontFamily.sans],
      },
      keyframes: {
        infiniteScroll: {
          "0%": { transform: "translate(100%, 0)" },
          "100%": { transform: "translate(-106%, 0)" },
        },
      },
      animation: {
        infiniteScroll: "infiniteScroll 12s linear infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
