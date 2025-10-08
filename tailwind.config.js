/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#FFFFFF',
          secondary: '#F3F4F6',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        brand: {
          DEFAULT: '#3b82f6',
          light: '#93c5fd',
        },
        pinkShades: {
          dustyRose: '#A45A6B'
        },
      },
    fontFamily: {
        heading: ['Poppins_700Bold'],
        body: ['Poppins_400Regular'],
      },
    },
  },
  plugins: [],
}


// //custom color 'Dusty-Rose': '#A45A6B'
