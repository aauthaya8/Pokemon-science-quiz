/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kidPrimary: "#FF8A65",
        kidAccent: "#4FC3F7",
        kidLeaf: "#9CCC65",
      },
      borderRadius: {
        chunky: "1.25rem",
      },
      boxShadow: {
        chunky: "0 4px 0 rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};
