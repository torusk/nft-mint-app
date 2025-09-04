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
          blue: '#3498db',
          green: '#2ecc71',
          gray: '#f7f9fc',
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
