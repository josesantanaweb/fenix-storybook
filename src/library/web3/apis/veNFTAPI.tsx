import { Address } from 'viem'

export interface PairVotes {
  pair: Address
  weight: bigint
}

export interface VeNFTInfo {
  decimals: number

  voted: boolean
  attachments: bigint

  id: bigint
  amount: bigint
  voting_amount: bigint
  //uint256 rebase_amount;
  lockEnd: bigint
  vote_ts: number
  votes: PairVotes[]

  account: Address

  token: Address
  tokenSymbol: string
  tokenDecimals: number
}

export interface Reward {
  id: number
  amount: number
  decimals: number

  pair: Address
  token: Address
  fee: Address
  bribe: Address

  symbol: string
}
