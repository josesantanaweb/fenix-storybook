import '@/src/assets/styles/globals.css';
import '@/src/assets/styles/icons.css';
import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming';
import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';


const lightTheme = create({
  base: 'light',
  brandTitle: 'Fenix Finance',
  brandUrl: 'https://www.fenixfinance.io/',
  brandImage: 'https://path-to-your-logo.png',
});

const darkTheme = create({
  base: 'dark',
  brandTitle: 'Fenix Finance',
  brandUrl: 'https://www.fenixfinance.io/',
  brandImage: 'https://path-to-your-logo.png',
});

addons.setConfig({
  theme: darkTheme,
});

const preview: Preview = {
  parameters: {
    darkMode: {
      dark: darkTheme,
      light: lightTheme,
      current: 'dark',
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
  },
}

export default preview
