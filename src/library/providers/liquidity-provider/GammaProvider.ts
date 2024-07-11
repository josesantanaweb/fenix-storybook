import { LiquidityProvider } from '.'
import { toBN } from '../../utils/numbers'
import * as Sentry from '@sentry/react'

export class GammaProvider extends LiquidityProvider {
  async getUserLiquidity(account: string) {
    // poner try catch
    let totalTVL = toBN(0)
    const boostedTVL = toBN(0)

    try {
      const url = `https://wire2.gamma.xyz/fenix/blast/user/${account.toLowerCase()}`
      const response = await fetch(url)
      const data = await response.json()
      const vaults = data[account.toLowerCase()]
      console.log('vaults', vaults)
      for (const key in vaults) {
        if (vaults[key] && typeof vaults[key] === 'object' && vaults[key].hasOwnProperty('balanceUSD')) {
          console.log(`Vault ${key}: balanceUSD = ${vaults[key].balanceUSD}`)
          totalTVL = totalTVL.plus(toBN(vaults[key].balanceUSD))
        }
      }
    } catch (error) {
      console.log('gamma provider error', error)
      Sentry.captureException(error)
    }
    return {
      TVL: totalTVL.decimalPlaces(2).toString(),
      boostedTVL: boostedTVL.decimalPlaces(2).toString(),
    }
  }
}
