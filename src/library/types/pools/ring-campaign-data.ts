import BoostedPool from '@/src/library/types/pools/boosted-pool'

interface RingCampaignData {
  boostedPools: BoostedPool[]
  totalPoints: number
  pricePerPoint: number
  pointsTotalValue: number
}

export default RingCampaignData
