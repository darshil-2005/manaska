/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        manaska: {
          light: "#E8EAF6",
          base: "#5B4BDF",
          dark: "#3D3A9B",
          accent: "#9D7AF2",
          gradientStart: "#6366F1",
          gradientEnd: "#8B5CF6",
        },
      },
    },
  },
  plugins: [],
};
