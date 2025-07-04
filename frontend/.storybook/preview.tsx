import React from 'react'
import '../src/index.css'
import { designTokens } from '../src/constants/design-tokens'
import { Preview } from '@storybook/react'

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  parameters: {
    actions: { 
      argTypesRegex: '^on[A-Z].*',
      handles: ['mouseover', 'click', 'focus', 'blur'],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'brand',
          value: designTokens.colors.primary.main,
        },
        {
          name: 'neutral',
          value: '#f8fafc',
        },
        {
          name: 'gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        wide: {
          name: 'Wide Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    docs: {
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3',
        ignoreSelector: '#primary',
        title: 'Table of Contents',
        disable: false,
      },
    },
    options: {
      storySort: {
        order: [
          'Design System',
          ['Welcome', 'Colors', 'Typography', 'Spacing', 'Components'],
          'Components',
          ['Basic', 'Forms', 'Layout', 'Navigation', 'Feedback'],
          'Pages',
          'Examples',
        ],
      },
    },
    tags: ['autodocs'],
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light Theme' },
          { value: 'dark', title: 'Dark Theme' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'ko',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'ko', title: '한국어' },
          { value: 'en', title: 'English' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // 테마 적용
      const theme = context.globals.theme || 'light'
      const className = theme === 'dark' ? 'dark' : ''
      
      return (
        <div className={`${className} min-h-screen bg-background text-foreground`}>
          <Story />
        </div>
      )
    },
  ],
}

export default preview 