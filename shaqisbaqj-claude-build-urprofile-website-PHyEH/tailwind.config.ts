import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: "#C4622D",
        cream: "#F5F0E8",
        dark: "#1C1A18",
        sand: "#C9B99A",
        linen: "#E0D4C0",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "390px",
      },
    },
  },
  plugins: [],
};
export default config;
