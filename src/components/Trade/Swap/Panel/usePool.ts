import { InitialPoolFee } from '@cryptoalgebra/integral-sdk'
import { Pool } from '@cryptoalgebra/integral-sdk'
import { useMemo } from 'react'
import { useCurrency } from './useCurrency'
import useAlgebraSafelyStateOfAMM from '@/src/library/hooks/web3/useAlgebraSafelyStateOfAMM'
import useAlgebraPoolTickSpacing from './useAlgebraPoolTickSpacing'
import useAlgebraPoolToken0 from './useAlgebraPoolToken0'
import useAlgebraPoolToken1 from './useAlgebraPoolToken1'
import { zeroAddress } from 'viem'

export const PoolState = {
  LOADING: 'LOADING',
  NOT_EXISTS: 'NOT_EXISTS',
  EXISTS: 'EXISTS',
  INVALID: 'INVALID',
} as const

export type PoolStateType = (typeof PoolState)[keyof typeof PoolState]

export function usePool(address: string | undefined): [PoolStateType, Pool | null] {
  const {
    data: tickSpacing,
    loading: isTickSpacingLoading,
    isError: isTickSpacingError,
  } = useAlgebraPoolTickSpacing(address as `0x${string}`)
  const {
    data: globalState,
    loading: isGlobalStateLoading,
    isError: isGlobalStateError,
  } = useAlgebraSafelyStateOfAMM(address as `0x${string}`)

  const {
    data: token0Address,
    loading: isLoadingToken0,
    isError: isToken0Error,
  } = useAlgebraPoolToken0(address as `0x${string}`)
  const {
    data: token1Address,
    loading: isLoadingToken1,
    isError: isToken1Error,
  } = useAlgebraPoolToken1(address as `0x${string}`)

  const token0 = useCurrency(token0Address)
  const token1 = useCurrency(token1Address)

  const isPoolError = isTickSpacingError || isGlobalStateError || isToken0Error || isToken1Error || !address

  const isPoolLoading = isTickSpacingLoading || isGlobalStateLoading || isLoadingToken0 || isLoadingToken1
  const isTokensLoading = !token0 || !token1

  return useMemo(() => {
    if ((isPoolLoading || isTokensLoading) && !isPoolError) return [PoolState.LOADING, null]

    if (!tickSpacing || !globalState || globalState[4] === undefined) return [PoolState.NOT_EXISTS, null]

    if (globalState[0] === 0n || !token0 || !token1) return [PoolState.NOT_EXISTS, null]

    try {
      return [
        PoolState.EXISTS,
        new Pool(
          token0.wrapped,
          token1.wrapped,
          globalState[2] as InitialPoolFee,
          globalState[0].toString(),
          Number(globalState[4]),
          globalState[1],
          tickSpacing
        ),
      ]
    } catch (error) {
      return [PoolState.NOT_EXISTS, null]
    }
  }, [token0, token1, globalState, tickSpacing, isPoolError, isPoolLoading, isTokensLoading])
}
