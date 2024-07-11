import { RewardPairInfo } from '@/src/library/web3/apis/RewardAPIData'
import { PairInfoV3 } from '@/src/library/web3/apis/pairAPI'
import { BigDecimal } from '@/src/library/web3/common/BigDecimal'

export interface VoteTableElement {
  voteDollarValue: number
  pair: PairInfoV3
  rewardPair: RewardPairInfo
  voteWeight: bigint
  poolAPR: number
  voteWeightPercentage?: BigDecimal
  yourVoteWeightPercentage: BigDecimal
  yourVoteWeight: bigint
  dollarRewardsValue: BigDecimal
  token0Symbol: string
  token1Symbol: string
}

export type voteState = {
  appState: string
  votes: number[]
  percentage: number
  voteTableElement: VoteTableElement[]
}
