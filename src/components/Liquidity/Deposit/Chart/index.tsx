'use client'

import { NATIVE_ETH_LOWERCASE, WETH_ADDRESS } from '@/src/library/Constants'
import { contractAddressList } from '@/src/library/constants/contactAddresses'
import { useAllPools } from '@/src/state/liquidity/hooks'
import { zeroAddress } from 'viem'
import { Token, computePoolAddress } from '@cryptoalgebra/integral-sdk'
import { blast } from 'viem/chains'
import { INIT_CODE_HASH_MANUAL_OVERRIDE } from '@/src/library/constants/algebra'

const Chart = ({ token0, token1 }: { token0?: string | null; token1?: string | null }) => {
  const normalizeToken = (token: string) =>
    token.toLowerCase() === NATIVE_ETH_LOWERCASE ? WETH_ADDRESS.toLowerCase() : token.toLowerCase()

  const tokenA = token0 && token1 ? (normalizeToken(token0) < normalizeToken(token1) ? token0 : token1) : zeroAddress
  const tokenB = token0 && token1 ? (normalizeToken(token0) < normalizeToken(token1) ? token1 : token0) : zeroAddress
  const poolAddress =
    tokenA == tokenB
      ? '0x0000000000000000000000000000000000000000'
      : computePoolAddress({
          tokenA: new Token(blast.id, tokenA, 18), // decimals here are arbitrary
          tokenB: new Token(blast.id, tokenB, 18), // decimals here are arbitrary
          poolDeployer: contractAddressList.pool_deployer,
          initCodeHashManualOverride: INIT_CODE_HASH_MANUAL_OVERRIDE,
        })

  const { data } = useAllPools()

  const availablePool = data?.find((pool: any) => pool?.id?.toLowerCase() === poolAddress.toLowerCase())

  if (!token0 || !token1 || availablePool == null) return null

  return (
    <div  className='w-[100%] relative'>
      <div
        className={`sticky top-5 mt-[22px] left-0 flex flex-col w-[100%] xl:rounded-2xl max-xl:rounded-b-2xl max-xl:pb-4 max-xl:h-[600px] xl:h-[525px] px-3 xl:border xl:border-shark-950 xl:p-[3px] max-xl:bg-shark-400 max-xl:bg-opacity-40`}
      >
        <iframe
          height="100%"
          width="100%"
          src={`https://dexscreener.com/blast/${poolAddress}?embed=1&theme=dark&trades=0&info=0`}
          allow="clipboard-write"
          className="rounded-lg"
        />
      </div>
    </div>
  )
}

export default Chart