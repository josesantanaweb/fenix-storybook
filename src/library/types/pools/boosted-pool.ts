import extraPoints from './extra-points'

interface BoostedPool {
  id: string
  points: number
  blastGold: number
  multiplier?: number
  apr: number
  pair?: string
  distributionDays?: number
  extraPoints?: extraPoints[]
  poolType: 'v2' | 'v3'
}

export default BoostedPool
