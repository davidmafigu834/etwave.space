import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './resources/**/*.{js,jsx,ts,tsx,vue,php}',
    './storage/framework/views/*.php',
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255,255,255,0.05)',
        glassBorder: 'rgba(255,255,255,0.10)'
      },
      boxShadow: {
        glass: '0 4px 10px -4px rgba(0,0,0,0.4)',
        glowBlue: '0 10px 25px -15px rgba(59,130,246,0.9)'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.glass-card': {
          backgroundColor: theme('colors.glass') as string,
          border: `1px solid ${theme('colors.glassBorder')}`,
          color: theme('colors.slate.100') as string,
          boxShadow: theme('boxShadow.glass') as string,
          borderRadius: theme('borderRadius.lg') as string,
        },
      })
    })
  ]
}

export default config
