/* eslint-disable max-len */
export const POINTS_BOXES = [
  {
    title: 'Trade on Fenix',
    description:
      'Swap token via spot, execute limit orders and DCA to earn Fenix Points. Tip: Earn extra by trading USDB, WETH and FNX',
    icon: 'icon-flag',
  },
  {
    title: 'Provide Liquidity',
    description:
      'Provide liquidity into any Fenix pool to earn points! Tip: Earn extra by depositing into WETH-USDB and FNX pools.',
    icon: 'icon-coin',
  },
  {
    title: 'Lock FNX',
    description: 'Lock FNX to earn maximum Fenix Points! Tip: The longer you lock, the bigger the multiplier.',
    icon: 'icon-coin-received',
  },
]

export const POINTS_BLAST = [
  {
    title: 'For DEXs',
    description:
      'Liquidity depth (esp for top market pairs like ETH/USDB), Volume, TVL, User count, User retention.From Ambient Finance - apparently depth is based on 2% depth so we need to focus on UNIV3 pools for ETH-USDB',
  },
  {
    title: 'For Perps',
    description:
      'Liquidity depth, Open interest, Volume, TVL, User count, User retention this is not a requirement, but we are especially keen to reward Perp Dexes who monetize off of yield instead of charging their users trading fees - this works with us giving them a lower funding rate',
  },
]

export const MECHANISMS = [
  {
    title: 'Fenix - Users get points for swapping, locking and for LPing',
    description:
      'Swaps on ETH/USDB + FNX/WETH + FNX/USDB - each swap $1 gets 1.5 points. Swaps on all other pools - $1 gets 1 point.  Each $1 of FNX lock (new lock or add to existing) gets 3 points.  Each $ of LP gets 2 points',
  },
  {
    title: 'EON',
    description:
      'We build a volume leaderboard like IntentX and proportionally allocate BLAST GOLD points accrued to EON (1 point per 1 $ of volume) We need to track user wallets who deposit USDB into EON - then we redirect BLAST POINTS back to users Need to define exactly how USDB yield is implemented to give the funding rate discount + we can highlight this to let Blast know',
  },
]
