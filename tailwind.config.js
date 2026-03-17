/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f4f3"
      },
      boxShadow: {
        report: "0 20px 45px -30px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};
