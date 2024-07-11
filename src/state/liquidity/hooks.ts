import { ApiState } from '@/src/library/types/connection'
import { useAppDispatch, useAppSelector } from '..'
import { useCallback } from 'react'
import { updateToken0, updateToken0TypedValue, updateToken1, updateToken1TypedValue } from './actions'
import { Address } from '@/src/library/types'

import { LiquidityTableElement, LiquidityV2PairDetails, V3PairInfo } from './types'
import { PairInfoV3 } from '@/src/library/web3/apis/pairAPI'

export function useV2PairsData() {
  const v2Pairs: {
    tablestate: ApiState
    tableData?: LiquidityTableElement[]
  } = useAppSelector((state) => state.liquidity.v2Pairs)
  const pairLoading: {
    state: ApiState
  } = useAppSelector((state) => state.liquidity.v2Pairs)
  //
  return {
    loading: v2Pairs.tablestate === ApiState.LOADING,
    data: v2Pairs.tableData,
  }
}

export function useConcentratedPools() {
  const concentratedPools: {
    state: ApiState
    data: any
  } = useAppSelector((state) => state.liquidity.concentratedPools)

  return {
    loading: concentratedPools.state === ApiState.LOADING,
    data: concentratedPools.data,
  }
}

export function useToken0() {
  const token0 = useAppSelector((state) => state.liquidity.token0)
  return token0 || process.env.NEXT_PUBLIC_DEFAULT_TOKEN_0_ADDRESS
}

export function useToken0TypedValue() {
  const token0TypedValue = useAppSelector((state) => state.liquidity.token0TypedValue)
  return token0TypedValue
}

export function useToken1() {
  const token1 = useAppSelector((state) => state.liquidity.token1)
  return token1 || process.env.NEXT_PUBLIC_DEFAULT_TOKEN_1_ADDRESS
}
export function useToken1TypedValue() {
  const token1TypedValue = useAppSelector((state) => state.liquidity.token1TypedValue)
  return token1TypedValue
}
export function useClmProvider() {
  const clmProvider = useAppSelector((state) => state.liquidity.clmProvider)
  return clmProvider
}

export function useSelectedPair() {
  const token0 = useToken0()
  const token1 = useToken1()
  const clmProvider = useClmProvider()
  return {
    token0,
    token1,
    clmProvider,
  }
}

export function useSetToken0() {
  const dispatch = useAppDispatch()
  return useCallback(
    (token0: Address) => {
      dispatch(updateToken0(token0))
    },
    [dispatch]
  )
}
export function useSetToken0TypedValue() {
  const dispatch = useAppDispatch()
  return useCallback(
    (token0TypedValue: string) => {
      dispatch(updateToken0TypedValue(token0TypedValue))
    },
    [dispatch]
  )
}

export function useSetToken1() {
  const dispatch = useAppDispatch()
  return useCallback(
    (token1: Address) => {
      dispatch(updateToken1(token1))
    },
    [dispatch]
  )
}
export function useSetToken1TypedValue() {
  const dispatch = useAppDispatch()
  return useCallback(
    (token1TypedValue: string) => {
      dispatch(updateToken1TypedValue(token1TypedValue))
    },
    [dispatch]
  )
}

export function useAllPools() {
  const pools = useAppSelector((state) => state.liquidity?.pools) || []
  return {
    loading: pools?.state === ApiState.LOADING,
    data: pools?.data || [],
  }
}

export function usePoolById(poolId: string) {
  const pools = useAllPools()
  return pools.data.find((pool: LiquidityTableElement) => pool.pairAddress === poolId)
}

export function useGammaVaults() {
  const gammaVaults = useAppSelector((state) => state.liquidity.gammaVaults)
  return {
    loading: gammaVaults?.state === ApiState.LOADING,
    data: gammaVaults?.data || [],
  }
}

export function useRingsCampaignsBoostedPools() {
  const ringsCampaigns = useAppSelector((state) => state.liquidity.ringsCampaigns)
  return {
    loading: ringsCampaigns.state === ApiState.LOADING,
    data: ringsCampaigns.data?.boostedPools || [],
  }
}

export function useRingsCampaigns() {
  const ringsCampaigns = useAppSelector((state) => state.liquidity.ringsCampaigns)
  return {
    loading: ringsCampaigns.state === ApiState.LOADING,
    data: ringsCampaigns.data,
  }
}

// export function useRingCampaignById(id: string) {
//   const ringsCampaigns = useRingsCampaigns()
//   return ringsCampaigns.data.find((campaign: BoostedPool) => campaign.id === id)
// }
