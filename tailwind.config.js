/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0d0b',
        surface: '#171813',
        'surface-2': '#1f201a',
        'surface-3': '#262821',
        border: 'rgba(214,191,120,0.10)',
        text: '#f3efe4',
        'text-muted': '#b2ab97',
        'text-faint': '#7f7868',
        accent: '#e8b24c',
        'accent-strong': '#c9952f',
        'accent-ink': '#241805',
        positive: '#2fa561',
        negative: '#d06d62',
      },
      borderRadius: {
        pill: '999px',
        card: '16px',
        panel: '20px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.22)',
      },
    },
  },
  plugins: [],
};
