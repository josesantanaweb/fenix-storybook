import { gql } from '@apollo/client'

export const GET_V2_PAIRS = gql`
  query GetV2Pairs($first: Int, $skip: Int) {
    pairs(first: $first, skip: $skip) {
      id
      isStable

      id
      volumeToken0
      volumeUSD
      volumeToken1

      token0 {
        name
        id
        symbol
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

// Define the GraphQL query
export const GET_V3_ALGEBRA_DATA = gql`
  {
    pools {
      id
      token1 {
        id
        name
        symbol
        decimals
      }
      token0 {
        id
        name
        symbol
        decimals
      }
      feesUSD
      liquidity
      token0Price
      token1Price
      volumeUSD
      totalValueLockedToken0
      totalValueLockedToken1
      volumeToken1
      volumeToken0
      untrackedVolumeUSD
      untrackedFeesUSD
      txCount
      totalValueLockedUSDUntracked
      totalValueLockedUSD
      totalValueLockedMatic
      tickSpacing
      tick
      sqrtPrice
      observationIndex
      liquidityProviderCount
      collectedFeesToken0
      collectedFeesToken1
      collectedFeesUSD
      createdAtBlockNumber
      communityFee
      createdAtTimestamp
      fee
      feeGrowthGlobal0X128
      feeGrowthGlobal1X128
      feesToken0
      feesToken1
    }
  }
`
export const GET_POSITIONV3_USER = gql`
  query GetPositionV3User($owner: String!) {
    positions(orderBy: id, orderDirection: desc, where: { owner: $owner }, first: 1000) {
      id
      liquidity
      owner
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      pool {
        id
        fee
        sqrtPrice
        liquidity
        tick
        tickSpacing
        totalValueLockedUSD
        volumeUSD
        feesUSD
        untrackedFeesUSD
        token0Price
        token1Price
        token0 {
          id
          symbol
          name
          decimals
          derivedMatic
        }
        token1 {
          id
          symbol
          name
          decimals
          derivedMatic
        }
        poolDayData(first: 7, orderBy: date, orderDirection: desc) {
          feesUSD
        }
      }

      tickLower {
        price0
        price1
        tickIdx
      }
      tickUpper {
        price0
        price1
        tickIdx
      }
      token0 {
        symbol
        decimals
        id
      }
      token1 {
        symbol
        id
        decimals
      }
    }
  }
`
