/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d1117",
        surface: "#161b22",
        surfaceBorder: "#30363d",
        primary: "#58a6ff",
        accent: "#79c0ff",
        stackFrame: "#1f242d",
        heapObject: "#1a2234"
      },
    },
  },
  plugins: [],
};
