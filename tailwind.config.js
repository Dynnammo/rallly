const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        huge: "0px 51px 78px rgb(17 7 53 / 5%), 0px 21.3066px 35.4944px rgb(17 7 53 / 4%), 0px 11.3915px 18.9418px rgb(17 7 53 / 3%), 0px 6.38599px 9.8801px rgb(17 7 53 / 3%), 0px 3.39155px 4.58665px rgb(17 7 53 / 2%), 0px 1.4113px 1.55262px rgb(17 7 53 / 1%), inset 0px 1px 0px rgb(41 56 78 / 5%)",
      },
      colors: {
        primary: colors.indigo,
      },
      screens: {
        xs: "375px",
        mobile: { max: "640px" },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      keyframes: {
        goDown: {
          "0%, 100%": { transform: "translateY(-2px)" },
          50: { transform: "translateY(0)" },
        },
      },
      ringColor: colors.indigo["500"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
    require("tailwindcss-writing-mode"),
  ],
};
