import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    transitionDuration: {
      DEFAULT: '300ms',
    },
    transitionTimingFunction: {
      DEFAULT: 'linear',
    },
    extend: {
      boxShadow: {
        'yellow-glow': '0 0 10px 3px rgba(255, 223, 0, 0.6)',
      },
      width: {
        'max-content': 'max-content',
      },
      keyframes: {
        'toast-in': {
          from: {
            transform: 'translateX(100%)',
          },
          to: {
            transform: 'translateX(0%)',
          },
        },
        progress: {
          from: {
            width: '0',
          },
          to: {
            width: '100%',
          },
        },
        notification: {
          '0%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-1.2px)' },
          '40%': { transform: 'translateX(1.2px)' },
          '60%': { transform: 'translateX(-1.2px)' },
          '80%': { transform: 'translateX(1.2px)' },
          '100%': { transform: 'translateX(0px)' },
        },
      },
      animation: {
        'spin-slow': 'spin 25s linear infinite',
        'spin-slow-reverse': 'spin 25s linear infinite reverse',

        'toast-in': 'toast-in 250ms linear',
        progress: 'progress 3s linear',
        notification: 'notification 2s infinite alternate',
      },
      backgroundImage: {
        // Gradients
        'button-primary':
          'linear-gradient(90deg, rgba(254, 94, 53, 0.80) 10.49%, rgba(246, 119, 2, 0.80) 92.04%, rgba(255, 239, 118, 0.80) 158.76%)',
        'ranking-gradient':
          'linear-gradient(90deg, rgba(254, 94, 53, 0.40) 10.49%, rgba(246, 119, 2, 0.40) 92.04%, rgba(255, 239, 118, 0.40) 158.76%)',
        'button-primary-hover': 'linear-gradient(90deg, #FE5E35 10.49%, #F67702 92.04%, #FFEF76 158.76%)',
        'error-404': 'url("/static/images/404/Background_1.svg")',
        'error-404-mobile': 'url("/static/images/404/backgroundMobile.svg")',
        'error-404-responsive': 'url("/static/images/404/backgroundResponsive.svg")',

        'fenix-slider': 'url("/static/images/vote/fenix-slider.png")',
        'overlay-fixed': 'url("/static/images/vote/overlay-fixed.svg")',
        rectangle: 'url("/static/images/landing/Rectangle.svg")',
        'rectangle-big': 'url("/static/images/landing/Rectangle-big.svg")',
        'overlay-mobile': 'url("/static/images/vote/overlay-mobile.svg")',
        hours: 'url("/static/images/claim/bg-hours.svg")',
        'neutral-colors-neutral-variables-radial-300':
          'radial-gradient(50% 50% at 50% 50%, #35353C 0%, rgba(53, 53, 60, 0.00) 100%)',
      },
      lineHeight: {
        normal: 'normal',
      },
      colors: {
        // TODO: Remove old colors
        shark: {
          '100': '#53606A',
          '200': '#474C51',
          '300': '#393E44',
          '400': '#292D32', // main
          '500': '#16181a',
          '600': '#0A0A0A',
          '700': '#000000',
          '800': '#000000',
          '900': '#111315',
          '950': '#262C33',
        },
        'alizarin-crimson': {
          '100': '#ffe0e4',
          '200': '#ffc6cd',
          '300': '#ff9fab',
          '400': '#ff687b',
          '500': '#fb3850',
          '600': '#e91f38',
          '700': '#c41127',
          '800': '#a21224',
          '900': '#861624',
        },

        'outrageous-orange': {
          '100': '#ffe2d4',
          '200': '#ffc2a9',
          '300': '#ff9772',
          '400': '#fe5e35', // main
          '500': '#fd3812',
          '600': '#ee1e08',
          '700': '#c51209',
          '800': '#9c1110',
          '900': '#7e1110',
        },

        'chilean-fire': {
          '50': '#fffaec',
          '100': '#fff3d3',
          '200': '#ffe3a6',
          '300': '#ffce6e',
          '400': '#ffad33',
          '500': '#ff920c',
          '600': '#f67702', // main
          '700': '#ca5904',
          '800': '#a0450c',
          '900': '#813b0d',
        },
        festival: {
          '100': '#fff9c2',
          '200': '#ffef76', // main
          '300': '#ffe245',
          '400': '#fcce13',
          '500': '#ecb506',
          '600': '#cc8c02',
          '700': '#a26306',
          '800': '#864d0d',
          '900': '#723f11',
        },
        primary: {
          '100': '#FF920C',
          '200': '#F67702',
          '300': 'rgba(249, 119, 2, 0.80)',
          '400': '#A0450C',
          '500': '#813B0D',
          '600': '#461B04',
        },
        secondary: {
          '100': '#FCCE13',
          '200': '#ECB506',
          '300': '#CC8C02',
          '400': '#A26306',
          '500': '#864D0D',
          '600': '#723F11',
        },
        tertiary: {
          '100': '#73739B',
          '200': '#54547A',
          '300': 'rgba(84, 84, 122, 0.60)',
          '400': 'rgba(84, 84, 122, 0.40)',
          '500': 'rgba(36, 36, 43, 0.40)',
          '600': 'rgba(36, 36, 43, 0.20)',
        },
        neutral: {
          '100': '#FFFFFF',
          '200': '#818187',
          '300': '#35353C',
          '400': '#24242B',
          '500': 'rgba(36, 36, 43, 0.60)',
          '600': '#1A1A1B',
          '700': 'rgba(26, 26, 27, 0.60)',
          '800': 'rgba(26, 26, 27, 0.40)',
          '900': '#101013',
        },
        error: {
          '100': '#FB3850',
          '200': '#E91F38',
          '300': '#C41127',
          '400': '#A21224',
          '500': '#861624',
          '600': '#49060E',
          '700': '#49060E',
        },
        success: {
          '100': '#10D777',
          '200': '#06B360',
          '300': '#098C4E',
          '400': '#0D6E41',
          '500': '#0D5A38',
          '600': '#00331D',
          '700': 'rgba(6, 179, 96, 0.10)',
        },
        network: {
          base: '#0052FF',
          blast: '#FCFC03',
        },
      },
      fontSize: {
        xxs: ['.625rem', { lineHeight: 'normal' }],
        xs: ['.75rem', { lineHeight: 'normal' }],
        sm: ['.875rem', { lineHeight: 'normal' }],
        base: ['1rem', { lineHeight: 'normal' }],
        lg: ['1.125rem', { lineHeight: 'normal' }],
        xl: ['1.25rem', { lineHeight: 'normal' }],
        '2xl': ['1.5rem', { lineHeight: 'normal' }],
        '3xl': ['2rem', { lineHeight: 'normal' }],
        '4xl': ['3rem', { lineHeight: 'normal' }],
        '5xl': ['4rem', { lineHeight: 'normal' }],
      },
      fontFamily: {
        'space-grotesk': 'Space Grotesk',
      },
      screens: {
        xxxs: '256px',
        xxs: '384px',
        xs: '512px',
        xxl: '1450px',
      },
    },
    container: {
      center: true,
      screens: {},
    },
  },
  plugins: [],
}
// eslint-disable-next-line import/no-default-export
export default config
