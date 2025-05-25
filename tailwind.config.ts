import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridRow: {
        'span-2': 'span 2 / span 2',
      },
      // gridTemplateColumns: {
      //   'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
      // },
      // backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic':
      //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
    },
    variants:{
      backgroundColor:['responsive','hover','focus','active']
    },
  },
  plugins: [],
}
export default config