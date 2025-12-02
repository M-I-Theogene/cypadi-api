/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        cyp: {
          yellow: "#facc15",
          black: "#000000",
          white: "#ffffff",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(250, 204, 21, 0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
