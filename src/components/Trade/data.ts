export const NAV_LIST = [
  {
    name: 'Swap',
    description: 'The Best Price',
    icon: 'icon-swap',
    path: 'swap',
    active: true,
  },
  {
    name: 'DCA',
    description: 'Set and Forget',
    icon: 'icon-sand-clock',
    path: 'dca',
    active: false,
  },
  {
    name: 'Limit & Range Orders',
    description: 'Set Your Price or Your Range',
    icon: 'icon-auto-graph',
    path: 'limit-range',
    active: false,
  },
  {
    name: 'Recurring Orders',
    description: 'Create, buy and sell orders within a range',
    icon: 'icon-recurring',
    path: 'recurring',
    active: false,
  },
  {
    name: 'Bridge',
    description: 'Transfer assets to Blast',
    icon: 'icon-bridge',
    path: 'bridge',
    active: true,
  },
  {
    name: 'Perpetuals',
    description: 'Perpetuals Aggregator',
    icon: 'icon-chart-stock',
    path: 'perpetuals',
    active: false,
  },
]

export const TRADE_PROCESS = [
  {
    description: 'Start by selecting the token to Swap from and the amount you want to exchange',
    icon: 'icon-flag',
    label: 'Set Amount',
    status: 'active',
  },
  {
    description: 'ESelect the token you want to exchange for and confirm the exchange rate',
    icon: 'icon-coin',
    label: 'Refresh Rate',
    status: 'active',
  },
  {
    description: 'Wait for the system to get your quote ready in just a moment!',
    icon: 'icon-coin',
    label: 'Got it',
    status: 'active',
  },
  {
    description: 'Wait for the system to get your quote ready in just a moment!',
    icon: 'icon-coin',
    label: 'Got it',
    status: 'active',
  },
  {
    description: 'Wait for the system to get your quote ready in just a moment!',
    icon: 'icon-coin',
    label: 'Got it',
    status: 'active',
  },
  {
    description: 'Wait for the system to get your quote ready in just a moment!',
    icon: 'icon-coin',
    label: 'Got it',
    status: 'active',
  },
]

export const DCA_PROCESS = [
  {
    description: 'Start select the token you want to spend, sell or exchange.',
    icon: 'icon-flag',
    status: 'active',
  },
  {
    description: 'Enter the amount of token you want to spend, sell or exchange',
    icon: 'icon-coin',
    status: 'active',
  },
  {
    description: 'Select the exit token you want to buy or exchange',
    icon: 'icon-coin',
    status: 'active',
  },
  {
    description: 'Select the frequency of purchase/sale of the tokens.',
    icon: 'icon-time-picker',
    status: 'active',
  },
  {
    description: 'Select the duration of the token purchase/sale.',
    icon: 'icon-date-time',
    status: 'inactive',
  },
  {
    description: 'Place order to submit the transaction',
    icon: 'icon-submit-document',
    status: 'inactive',
  },
]

export const RECURRING_PROCESS = [
  {
    description: 'Start by selecting the pair you want to trade',
    icon: 'icon-flag',
    status: 'active',
  },
  {
    description: 'Choose the type of order, either limit or range.',
    icon: 'icon-coin',
    status: 'active',
  },
  {
    description: 'Select the price and token at which you want to buy',
    icon: 'icon-coin-received',
    status: 'inactive',
  },
  {
    description: 'Select the price and token at which you want to sell',
    icon: 'icon-coin-received',
    status: 'inactive',
  },
  {
    description: 'Make sure all the information is correct',
    icon: 'icon-check',
    status: 'inactive',
  },
  {
    description: 'Place order to submit the transaction',
    icon: 'icon-submit-document',
    status: 'inactive',
  },
]

export const LIMIT_PROCESS = [
  {
    description: 'Start by selecting the pairs to Limit from',
    icon: 'icon-flag',
    status: 'active',
  },
  {
    description: 'Enter the amount to limit you want to exchange',
    icon: 'icon-coin',
    status: 'active',
  },
  {
    description: 'Wait for the system to get your quote ready in just a moment!',
    icon: 'icon-coin-received',
    status: 'inactive',
  },
  {
    description: 'Wait for the system to get your quote ready in just a moment!',
    icon: 'icon-coin-received',
    status: 'inactive',
  },
  {
    description: 'Wait for the system to get your quote ready in just a moment!',
    icon: 'icon-check',
    status: 'inactive',
  },
  {
    description: 'Wait for the system to get your quote ready in just a moment!',
    icon: 'icon-submit-document',
    status: 'inactive',
  },
]

export const TIME_OPTIONS = [
  {
    label: 'Seconds',
    value: 'seconds',
  },
  {
    label: 'Minutes',
    value: 'minutes',
  },
  {
    label: 'Hours',
    value: 'hours',
  },
  {
    label: 'Days',
    value: 'days',
  },
  {
    label: 'Weeks',
    value: 'weeks',
  },
  {
    label: 'Months',
    value: 'months',
  },
]
