/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // background surfaces resolve via CSS variables so light/dark both work
        surface: 'rgb(var(--surface) / <alpha-value>)',
        surfaceMid: 'rgb(var(--surface-mid) / <alpha-value>)',
        surfaceLight: 'rgb(var(--surface-light) / <alpha-value>)',
        textPrimary: 'rgb(var(--text-primary) / <alpha-value>)',
        textSecondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        textTertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
        borderC: 'rgb(var(--border) / <alpha-value>)',
        cmNavy: '#0d1229',
        cmNavyMid: '#141c3d',
        cmNavyLight: '#1f2b57',
        cmBlue: '#3380ff',
        cmGold: '#f2c748',
        cmGoldLight: '#ffe68c',
        cmSafety: '#17d984',
        cmMatch: '#338cff',
        cmReach: '#ff9a1f',
        cmHC: '#f2384e',
        cmTextPrimary: '#ffffff',
        cmTextSecondary: '#d1d9f7',
        cmTextTertiary: '#9fabd1',
        cmBorder: '#42527f',
      },
      borderRadius: {
        xs: '6px', sm: '10px', md: '14px', lg: '20px', xl: '28px',
      },
    },
  },
  plugins: [],
};
