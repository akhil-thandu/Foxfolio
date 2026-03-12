import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0D0D12",
          surface: "#13131A",
          raised: "#1C1C26",
        },
        border: {
          subtle: "#2D2D3D",
        },
        accent: {
          violet: "#7B4FFF",
          cyan: "#00E5FF",
        },
        profit: "#00C805",
        loss: "#FF3B30",
        text: {
          primary: "#F0F0FF",
          secondary: "#7070A0",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
