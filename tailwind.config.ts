import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF5F6D",   // rosa-coral RadioBobba 🔥
        secondary: "#FFC371", // naranja suavecito
      },
    },
  },
  plugins: [],
};
export default config;