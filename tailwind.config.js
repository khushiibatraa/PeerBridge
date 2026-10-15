/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Original vibrant purple primary
          700: '#4338CA', // Purple hover
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#4F46E5',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          DEFAULT: '#4F46E5',
        },
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          DEFAULT: '#0F172A',
        },
        softBlue: {
          DEFAULT: '#EFF6FF',
          hover: '#DBEAFE',
          50: '#F0F7FF',
          100: '#EFF6FF',
          200: '#BFDBFE',
        },
        offWhite: {
          DEFAULT: '#F8FAFC',
          50: '#FBFBFE',
          100: '#F8FAFC',
          200: '#F1F5F9',
        },
        pastel: {
          blueBg: '#EFF6FF',
          blueBorder: '#BFDBFE',
          blueText: '#1E40AF',
          purpleBg: '#FAF5FF',
          purpleBorder: '#E9D5FF',
          purpleText: '#6B21A8',
          amberBg: '#FFFBEB',
          amberBorder: '#FDE68A',
          amberText: '#92400E',
          greenBg: '#ECFDF5',
          greenBorder: '#A7F3D0',
          greenText: '#065F46',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
