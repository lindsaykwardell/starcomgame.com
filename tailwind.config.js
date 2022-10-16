module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,mdx,md,elm}"],
  theme: {
    extend: {
      fontFamily: {
        megrim: ["Megrim", "serif"],
        raleway: ["Raleway", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "white",
            strong: {
              color: "white",
            },
            a: {
              color: "white",
              "&:hover": {
                color: "white",
              },
            },
            blockquote: {
              color: "white",
            },
            code: {
              color: "white",
            },
            h1: {
              color: "white",
              fontFamily: "Megrim, serif"
            },
            h2: {
              color: "white",
              fontFamily: "Megrim, serif"
            },
            h3: {
              color: "white",
              fontFamily: "Megrim, serif"
            },
            h4: {
              color: "white",
              fontFamily: "Megrim, serif"
            },
            h5: {
              color: "white",
            },
            h6: {
              color: "white",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
