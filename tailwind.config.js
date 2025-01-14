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
      },
    },
  },
  plugins: [],
};
