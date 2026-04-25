import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F5EA",
        cream: "#FFF8EC",
        green: "#2F6B4F",
        olive: "#6B7D3C",
        pistachio: "#A8C686",
        mint: "#DDEAD1",
        caramel: "#C9822B",
        honey: "#E7A83E",
        chocolate: "#3A2114",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(47, 107, 79, 0.15)",
        soft: "0 4px 20px -5px rgba(0, 0, 0, 0.05)",
        green: "0 8px 25px -8px rgba(47, 107, 79, 0.3)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
