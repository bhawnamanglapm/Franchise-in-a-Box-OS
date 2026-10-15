/** Design tokens from the Scale100x brief. Use these names, never Tailwind's default greys. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        card: '#111118',
        line: '#23232D',
        muted: '#8B8B9A',
        ink: '#ECECF1',
        accent: '#2563EB',
        success: '#10B981',
        alert: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
}
