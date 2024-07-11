export interface IBaseLink {
  name: string
  path: string
  new?: boolean
  icon?: string
}

export interface ILink extends IBaseLink {
  subMenu?: IBaseLink[]
}

export const MENU_LINKS: ILink[] = [
  {
    name: 'Trade',
    path: '/trade/swap',
    subMenu: [
      {
        name: 'Swap',
        path: '#',
        icon: '',
      },
      {
        name: 'DCA',
        path: '#',
        icon: '',
      },
      {
        name: 'Limit / Range Orders',
        path: '#',
        icon: '',
      },
      {
        name: 'Recurring Orders',
        path: '#',
        icon: '',
      },
      {
        name: 'Bridge',
        path: '#',
        icon: '',
      },
      {
        name: 'Perpetuals',
        path: '#',
        icon: '',
      },
    ],
  },
  {
    name: 'Liquidity',
    path: '/liquidity',
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    name: 'Fenix Rings',
    path: '/points-program',
  },
  {
    name: 'Referrals',
    path: '/referrals',
    new: true,
  },
  {
    name: 'Vote',
    path: '/vote',
  },
  {
    name: 'Lock',
    path: '/lock',
  },
  {
    name: 'Bribes',
    path: '/bribes',
  },
  {
    name: 'Claims',
    path: '/claim',
  },
  {
    name: 'Rewards',
    path: '/rewards',
  },
]

export const SOCIAL_LINKS = [
  {
    title: 'Twitter',
    href: 'https://twitter.com/fenixfinance',
    iconName: 'twitter',
  },
  {
    title: 'Discord',
    href: 'https://discord.com/invite/fenixfi',
    iconName: 'discord',
  },
  {
    title: 'Medium',
    href: 'https://medium.com/@Fenix_Finance',
    iconName: 'medium',
  },
  {
    title: 'Git',
    href: 'https://docs.fenixfinance.io/fenix/welcome-to-fenix/our-mission',
    iconName: 'git',
  },
]
