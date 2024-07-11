import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useAccount } from 'wagmi'
import { REWARD_CLIENT } from '../../constants/addresses'
import { FALLBACK_CHAIN_ID } from '../../constants/chains'

// eslint-disable-next-line react-hooks/rules-of-hooks
const { chainId } = useAccount()

const rewardsClient = new ApolloClient({
  uri: chainId ? REWARD_CLIENT[chainId] : REWARD_CLIENT[FALLBACK_CHAIN_ID],
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
})

export default rewardsClient
