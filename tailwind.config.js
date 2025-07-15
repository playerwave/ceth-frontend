export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["pt-sans", "sans-serif"], // ✅ override font-sans
      },
    },
  },
  plugins: [],
};

// module.exports = {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['"PT Sans"', "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// };
