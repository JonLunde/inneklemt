module.exports = {
  // mode: 'jit',
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: {
        200: "#F6FBFF",
        300: "#D1E9FF",
        400: "#A4D5FF",
        500: "#74BEFF",
        600: "#21317A",
        700: "#08113C",
        800: "#000312",
      },
      secondary: {
        400: "#FFD340",
        500: "#ffc229",
        600: "#F98526",
        700: "#BB4A00",
        800: "#752E00",
        900: "#2A1000",
      },
      gray: {
        400: "#F2F2F2",
        500: "#ECECEC",
        600: "#D8D8D8",
        700: "#696969",
        800: "#383838",
      },
      transparent: "transparent",
      inherit: "inherit",
    },
    // fontFamily: {
    //   sans: ['Graphik', 'sans-serif'],
    //   serif: ['Merriweather', 'serif'],
    // },

    extend: {
      screens: { sm: "600px" },
      spacing: {
        100: "25rem",
        120: "30rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
