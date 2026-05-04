/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        royal: {
          950: "#0F2060",
          900: "#1E3A8A",
          800: "#1E40AF",
          700: "#2563EB",
          600: "#3B82F6",
          100: "#DBEAFE",
          50:  "#EFF6FF",
        },
        sand: {
          900: "#7C5C3A",
          700: "#9C7B4A",
          500: "#C4A484",
          300: "#DEC9AE",
          100: "#F4EDE2",
          50:  "#FAF7F2",
        },
        gold: "#B8860B",
      },
      backgroundImage: {
        "geology-gradient": "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
      },
      boxShadow: {
        card:       "0 2px 16px 0 rgba(30,58,138,0.08), 0 1px 4px 0 rgba(0,0,0,0.04)",
        "card-md":  "0 4px 24px 0 rgba(30,58,138,0.12), 0 1px 6px 0 rgba(0,0,0,0.06)",
        "card-lg":  "0 8px 40px 0 rgba(30,58,138,0.15)",
        royal:      "0 4px 20px 0 rgba(30,58,138,0.25)",
      },
    },
  },
  plugins: [],
};
