import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — deep forest green
        primary: {
          50:  '#f0f7f3',
          100: '#d9ede1',
          200: '#b4dbc5',
          300: '#82c1a0',
          400: '#50a07b',
          500: '#2e845f',
          600: '#1e6a4a',
          700: '#185539',
          800: '#15432d',
          900: '#123726',
          950: '#0a2017',
        },
        // Accent — warm amber/gold
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Neutral — warm stone (not cold gray)
        stone: {
          50:  '#faf9f7',
          100: '#f4f2ee',
          200: '#e8e3db',
          300: '#d6cfc4',
          400: '#b8ae9e',
          500: '#9a8e7d',
          600: '#7d7265',
          700: '#665e52',
          800: '#534c42',
          900: '#433e36',
          950: '#2a2621',
        },
        // Background tokens
        bg: {
          base: '#faf9f7',    // warm off-white page background
          muted: '#f4f2ee',   // cards, sidebar
          subtle: '#e8e3db',  // borders, dividers
        },
        // Status colors
        status: {
          new:        '#3b82f6',
          pending:    '#f59e0b',
          review:     '#8b5cf6',
          approved:   '#10b981',
          rejected:   '#ef4444',
          published:  '#059669',
          occupied:   '#6b7280',
          available:  '#10b981',
          coming:     '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 8px 25px -5px rgb(0 0 0 / 0.10), 0 4px 10px -6px rgb(0 0 0 / 0.08)',
        'md-green': '0 4px 14px 0 rgb(30 106 74 / 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}

export default config
