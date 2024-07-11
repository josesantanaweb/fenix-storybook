// helpers
import { toBN } from '@/src/library/utils/numbers'

// models
import BoostedPool from '@/src/library/types/pools/boosted-pool'

export function buildAprRingsMap(data?: BoostedPool[]): { [key: string]: string } {
  if (!data) {
    return {}
  }

  return data.reduce((map, { id, apr }) => ({ ...map, [id.toLowerCase()]: toBN(apr || 0).toString() }), {})
}
