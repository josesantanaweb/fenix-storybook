import { getAlgebraClient } from '@/src/library/apollo/client/protocolCoreClient'
import { POOLS_ID_LIST } from '@/src/library/apollo/queries/pools'
import { Token, computePoolAddress } from '@cryptoalgebra/integral-sdk'
import { blast } from 'viem/chains'
import { contractAddressList } from '../constants/contactAddresses'
import { INIT_CODE_HASH_MANUAL_OVERRIDE } from '../constants/algebra'
import boostedPools from '@/src/library/constants/pools/boosted-pools'

export class PoolProvider {
  static async getV3PoolsIds() {
    const client = getAlgebraClient()

    const data = await client.query({
      query: POOLS_ID_LIST,
      fetchPolicy: 'cache-first',
    })
    const poolsIds = data.data.pools.map((pool: any) => pool.id)
    return poolsIds
  }
  static async getPoolIdByTokens(tokenA: string, tokenB: string) {
    const pool = computePoolAddress({
      tokenA: new Token(blast.id, tokenA, 18), // decimals here are arbitrary
      tokenB: new Token(blast.id, tokenB, 18), // decimals here are arbitrary
      poolDeployer: contractAddressList.pool_deployer,
      initCodeHashManualOverride: INIT_CODE_HASH_MANUAL_OVERRIDE,
    })
    return pool
  }
  static async isBoostedPool(poolAddress: string) {
    return boostedPools.some((pool) => pool.id.toLowerCase() === poolAddress.toLowerCase())
  }
}
