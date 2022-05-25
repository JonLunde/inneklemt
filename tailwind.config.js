module.exports = {
  // mode: 'jit',
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // colors: {
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
    extend: {
      colors: {
        purple: {
          1000: '#000',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
