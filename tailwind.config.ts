import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skysoft: "#BFE8F7",
        cream: "#FFF7E8",
        cream2: "#F7EEDC",
        leaf: "#8BCB77",
        forest: "#4F8A5B",
        watersoft: "#78C7E8",
        sun: "#F7C948",
        orangeSoft: "#F4A259",
        coral: "#F28B82",
        violetSoft: "#A78BFA",
        ink: "#2F2F2F",
        muted: "#6B6B6B",
        line: "#E8D8BC"
      },
      fontFamily: {
        rounded: ["Nunito", "ui-rounded", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 30px rgba(79, 138, 91, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
