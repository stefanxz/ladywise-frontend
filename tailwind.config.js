/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: "#A45A6B",
      },
    },
    fontFamily: {
      "inter-regular": "Inter_400Regular",
      "inter-semibold": "Inter_600Bold",
      "aclonica-regular": "Aclonica_400Regular",
    },
  },
  plugins: [],
};
