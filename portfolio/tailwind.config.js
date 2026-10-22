/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary':   '#050605',
        'bg-secondary': '#0A0C0A',
        'bg-card':      '#111411',
        'bg-elevated':  '#151A15',

        // Accents
        'green-primary':   '#7CFF6B',
        'green-secondary': '#4ADE80',

        // Text
        'text-primary':   '#F5F7F4',
        'text-secondary': '#A1A8A0',
        'text-muted':     '#707770',

        // Borders
        'border-subtle': 'rgba(255, 255, 255, 0.10)',
        'border-green':  'rgba(124, 255, 107, 0.25)',
      },

      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"',         'sans-serif'],
      },

      fontSize: {
        'hero':    ['clamp(56px, 6vw, 72px)', { lineHeight: '1.05' }],
        'section': ['clamp(40px, 4vw, 48px)', { lineHeight: '1.1'  }],
        'card':    ['clamp(18px, 2vw, 24px)', { lineHeight: '1.3'  }],
        'body-lg': ['18px', { lineHeight: '1.7' }],
        'body':    ['16px', { lineHeight: '1.7' }],
        'body-sm': ['15px', { lineHeight: '1.7' }],
        'label':   ['13px', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },

      borderRadius: {
        'glass':    '16px',
        'glass-lg': '24px',
      },

      backdropBlur: {
        'glass': '12px',
      },

      boxShadow: {
        'glass':         '0 4px 24px rgba(0, 0, 0, 0.4)',
        'green-glow':    '0 0 24px rgba(124, 255, 107, 0.15)',
        'green-glow-lg': '0 0 48px rgba(124, 255, 107, 0.20)',
        'card-hover':    '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(124, 255, 107, 0.10)',
      },

      animation: {
        'fade-up':    'fadeUp 0.4s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
