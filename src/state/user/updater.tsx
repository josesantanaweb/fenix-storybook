import { useEffect } from 'react'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import axios from 'axios'

export default function UserUpdater() {
  const { account } = useActiveConnectionDetails()
  useEffect(() => {
    if (!account) return
    axios
      .post('/api/user', { account })
      .then((res) => {})
      .catch((err) => {})
  }, [account])
  return null
}
