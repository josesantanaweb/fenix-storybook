import { getTotalWeight } from '@/src/library/web3/VoteManagementV3'
import { TokenData } from '@/src/library/structures/common/TokenData'
import { FNXTokenAddress } from '@/src/library/web3/ContractAddresses'
import { FETCH_LAST_EPOCH_BRIBES } from '../queries/BribesQueries'
import rewardsClient from '../RewardsClient'
import { BigDecimal } from '@/src/library/web3/common/BigDecimal'

export async function getAverageVotignAPR(availableTokensDictionary: {
  [address: string]: TokenData
}): Promise<string> {
  try {
    const bribeList: any[] = []
    let page = 0
    let queryResult: any[] = []
    do {
      const bribes = (await rewardsClient.query({
        query: FETCH_LAST_EPOCH_BRIBES(page),
        fetchPolicy: 'cache-first',
      })) as any

      queryResult = bribes.data.rewards || []
      bribeList.push(...(queryResult || []))
      page++
    } while (queryResult && queryResult.length > 0)

    // Get total USD value of all bribes, using availableTokenData.tokens to get the price of each token
    let totalUSDValue = new BigDecimal(0n, 3)
    bribeList.forEach((bribe) => {
      const token = availableTokensDictionary[bribe.tokenAddress.toLowerCase()]
      if (token) {
        const bal = new BigDecimal(bribe.tokenAmount, token.decimals)
        totalUSDValue = totalUSDValue.add(bal.mulNumber(token.price_quote || 0))
      }
    })

    const totalVotes = (await getTotalWeight()) / BigInt(10 ** 18)

    // get current chr price

    const chrToken = availableTokensDictionary[FNXTokenAddress.toLowerCase()]
    const chrPrice = chrToken?.price_quote || 0
    const chrHundredDollars = 100 / chrPrice
    // const chrTwoYearsBlock = BigInt(Math.ceil(chrHundredDollars * 1.3));
    const chrTwoYearsBlock = BigInt(Math.ceil(chrHundredDollars))

    const totalAPR = totalUSDValue.mulNumber(52).mulNumber(Number(chrTwoYearsBlock) / Number(totalVotes))

    return (
      totalAPR.toString({
        roundingMode: 1,
        maxDecimalPlaces: 2,
      }) + '%'
    )
    // return bribeList;
  } catch (e) {
    //
    return '0%'
  }
}
