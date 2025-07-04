/** @type {import('tailwindcss').Config} */
import { designTokens } from './src/constants/design-tokens'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러
        primary: designTokens.colors.primary,
        secondary: designTokens.colors.secondary,
        accent: designTokens.colors.accent,
        neutral: designTokens.colors.neutral,
        semantic: designTokens.colors.semantic,
        
        // AI 그라데이션
        'ai-gradient': {
          from: '#667eea',
          to: '#764ba2',
        },
        
        // 추가 시맨틱 컬러
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: designTokens.colors.primary.main,
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      
      fontFamily: {
        sans: designTokens.typography.fontFamily.primary,
        mono: designTokens.typography.fontFamily.mono,
      },
      
      fontSize: {
        'h1': [designTokens.typography.fontSize.h1, { lineHeight: designTokens.typography.lineHeight.tight }],
        'h2': [designTokens.typography.fontSize.h2, { lineHeight: designTokens.typography.lineHeight.tight }],
        'h3': [designTokens.typography.fontSize.h3, { lineHeight: designTokens.typography.lineHeight.tight }],
        'h4': [designTokens.typography.fontSize.h4, { lineHeight: designTokens.typography.lineHeight.tight }],
        'h5': [designTokens.typography.fontSize.h5, { lineHeight: designTokens.typography.lineHeight.tight }],
        'h6': [designTokens.typography.fontSize.h6, { lineHeight: designTokens.typography.lineHeight.tight }],
        'body-lg': [designTokens.typography.fontSize.large, { lineHeight: designTokens.typography.lineHeight.normal }],
        'body': [designTokens.typography.fontSize.base, { lineHeight: designTokens.typography.lineHeight.normal }],
        'body-sm': [designTokens.typography.fontSize.small, { lineHeight: designTokens.typography.lineHeight.normal }],
        'caption': [designTokens.typography.fontSize.extraSmall, { lineHeight: designTokens.typography.lineHeight.relaxed }],
      },
      
      spacing: {
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
        '6.5': '1.625rem', // 26px
        '7.5': '1.875rem', // 30px
        '8.5': '2.125rem', // 34px
        '9.5': '2.375rem', // 38px
        '15': '3.75rem',   // 60px
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
        '26': '6.5rem',    // 104px
        '30': '7.5rem',    // 120px
      },
      
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      
      borderRadius: {
        'xs': '0.125rem',  // 2px
        'sm': '0.25rem',   // 4px
        'md': '0.375rem',  // 6px
        'lg': '0.5rem',    // 8px
        'xl': '0.75rem',   // 12px
        '2xl': '1rem',     // 16px
        '3xl': '1.5rem',   // 24px
      },
      
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glow': '0 0 20px rgb(37 99 235 / 0.3)',
        'ai-glow': '0 0 30px rgb(102 126 234 / 0.4)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-gentle': 'pulseGentle 2s infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: 'currentColor' },
        },
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ai-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'hero-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      },
      
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [
    // 타이포그래피 플러그인
    require('@tailwindcss/typography'),
    
    // 폼 플러그인
    require('@tailwindcss/forms'),
    
    // 애스펙트 레이시오 플러그인
    require('@tailwindcss/aspect-ratio'),
    
    // 커스텀 컴포넌트 플러그인
    function({ addComponents, theme }) {
      addComponents({
        '.btn': {
          padding: theme('spacing.2') + ' ' + theme('spacing.4'),
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          textAlign: 'center',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 2px ' + theme('colors.primary.main') + '40',
          },
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.main'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.primary.dark'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.secondary.main'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.secondary.dark'),
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          color: theme('colors.primary.main'),
          border: '1px solid ' + theme('colors.primary.main'),
          '&:hover': {
            backgroundColor: theme('colors.primary.main'),
            color: theme('colors.white'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.md'),
          padding: theme('spacing.6'),
          border: '1px solid ' + theme('colors.neutral.light'),
        },
        '.input': {
          width: '100%',
          padding: theme('spacing.3'),
          borderRadius: theme('borderRadius.md'),
          border: '1px solid ' + theme('colors.neutral.light'),
          fontSize: theme('fontSize.body'),
          lineHeight: theme('lineHeight.normal'),
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.main'),
            boxShadow: '0 0 0 2px ' + theme('colors.primary.main') + '20',
          },
        },
      })
    },
    
    // 유틸리티 플러그인
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      })
    },
  ],
}
