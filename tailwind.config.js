/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        'primary-dark': '#EA580C',
        secondary: '#0F172A',
        'secondary-light': '#1E293B',
        'accent-green': '#10B981',
        'accent-red': '#EF4444',
        'accent-blue': '#3B82F6',
      }
    },
  },
  plugins: [],
}
