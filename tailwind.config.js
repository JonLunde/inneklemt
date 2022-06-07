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
        600: "#1C2A68",
        700: "#08113C",
        800: "#000312",
      },
      secondary: {
        // 400: "#FFD340",
        500: "#ffc229",
        600: "#F97E19",
      },
      gray: {
        400: "#F2F2F2",
        500: "#ECECEC",
        // 600: "#D8D8D8",
      },
      transparent: "transparent",
      inherit: "inherit",
    },
    // fontFamily: {
    //   sans: ['Graphik', 'sans-serif'],
    //   serif: ['Merriweather', 'serif'],
    // },

    extend: {
      // colors: {
      //   purple: {
      //     1000: "#000",
      //   },
      // },
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
