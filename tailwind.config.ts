import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#12131A",
        paper: "#EFEEF3",
        card: "#FFFFFF",
        highlighter: "#FFDE59",
        cobalt: "#2E4A9E",
        slate: "#6B6B78",
        meadow: "#25B47D",
        line: "#DAD8E0",
        danger: "#B4321A",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-serif", "Georgia", "serif"],
      },
      borderRadius: {
        input: "8px",
        button: "10px",
        card: "16px",
      },
      boxShadow: {
        paper: "0 12px 32px -18px rgba(18,19,26,0.18), 0 1px 0 rgba(18,19,26,0.04)",
        focus: "0 0 0 3px rgba(46,74,158,0.22)",
      },
      letterSpacing: {
        tightish: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
