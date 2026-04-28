/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kidPrimary: "#FF8A65",
        kidAccent: "#4FC3F7",
        kidLeaf: "#9CCC65",
        kidInk: "#0f172a",
        kidParchment: "#fffaf0",
      },
      borderRadius: {
        chunky: "1.25rem",
        rpg: "0.375rem",
      },
      boxShadow: {
        chunky: "0 4px 0 rgba(0,0,0,0.15)",
        rpg: "3px 3px 0 #0f172a",
        "rpg-sm": "2px 2px 0 #0f172a",
        "rpg-lg": "4px 4px 0 #0f172a",
      },
      fontFamily: {
        mono: ['"Courier New"', "Courier", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
