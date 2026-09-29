import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10231f",
        pine: "#173f35",
        moss: "#557a68",
        sand: "#f4efe5",
        mist: "#edf3f0",
        copper: "#c9784a"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Arial", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(16,35,31,.10)"
      }
    }
  },
  plugins: []
};

export default config;