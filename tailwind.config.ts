import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#111111",
        sidebar: "#161616", 
        border: "#232323",
        card: "#1a1a1a",
        muted: "#404040"
      },
    },
  },
  plugins: [],
};
export default config;