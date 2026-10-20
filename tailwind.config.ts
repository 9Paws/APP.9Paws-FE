import type { Config } from "tailwindcss";
// @ts-expect-error - nativewind/preset types are provided at runtime
import nativewindPreset from "nativewind/preset";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewindPreset],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
