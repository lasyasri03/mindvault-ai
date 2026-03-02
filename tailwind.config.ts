import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        ink: "var(--color-ink)",
        accent: "var(--color-accent)",
        mellow: "var(--color-mellow)"
      },
      boxShadow: {
        card: "0 12px 40px -20px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
