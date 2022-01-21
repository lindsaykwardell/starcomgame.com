module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,mdx,md}"],
  theme: {
    extend: {
      fontFamily: {
        megrim: ["Megrim", "serif"],
        raleway: ["Raleway", "serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
