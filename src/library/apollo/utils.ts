import { ApolloClient, DocumentNode, NormalizedCacheObject } from '@apollo/client'

export async function queryAllForClient<T>(
  client: ApolloClient<NormalizedCacheObject>,
  query: DocumentNode,
  vars: any
) {
  let skip = 0
  let hasMore = true
  const result: T[] = []

  while (hasMore) {
    const newVariables = vars
    newVariables['first'] = 1000
    newVariables['skip'] = skip

    const { data } = await client.query({
      query,
      variables: newVariables,
      fetchPolicy: 'no-cache',
    })

    if (!data) {
      throw new Error(`Unable to query data from Client`)
    }

    // Getting the first key from data
    const key = Object.keys(data)[0]
    const queryData = data[key]

    if (queryData.length) {
      result.push(...queryData)
      skip += 1000
    } else {
      hasMore = false
    }
  }

  return result
}

export async function queryForClient<T>(client: ApolloClient<NormalizedCacheObject>, query: DocumentNode, vars: any) {
  const { data } = await client.query({
    query,
    variables: vars,
    fetchPolicy: 'no-cache',
  })

  if (!data) {
    throw new Error(`Unable to query data from Client`)
  }

  // Getting the first key from data
  const key = Object.keys(data)[0]
  const queryData = data[key]

  return queryData
}
