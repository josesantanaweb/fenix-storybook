import { LockElement } from '@/src/library/structures/lock/LockElement'
import { Address } from 'viem'

export type PairVotes = {
  pair: Address
  weight: bigint
}

export type VeNFTInfo = {
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

export type lockState = {
  appState: string
  positions: LockElement[]
  veNFTInfo: VeNFTInfo
}
