/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14162B",       // near-black indigo, primary text/background
        canvas: "#F7F5F0",    // warm off-white page background
        signal: "#FF6A3D",    // amber-orange accent (progress, CTAs, badges)
        moss: "#2F6D4F",      // deep green for success/completed states
        slate: "#5B5E73",     // muted secondary text
        line: "#E4E1D8",      // hairline borders
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
