const path = require('path');

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: path.resolve(__dirname, '../vite.config.ts'),
      },
    },
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
      componentNameResolver: (exp, source) => 
        exp.getName && exp.getName() !== 'default' ? exp.getName() : undefined,
    },
  },
  viteFinal: async (config) => {
    // Tailwind CSS 지원
    config.css = config.css || {}
    config.css.postcss = {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    }
    
    // 별칭 설정
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    }
    
    // 성능 최적화
    config.build = config.build || {}
    config.build.rollupOptions = config.build.rollupOptions || {}
    config.build.rollupOptions.output = {
      ...config.build.rollupOptions.output,
      manualChunks: {
        vendor: ['react', 'react-dom'],
        storybook: ['@storybook/react', '@storybook/addon-essentials'],
      },
    }
    
    // 개발 서버 설정
    config.server = config.server || {}
    config.server.hmr = {
      overlay: false,
    }
    
    return config
  },
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
  },
  features: {
    interactionsDebugger: true,
    buildStoriesJson: true,
  },
}

export default config 