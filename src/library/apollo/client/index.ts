import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { AlgebraSubgraph } from '../../web3/ContractAddresses'

export default function createApolloClient(uri: string) {
  return new ApolloClient({
    link: new HttpLink({
      uri,
    }),
    ssrMode: typeof window === 'undefined',
    connectToDevTools: typeof window !== 'undefined' && process.env.NODE_ENV === 'development',
    cache: new InMemoryCache(),
  })
}

// Create an Apollo Client instance
export const algebra_client = new ApolloClient({
  uri: AlgebraSubgraph,
  cache: new InMemoryCache(),
})
