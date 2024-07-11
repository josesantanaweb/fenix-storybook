import { useCallback, useEffect, useState } from 'react'
import useActiveConnectionDetails from '../web3/useActiveConnectionDetails'

export default function useBlastPoints() {
  const [points, setPoints] = useState<{
    givenPoints: number
    pendingPoints: number
    pendingFinalizedAt: number
    userAddress: string
  } | null>(null)

  const { account } = useActiveConnectionDetails()

  const [loading, setLoading] = useState(true)

  const fetchPoints = useCallback(async () => {
    if (!account) {
      setPoints(null)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/blastpoints/stats/user-details/${account}`)
      .then((res) => {
        res.json().then((data) => {
          setPoints(data)
        })
      })
      .catch((err) => {
        setPoints(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [account])

  useEffect(() => {
    setPoints({
      givenPoints: 0,
      pendingPoints: 0,
      pendingFinalizedAt: 0,
      userAddress: account!,
    })
    fetchPoints()
  }, [account, fetchPoints])

  return {
    points,
    isLoading: loading,
    refetch: fetchPoints,
  }
}
