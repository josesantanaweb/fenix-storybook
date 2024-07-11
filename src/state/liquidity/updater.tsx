import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppThunkDispatch } from '..'
import { getAllPools, getGammaVaults, getRingsCampaigns } from './thunks'
import { getLiquidityTableElements, getLiquidityV2Pairs } from './thunks'
import { useAccount } from 'wagmi'
import { autoRefresh } from '@/src/library/utils/retry'
import { blast } from 'viem/chains'
import { FALLBACK_CHAIN_ID } from '@/src/library/constants/chains'

export default function LiquidityUpdater() {
  const thunkDispatch: AppThunkDispatch = useDispatch()
  const { address, chainId } = useAccount()

  useEffect(() => {
    if (address && chainId) thunkDispatch(getLiquidityV2Pairs({ address, chainId }))
    if (address && chainId) thunkDispatch(getLiquidityTableElements({ address, chainId }))
  }, [thunkDispatch, address, chainId])

  useEffect(() => {
    if (chainId) {
      thunkDispatch(getAllPools(chainId))
    } else {
      thunkDispatch(getAllPools(FALLBACK_CHAIN_ID))
    }
    thunkDispatch(getGammaVaults())
  }, [thunkDispatch, chainId])
  useEffect(() => {
    const fetchCampaigns = () => {
      thunkDispatch(getRingsCampaigns())
    }

    fetchCampaigns()
    const interval = setInterval(fetchCampaigns, 1000 * 60 * 5)

    return () => {
      clearInterval(interval)
    }
  }, [thunkDispatch])

  return null
}
