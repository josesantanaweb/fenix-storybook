import { addons } from '@storybook/addons'
import { create } from '@storybook/theming/create'

const myTheme = create({
  base: 'dark',

  brandImage: 'https://www.fenixfinance.io/static/images/logo.svg',
  brandTitle: 'Fenix Components',
  brandUrl: 'https://tu-dominio.com',
})

addons.setConfig({
  theme: myTheme,
})
