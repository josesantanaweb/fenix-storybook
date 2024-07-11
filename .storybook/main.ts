import type { StorybookConfig } from '@storybook/nextjs'
import { themes } from '@storybook/theming'

export const parameters = {
  darkMode: {
    dark: { ...themes.dark },
    light: { ...themes.light },
    current: 'dark',
  },
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-backgrounds',
    'storybook-dark-mode/register',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['..\\public'],
}
export default config
