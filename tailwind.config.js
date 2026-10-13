/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#493653',
          primary: '#493653',
          deep: '#33263B',
          dark: '#271C2E',
          surface: '#3D2D46',
          highlight: '#574263',
          light: '#654C72',
          subtle: '#F3EEF5',
        },
        ivory: {
          page: '#F6F2E9',
          card: '#FFFEFA',
          light: '#FBF9F4',
          muted: '#EFE9DC',
          hover: '#F2ECE0',
        },
        terracotta: {
          DEFAULT: '#C87555',
          dark: '#AF5F41',
          light: '#DA8A6D',
          subtle: '#FAF0EB',
        },
        sage: {
          DEFAULT: '#DCE6D7',
          light: '#EDF3EA',
          dark: '#4A7145',
          text: '#2F542A',
        },
        ink: {
          main: '#252923',
          secondary: '#77786F',
          muted: '#9E9F96',
          light: '#C2C3BC',
        },
        edge: {
          DEFAULT: '#E5E0D5',
          dark: '#D5CFC2',
          light: '#EFECE4',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(51, 38, 59, 0.04)',
        'card': '0 4px 20px -2px rgba(51, 38, 59, 0.05)',
        'modal': '0 20px 40px -8px rgba(51, 38, 59, 0.2)',
        'dropdown': '0 10px 25px -4px rgba(51, 38, 59, 0.12)',
      }
    },
  },
  plugins: [],
}
