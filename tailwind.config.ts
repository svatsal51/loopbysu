import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1c1815',
        paper: '#fbf8f3',
        shell: '#f3eee6',
        line: '#e6dfd3',
        muted: '#6d645a',
        soft: '#2a2520',
      },
      fontFamily: {
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      maxWidth: {
        content: '1400px',
      },
      boxShadow: {
        // Soft, highly diffused ambient shadows; no hard drops.
        float: '0 1px 2px rgba(28,24,21,0.03), 0 12px 32px -12px rgba(28,24,21,0.10), 0 32px 64px -32px rgba(28,24,21,0.12)',
        lift: '0 2px 4px rgba(28,24,21,0.03), 0 20px 40px -16px rgba(28,24,21,0.14), 0 48px 80px -40px rgba(28,24,21,0.16)',
        inner1: 'inset 0 1px 1px rgba(255,255,255,0.7)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.9s cubic-bezier(0.32,0.72,0,1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
