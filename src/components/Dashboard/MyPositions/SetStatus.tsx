import { getAlgebraPoolPrice } from '@/src/library/hooks/liquidity/useCL'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import Loader from '../../UI/Icons/Loader'

type setStatusprops = {
  token0: {
    decimals: string
    id: string
    symbol: string
    __typename?: string
  }
  token1: {
    decimals: string
    id: string
    symbol: string
    __typename?: string
  }
  tickLower: {
    price0: string
    price1: string
  }
  tickUpper: {
    price0: string
    price1: string
  }
  liquidity: string
}
export const SetStatus = ({ token0, token1, tickLower, tickUpper, liquidity }: setStatusprops) => {
  const minPrice = useMemo(() => {
    return parseFloat(tickLower?.price0) * 10 ** (Number(token0?.decimals) - Number(token1?.decimals))
  }, [tickLower, token0?.decimals, token1?.decimals])
  const maxPrice = useMemo(() => {
    return parseFloat(tickUpper?.price0) * 10 ** (Number(token0?.decimals) - Number(token1?.decimals))
  }, [tickUpper, token0?.decimals, token1?.decimals])

  const { data: poolPriceData, isLoading: isPoolPriceDataLoading } = useQuery({
    queryKey: ['algebraPoolPrice', token0?.id, token1?.id],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const state = await getAlgebraPoolPrice(token0?.id as `0x${string}`, token1?.id as `0x${string}`)
      return state
    },
    enabled: !!token0?.id && !!token1?.id,
  })
  const currentPoolPrice = poolPriceData ? Number(poolPriceData?.price / 10 ** Number(token1.decimals)).toFixed(6) : '0'

  const isInRange = useMemo(() => {
    return (minPrice < Number(currentPoolPrice) && maxPrice >= Number(currentPoolPrice)) || liquidity === 'ichi'
  }, [minPrice, maxPrice, currentPoolPrice, liquidity])
  if (isPoolPriceDataLoading) {
    return <Loader />
  }
  return (
    <>
      {isInRange ? (
        <div className="text-green-400 text-sm flex-col flex justify-center items-start gap-1">
          <div className="flex items-center gap-x-1">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="3" fill="#2AED8F" />
            </svg>
            <span>In range</span>
          </div>
          <span className="text-white">Pool price: {Number(currentPoolPrice)}</span>
        </div>
      ) : (
        <div className="text-red-600 text-sm flex-col flex justify-center items-start gap-1">
          <div className="flex items-center gap-x-1">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="3" fill="#dc2626" />
            </svg>
            <span>Out of range</span>
          </div>
          <span className="text-white">Pool price: {Number(currentPoolPrice)}</span>
        </div>
      )}
    </>
  )
}
