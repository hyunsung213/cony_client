module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          olive: "#818807",
          blue: "#6CA2E8",
          orange: "#F28B0C",
          deepOrange: "#F2600C",
          red: "#D9310B",
        },
      },
    },
  },
  plugins: [],
};
