/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dlw: {
          black: "var(--dlw-black)",
          charcoal: "var(--dlw-charcoal)",
          metal: "var(--dlw-metal)",
          silver: "var(--dlw-silver)",
          red: "var(--dlw-red)",
          white: "var(--dlw-white)",
        },
      },
      boxShadow: {
        "dlw-red": "0 0 40px -8px var(--dlw-red-glow)",
        "dlw-chrome": "0 0 60px -12px rgba(192, 192, 192, 0.45)",
        "dlw-glass": "0 24px 80px -32px rgba(0, 0, 0, 0.85)",
      },
      backgroundImage: {
        "dlw-metal": "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(120,120,128,0.08) 40%, rgba(255,255,255,0.06) 100%)",
        "dlw-carbon":
          "repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 6px)",
        "dlw-hero": "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(ellipse 60% 40% at 85% 80%, rgba(255,0,0,0.12), transparent 50%), linear-gradient(180deg, #0c0c0e 0%, #050506 45%, #030303 100%)",
      },
      animation: {
        "dlw-glow": "dlw-glow 3s ease-in-out infinite",
        "dlw-shine": "dlw-shine 4s ease-in-out infinite",
      },
      keyframes: {
        "dlw-glow": {
          "0%, 100%": { opacity: "0.55", filter: "blur(12px)" },
          "50%": { opacity: "0.9", filter: "blur(16px)" },
        },
        "dlw-shine": {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
      },
    },
  },
  plugins: [],
};
