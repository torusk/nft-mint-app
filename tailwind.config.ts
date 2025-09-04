import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#ffed58',
          mint: '#ccfbe1',
          green: '#a7f3d0'
        },
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
}

export default config
