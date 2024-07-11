import { gql } from '@apollo/client'

export const BUNDLE_FRAGMENT = gql`
  fragment BundleFields on Bundle {
    id
    maticPriceUSD
  }
`
export const GET_V3_FACTORY_DATA = gql`
  {
    factories {
      totalFeesUSD
      totalVolumeUSD
      totalValueLockedUSD
    }
  }
`
export const GET_UNISWAP_FACTORY_DATA = gql`
  {
    uniswapFactories {
      totalLiquidityUSD
      totalVolumeUSD
    }
  }
`

export const GET_V2_PAIR_ID = gql`
  query GetPairs($token0Id: String!, $token1Id: String!, $isStable: Boolean!) {
    pairs(where: { isStable: $isStable, token0_: { id: $token0Id }, token1_: { id: $token1Id } }) {
      id
    }
  }
`

export const NATIVE_PRICE = gql`
  {
    bundles {
      maticPriceUSD
    }
  }
`
