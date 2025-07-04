/**
 * 디자인 토큰 정의
 * 디자인 시스템의 핵심 값들을 TypeScript 상수로 정의
 */

export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // Main Brand Color
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    // 접근성을 위한 별칭
    light: '#60a5fa',
    main: '#2563eb',
    dark: '#1e40af',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    // 접근성을 위한 별칭
    light: '#94a3b8',
    main: '#64748b',
    dark: '#334155',
  },
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    // 접근성을 위한 별칭
    light: '#fb923c',
    main: '#f97316',
    dark: '#c2410c',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    // 접근성을 위한 별칭
    light: '#e5e7eb',
    medium: '#9ca3af',
    dark: '#374151',
  },
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      // 접근성을 위한 별칭
      light: '#86efac',
      main: '#22c55e',
      dark: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      // 접근성을 위한 별칭
      light: '#fcd34d',
      main: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      // 접근성을 위한 별칭
      light: '#fca5a5',
      main: '#ef4444',
      dark: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      // 접근성을 위한 별칭
      light: '#93c5fd',
      main: '#3b82f6',
      dark: '#1d4ed8',
    },
  },
  // AI 특화 컬러
  aiGradient: {
    from: '#667eea',
    to: '#764ba2',
  },
  workflowAccent: '#ff9800',
  chatUser: '#2563eb',
  chatAssistant: '#f1f5f9',
} as const

export const typography = {
  fontFamily: {
    primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
  },
  fontSize: {
    h1: '2.5rem',      // 40px
    h2: '2rem',        // 32px
    h3: '1.5rem',      // 24px
    h4: '1.25rem',     // 20px
    h5: '1.125rem',    // 18px
    h6: '1rem',        // 16px
    large: '1.125rem', // 18px
    base: '1rem',      // 16px
    small: '0.875rem', // 14px
    extraSmall: '0.75rem', // 12px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '5rem',   // 80px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

export const fontSize = {
  xs: ['0.75rem', '1rem'],     // 12px
  sm: ['0.875rem', '1.25rem'], // 14px
  base: ['1rem', '1.5rem'],    // 16px
  lg: ['1.125rem', '1.75rem'], // 18px
  xl: ['1.25rem', '1.75rem'],  // 20px
  '2xl': ['1.5rem', '2rem'],   // 24px
  '3xl': ['1.875rem', '2.25rem'], // 30px
  '4xl': ['2.25rem', '2.5rem'],   // 36px
  '5xl': ['3rem', '1'],           // 48px
} as const

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const

export const zIndex = {
  dropdown: 1000,
  modal: 1050,
  popover: 1100,
  tooltip: 1200,
  overlay: 1300,
} as const

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const

// 컴포넌트별 스타일 토큰
export const componentTokens = {
  button: {
    borderRadius: borderRadius.md,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    transition: transitions.fast,
  },
  input: {
    borderRadius: borderRadius.md,
    fontSize: fontSize.base,
    padding: `${spacing.sm} ${spacing.md}`,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
} as const

// 통합 export
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  zIndex,
  transitions,
  componentTokens,
} as const 