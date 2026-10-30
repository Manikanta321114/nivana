import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — Deep Teal (matching NIVASA reference)
        primary: {
          50:  '#f0f8f8',
          100: '#daf0f1',
          200: '#b8e2e5',
          300: '#89ccd2',
          400: '#4fb0bb',
          500: '#1b93a0',
          600: '#0d7683',
          700: '#0a6067', // Core brand deep teal
          800: '#084d53',
          900: '#063f45',
          950: '#03262a',
        },
        // Secondary — Turquoise / Seafoam
        secondary: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Accent — Soft Gold / Warm Amber (luxury highlights)
        accent: {
          50:  '#fdfbf3',
          100: '#faf5e1',
          200: '#f5e9bd',
          300: '#eed890',
          400: '#e5c35f',
          500: '#d79d49', // Core soft gold
          600: '#c58a38',
          700: '#a36d2c',
          800: '#855527',
          900: '#6e4623',
          950: '#3e240f',
        },
        // Warm off-white & cream neutrals (warm stone, no cold gray)
        stone: {
          50:  '#faf9f6', // Page background off-white / cream
          100: '#f5f3ef', // Section background / subtle cards
          200: '#eae6df', // Card borders / dividers
          300: '#d7d0c5',
          400: '#b2a899',
          500: '#918676',
          600: '#756b5d',
          700: '#5d5449',
          800: '#474139',
          900: '#242a2e', // Charcoal text
          950: '#14181b', // Deep charcoal / black
        },
        // Charcoal
        charcoal: {
          DEFAULT: '#1a2024',
          light: '#2e383f',
          dark: '#111619',
        },
        // Background semantic tokens
        bg: {
          base: '#faf9f6',    // Warm off-white page background
          muted: '#f5f3ef',   // Subtle cards, sidebar
          subtle: '#eae6df',  // Dividers, input borders
          white: '#ffffff',
        },
        // Status colors
        status: {
          new:        '#0284c7',
          pending:    '#d97706',
          review:     '#7c3aed',
          approved:   '#0d9488',
          rejected:   '#e11d48',
          published:  '#0a6067',
          occupied:   '#64748b',
          available:  '#0d9488',
          coming:     '#0284c7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card:  '0 2px 10px -2px rgba(10, 96, 103, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -6px rgba(10, 96, 103, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.06)',
        'teal-glow': '0 4px 20px -2px rgba(10, 96, 103, 0.25)',
        'gold-glow': '0 4px 18px -2px rgba(215, 157, 73, 0.30)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
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
