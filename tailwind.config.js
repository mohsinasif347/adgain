/** @type {import('tailwindcss').Config} */
module.exports = {
  // Dark mode ko class ke zariye handle karne ke liye
  darkMode: 'class', 
  
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  
  theme: {
    extend: {
      colors: {
        // Dashboard ka asli dark background
        'dark-bg': '#0b1120',
        
        // Cards ke liye dark color
        'dark-card': '#161e2d',
        
        // Primary Blue Palette (Balance card ke liye)
        'primary': {
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Earning Green Palette (Ads aur Profit ke liye)
        'earning': {
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        
        // Reward Purple Palette (Levels aur History ke liye)
        'reward': {
          500: '#8b5cf6',
          600: '#7c3aed',
          900: '#4c1d95',
        }
      },
      // Agar koi custom animation add karni ho to yahan kar sakte hain
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};