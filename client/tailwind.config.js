// client/tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teepopPink: '#ff4fb8',
        teepopBlue: '#35d6ff',
        teepopPurple: '#6b38ff',
        teepopYellow: '#ffd84d',
        teepopCream: '#fff8ef',
        teepopInk: '#25154a',
      },
      boxShadow: {
        pop: '0 16px 45px rgba(107, 56, 255, 0.18)',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
