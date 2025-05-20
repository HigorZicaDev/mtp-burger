/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        home: "url('https://raw.githubusercontent.com/HigorZicaDev/mtp-burger/refs/heads/main/assets/bg.png')",
      },
    },
  },
  plugins: [],
};
