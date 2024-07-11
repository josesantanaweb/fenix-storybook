import { Address } from 'viem'
import { TokenData } from './structures/common/TokenData'

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
export const COINGECKO_URL = process.env.NEXT_PUBLIC_COINGECKO_URL
export const TVL_API_URL = process.env.NEXT_PUBLIC_TVLAPI_URL

export const MAINNET_CHAIN_ID = 81457
export const IMG_SIZE = 0.7
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const FNX_ADDRESS = '0xCE286b104F86733B24c02a5CDA9483176BcE02d6'
export const WETH_ADDRESS = '0x4300000000000000000000000000000000000004'
export const NATIVE_ETH_LOWERCASE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const NATIVE_ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const ETH_TOKEN: TokenData = {
  name: 'ETH',
  symbol: 'ETH',
  decimals: 18,
  address: NULL_ADDRESS,
  price_quote: 0,
}

// Default pair tokens
/*export const DEFAULT_PAIR_TOKEN_0: TokenData = {
  name: 'WETH',
  symbol: 'WETH',
  decimals: 18,
  address: process.env.NEXT_PUBLIC_WETH_ADDRESS as Address,
};*/
// export const DEFAULT_PAIR_TOKEN_0: TokenData = ETH_TOKEN;

export const DEFAULT_PAIR_TOKEN_0: TokenData = {
  name: 'FNX',
  symbol: 'FNX',
  decimals: 18,
  address: process.env.NEXT_PUBLIC_FNX_ADDRESS as Address,
  price_quote: 0,
}

export const DEFAULT_PAIR_TOKEN_1: TokenData = {
  name: 'USDC',
  symbol: 'USDC',
  decimals: 6,
  address: process.env.NEXT_PUBLIC_USDC_ADDRESS as Address,
  price_quote: 0,
}

export const WHITELISTED = [
  'WETH',
  'USDC',
  'USDT',
  'DAI',
  'WBTC',
  'UNI',
  'ARB',
  'LDO',
  'TUSD',
  'LINK',
  'FRAX',
  'USDD',
  'CRV',
  'GMX',
  'Frax Share',
  'frxETH',
  'sfrxETH',
  'MAI',
  'USD+',
  'DAI+',
  'DOLA',
  'rETH',
  'FNX',
  'SHRAP',
  'IBEX',
  'TAROT',
  'OATH',
  'GRAIN',
  'GMD',
  'gmdUSDC',
  'gmUSD',
  'PENDLE',
  'DEUS',
  'DEI',
  'FCTR',
  'Y2K',
  'RDNT',
  'LUSD',
  'plsARB',
  'ARKEN',
  'LIBERA',
  'IDIA',
  'POI$ON',
  'iPOI$ON',
  'pGOLD',
  'pSLVR',
  'pOIL',
  'pTSLA',
  'pAMZN',
  'pAAPL',
  'pGOOG',
  'pMSFT',
  'wUSDR',
  'THOREUM',
  'LEVI',
  'MIM',
  'LQTY',
  'GRT',
  'JGLP',
  'fUSDC',
  'pxGLP',
  'ACS',
  'LQDR',
  'GMD',
  'GND',
  'xGND',
  'FXS',
  'FBA',
  'RING',
  'FIS',
  'StaFirETH',
  'TND',
  'MAI',
  'QI',
  'PEPE',
  'L2DAO',
  'plsRDNT',
  'PLS',
  'PORK',
  'DCA',
  'xPORK',
  'BIFI',
  'JRT',
  'jEUR',
  'ANGLE',
  'agEUR',
  'XCAD',
  'GB',
  'BELA',
  'BETS',
  'KUJI',
  'RPL',
  'HASH',
  'CELLS',
  'POLY',
  'USDF',
  'gOHM',
  'OHM',
  'WAR',
  'gDAI',
  'GNS',
  'ERN',
  'CRUIZE',
  'tBTC',
  'USDC.e',
  'XEX',
  'multiACS',
  'T',
  'PUSD',
  'PRISM',
  'TAROTv2',
  'oldLQDR',
  'LQDRV2',
  'STAR',
  'wUSDRv3',
  'xDCA',
  'stERN',
  'TIG',
  'MetaX',
]

export const ILLIQUID_TOKENS = ['xDCA']

export const BLACKLISTED = ['LIBERA', 'DEI']
