/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      grey: "#d0d0e1",
      newColor: "#0B0E38",
      airdropBackground: "#262c5c",
      progressiveBackground: "#6E1ED2",
      wrongNetworkBackground: "#FF494A",
      linkTextColor: "#7602fa",
      backgroundColor: "#0B0F39",
    },
    screens: {
      xsm: "480px",
      // => @media (min-width: 480px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      xmd: "896px",
      // => @media (min-width: 896px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      lgXl: "1149px",
      // => @media (min-width: 1149px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1680px",
      // => @media (min-width: 1680px) { ... }
    },
    minHeight: {
      screen: "100vh",
      contentHeight: "100vh",
      navbarHeight: "10vh",
    },
  },
  plugins: [],
};
