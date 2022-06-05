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
      //   purple: {
      //     50: '#000',
      //     100: '#000',
      //     200: '#000',
      //     300: '#000',
      //     400: '#000',
      //     500: '#000',
      //     600: '#000',
      //     700: '#000',
      //     800: '#000',
      //     900: '#000',
      //   },
      // },
      testColor: {
        100: "#FFFFE6",
        // 100: "#FFFFE6",
        200: "#EBFFB7",
        300: "#CDEE77",
        400: "#B2DD44",
        // 500: "#9ACC1C",
        500: "#58cd36",
        600: "#89AA33",
        700: "#63801A",
        800: "#354707",
        900: "#171F03",
        1000: "#0F1401",
      },
      testColor2: {
        100: "#FFFFE6",
        // 100: "#FFFFE6",
        200: "#EBFFB7",
        300: "#CDEE77",
        400: "#B2DD44",
        // 500: "#9ACC1C",
        500: "#58cd36",
        600: "#89AA33",
        700: "#63801A",
        800: "#354707",
        900: "#171F03",
        1000: "#0F1401",
      },
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
