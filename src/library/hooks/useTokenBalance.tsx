import { useToken0, useToken1 } from '@/src/state/liquidity/hooks'
import { useERC20Balance } from './web3/erc20/useERC20Balance'
import { zeroAddress } from 'viem'
import useActiveConnectionDetails from './web3/useActiveConnectionDetails'
import { Address } from '../types'

const useTokenBalance = (tokenAddress: Address) => {
  const { account } = useActiveConnectionDetails()
  const balance = useERC20Balance({
    tokenAddress: tokenAddress || zeroAddress,
    tokenDecimals: 18, // FIXME: GET DYANMICALLY DECIMALS FROM TOKEN
    owner: account,
  })

  return balance
}

export const useToken0Balance = () => {
  const token0 = useToken0()
  return useTokenBalance(token0)
}

export const useToken1Balance = () => {
  const token1 = useToken1()
  return useTokenBalance(token1)
}
