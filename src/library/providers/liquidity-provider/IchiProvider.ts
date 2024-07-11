import {
  SupportedChainId,
  SupportedDex,
  getAllUserAmounts,
  getIchiVaultInfo,
  UserAmountsInVault,
} from '@ichidao/ichi-vaults-sdk'
import { ethers } from 'ethers'
import { LiquidityProvider } from '.'
import { PoolProvider } from '../PoolProvider'
import { toBN } from '../../utils/numbers'
import { TokenDataProvider } from '../TokenDataProvider'
import { getIchiVaultsDataByIds } from '@/src/state/liquidity/reducer'
import { IchiVault } from '@/src/library/hooks/web3/useIchi'

export class IchiProvider extends LiquidityProvider {
  async getUserLiquidity(account: string) {
    const provider = new ethers.providers.JsonRpcProvider({
      url: 'https://ancient-powerful-emerald.blast-mainnet.quiknode.pro/e93288d60f12f4fbb136d310242ac46df10b8f74/',
      fetchOptions: {
        referrer: 'https://fenixfinance.io/',
      },
    })
    const dex = SupportedDex.Fenix
    const allPositions = await getAllUserAmounts(account, provider, dex)
    let totalTVL = toBN(0)
    let boostedTVL = toBN(0)

    const tokenPrices = await TokenDataProvider.getTokenPrices()

    const chain = 'blast' // SupportedChainId.blast

    const vaults = await getIchiVaultsDataByIds(
      chain,
      dex,
      allPositions.map(({ vaultAddress }) => vaultAddress)
    )
    const vaultsMap: { [key: string]: IchiVault } = vaults.reduce((map, item) => ({ ...map, [item.id]: item }), {})
    const results = await Promise.all(
      allPositions.map(async (position) => {
        const vault = position.vaultAddress
        const vaultInfo = vaultsMap[vault]
        const token0 = vaultInfo.tokenA
        const token1 = vaultInfo.tokenB

        const poolAddress = await PoolProvider.getPoolIdByTokens(token0, token1)
        const isBoostedPool = await PoolProvider.isBoostedPool(poolAddress)

        const amountToken0 = position.userAmounts[0]
        const amountToken1 = position.userAmounts[1]

        const token0Price = tokenPrices.find((price) => price.tokenAddress === token0)?.priceUSD
        const token1Price = tokenPrices.find((price) => price.tokenAddress === token1)?.priceUSD

        const positionValueToken0 = toBN(amountToken0).multipliedBy(token0Price || 0)
        const positionValueToken1 = toBN(amountToken1).multipliedBy(token1Price || 0)
        const positionValue = positionValueToken0.plus(positionValueToken1)

        return { positionValue, isBoostedPool }
      })
    )

    results.forEach(({ positionValue, isBoostedPool }) => {
      totalTVL = totalTVL.plus(positionValue)
      if (isBoostedPool) {
        boostedTVL = boostedTVL.plus(positionValue)
      }
    })

    return {
      TVL: totalTVL.decimalPlaces(2).toString(),
      boostedTVL: boostedTVL.decimalPlaces(2).toString(),
    }
  }
}
