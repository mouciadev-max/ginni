/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#B91C1C',
        'primary-light': '#DC2626',
        'primary-dark': '#7F1D1D',
        golden: '#D4A843',
        'golden-light': '#F0D78C',
        'golden-dark': '#B8860B',
        ivory: '#FFF9F0',
        'ivory-dark': '#FFF3E0',
        maroon: '#4A0E0E',
        cream: '#FFFDF7',
        'ginni-bg': '#FFF9F5',
        'ginni-bg-warm': '#FFFAF6',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Dancing Script', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(185, 28, 28, 0.08)',
        'golden': '0 4px 20px rgba(212, 168, 67, 0.25)',
        'golden-lg': '0 10px 40px rgba(212, 168, 67, 0.3)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'red': '0 4px 20px rgba(185, 28, 28, 0.15)',
      },
      backgroundImage: {
        'golden-gradient': 'linear-gradient(135deg, #D4A843 0%, #F0D78C 50%, #D4A843 100%)',
        'red-gradient': 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)',
        'hero-gradient': 'linear-gradient(to right, rgba(74,14,14,0.9) 0%, rgba(185,28,28,0.85) 100%)',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}
