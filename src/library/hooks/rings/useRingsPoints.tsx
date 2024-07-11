import { useQuery } from '@tanstack/react-query'

export interface RankingEntry {
  id: string
  accumulated_rings_points: string
  ranking?: number
}
export const useRingsPointsLeaderboard = () => {
  try {
  } catch (e) {}
  const fetchPoints = async (): Promise<RankingEntry[]> => {
    const response = await fetch('/api/rings/ranking')
    const data = await response.json()
    return data.ranking
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['ringsPoints'],
    queryFn: fetchPoints,
    staleTime: 1000 * 60 * 60, // 20 minutes
  })

  return {
    isLoading,
    data: data || [],
    error: error?.message || '',
  }
}
