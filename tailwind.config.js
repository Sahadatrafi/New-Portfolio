const c = (v) => `rgb(var(${v}) / <alpha-value>)`
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { bg: c('--bg'), surface: c('--surface'), ink: c('--ink'), muted: c('--muted'), line: c('--line'), accent: c('--accent') },
      fontFamily: { sans: ['Inter', 'Hind Siliguri', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
