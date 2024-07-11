import { fetchV3Positions } from '@/src/state/liquidity/reducer'
import { LiquidityProvider } from '.'
import { TokenDataProvider } from '../TokenDataProvider'
import { getPositiveBalance, toBN } from '../../utils/numbers'
import { PoolProvider } from '../PoolProvider'

export class ManualLiquidityProvider extends LiquidityProvider {
  async getUserLiquidity(account: string) {
    const positions = await fetchV3Positions(account as `0x${string}`)
    const tokenPrices = await TokenDataProvider.getTokenPrices()
    let totalTVL = toBN(0)
    let boostedTVL = toBN(0)
    const promises = positions.map(async (position) => {
      const poolAddress = position.pool.id
      const amountToken0 = getPositiveBalance(Number(position.depositedToken0), Number(position.withdrawnToken0))
      const amountToken1 = getPositiveBalance(Number(position.depositedToken1), Number(position.withdrawnToken1))

      const positionValueToken0 = await TokenDataProvider.calculateTokenValue(
        position.token0.id,
        toBN(amountToken0).toString()
      )
      const positionValueToken1 = await TokenDataProvider.calculateTokenValue(
        position.token1.id,
        toBN(amountToken1).toString()
      )
      const positionValue = toBN(positionValueToken0).plus(toBN(positionValueToken1))
      const isBoostedPool = await PoolProvider.isBoostedPool(poolAddress)

      return { positionValue, isBoostedPool }
    })

    const results = await Promise.all(promises)

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
