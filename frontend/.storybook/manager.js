import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming/create'

const theme = create({
  base: 'light',
  brandTitle: 'WSAP Design System',
  brandUrl: '/',
  brandImage: undefined,
  brandTarget: '_self',
  
  colorPrimary: '#2563eb',
  colorSecondary: '#64748b',
  
  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,
  
  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"Fira Code", Monaco, "Cascadia Code", "Roboto Mono", monospace',
  
  // Text colors
  textColor: '#1e293b',
  textInverseColor: '#ffffff',
  
  // Toolbar default and active colors
  barTextColor: '#64748b',
  barSelectedColor: '#2563eb',
  barBg: '#f8fafc',
  
  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#1e293b',
  inputBorderRadius: 6,
})

addons.setConfig({
  theme,
  panelPosition: 'bottom',
  selectedPanel: 'storybook/controls/panel',
  initialActive: 'sidebar',
}) 