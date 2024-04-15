/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      backgroundImage: {
        'sunny': "url('/path/to/sunny-image.jpg')",
        'rainy': "url('/path/to/rainy-image.jpg')",
        'cloudy': "url('/path/to/cloudy-image.jpg')",
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
