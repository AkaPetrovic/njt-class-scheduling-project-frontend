import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quicksand: "var(--font-quicksand)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in forwards 0.3s", // 0.5s duration, ease-in timing, forwards fill mode, 1s delay
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["nord"],
  },
};
export default config;
