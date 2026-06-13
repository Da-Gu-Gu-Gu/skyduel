/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: "#ff006e",
        purple: "#8338ec",
        white: "#fff",
        black: "#000",
        dark: "#14213d",
        orange: "#ff7e67",
        danger: "#e63946",
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
