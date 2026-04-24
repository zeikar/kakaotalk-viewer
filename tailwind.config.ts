import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kakao: {
          yellow: "#FEE500",
          bg: "#abc1d1",
          timestamp: "#92a4b2",
          ink: "#2e363e",
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
