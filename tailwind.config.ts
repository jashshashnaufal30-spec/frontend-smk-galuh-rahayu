import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f2',
          100: '#fde8e8',
          600: '#a81c1c',
          700: '#8b0000',
          800: '#700000',
          900: '#520000',
        },
        gold: {
          500: '#eab308',
          600: '#ca8a04',
        }
      },
    },
  },
  plugins: [],
};
export default config;