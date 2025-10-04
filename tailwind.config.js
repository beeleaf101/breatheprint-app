/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'air-clean': '#10b981',
        'air-moderate': '#fbbf24',
        'air-unhealthy': '#f97316',
        'air-hazardous': '#ef4444',
      },
    },
  },
  plugins: [],
}