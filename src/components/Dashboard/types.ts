import { DATA_ROW } from '@/src/components/Liquidity/data'
import { voteState } from '@/src/state/vote/types'
import { lockState } from '@/src/state/lock/types'

export const PROPS_CLASSIC_LIQUIDITY = {
  titleHeader: 'In Wallet',
  titleHeader2: 'LP Balance',
  titleButton: 'claim',
  titleButton2: 'Manage',
  activePagination: false,
  activeRange: false,
  loading: false,
}

export const PROPS_CONCENTRATED_LIQUIDITY = {
  titleHeader: 'In Wallet',
  titleHeader2: 'Emissions',
  titleButton: 'claim',
  titleButton2: 'Manage',
  activePagination: false,
  activeRange: true,
  loading: false,
}

export const PROPS_HEADER_ROW_VOTE = {
  activeSlider: false,
  activeVote: false,
  activePagination: false,
  filterData: DATA_ROW,
  loading: false,
} as any
