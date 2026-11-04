import type { Config } from "tailwindcss";
// @ts-expect-error - nativewind/preset types are provided at runtime
import nativewindPreset from "nativewind/preset";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F15C22",
          hover: "#D94A14",
          light: "#FFF0EA",
        },
        background: {
          warm: "#FAF7F2",
          card: "#FFFFFF",
        },
        miumiu: {
          bg: "#FFFBEA",
          border: "#FDE68A",
          text: "#92400E",
        },
        text: {
          main: "#1F2937",
          muted: "#6B7280",
          light: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["BeVietnamPro_400Regular", "sans-serif"],
        medium: ["BeVietnamPro_500Medium", "sans-serif"],
        semibold: ["BeVietnamPro_600SemiBold", "sans-serif"],
        bold: ["BeVietnamPro_700Bold", "sans-serif"],
        extrabold: ["BeVietnamPro_800ExtraBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
