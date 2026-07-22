import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Brand palette (descriptive names)
          'royal-blue': '#162660',
          'powder-blue': '#D0E6FD',
          'burgundy': '#800020',
          'warm-stone': '#E8E5DF',
          'off-white': '#F8FAFC',
          'charcoal': '#1E293B',
          'slate-gray': '#64748B',

          // Semantic aliases used across components
          'primary': '#162660',
          'sky': '#D0E6FD',
          'navy': '#1E293B',
          'slate': '#64748B',
          'gray': '#E2E8F0',
          'light-gray': '#F8FAFC',
          'dark-gray': '#334155',
          'card-bg': '#FFFFFF',
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#800020',
        },
        status: {
          success: '#10B981',
          error: '#800020',
          warning: '#F59E0B',
          info: '#162660',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        serif: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        wordmark: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        tagline: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
