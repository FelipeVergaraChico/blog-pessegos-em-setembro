import type {Config} from 'tailwindcss'

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF0DB",
        coffee: "#3D2F2A",
        peach: "#E89A7D",
        wine: "#6B3E4A",
        sage: "#7A8B6F",
        beige: "#D7C8BC",
        terracotta: "#D87B58",
        night: "#6f4e3739",
        surface: "#2A2422",
        paper: "#F3ECE6",
        rosewine: "#B86A7A",
        nightsage: "#92A887",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        card: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config
