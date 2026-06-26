import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F5C100",
          black: "#0A0A0A",
          white: "#FFFFFF",
          gray: "#1A1A1A",
          muted: "#6B6B6B",
        },
      },
    },
  },
};

export default config;
