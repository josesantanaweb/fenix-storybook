import { useState, useEffect } from 'react'
import { fetchTokens } from '../../common/getAvailableTokens'
import { toBN } from '../../utils/numbers'
import { BasicPool } from '@/src/state/liquidity/types'

export default function useFDAOEmissionsAPR(row: BasicPool) {
  const [fDAOEmisionsAPR, setFDAOEmisionsAPR] = useState<number>(0)

  useEffect(() => {
    const fetchFDAOPrice = async () => {
      // fdao pool
      if (row.id !== '0x886369748d1d66747b8f51ab38de00dea13f0101') {
        setFDAOEmisionsAPR(0)
        return
      }
      const tokens = await fetchTokens(undefined as any)
      const fDAOTokenPrice = tokens.find(
        // fdao token address
        (token) => token.tokenAddress.toLowerCase() === '0x3b0cffda9a5ab64135c227638e777ceec0c243a8'
      )?.priceUSD
      if (!fDAOTokenPrice) {
        setFDAOEmisionsAPR(0)
        return
      }
      const apr = toBN(12_500)
        .multipliedBy(fDAOTokenPrice)
        .dividedBy(row.totalValueLockedUSD)
        .multipliedBy(52) // weeks
        .multipliedBy(100)
        .toNumber()
      setFDAOEmisionsAPR(apr)
    }

    fetchFDAOPrice()
  }, [row.id, row.totalValueLockedUSD])
  return fDAOEmisionsAPR
}
