import gql from 'graphql-tag'

export function FETCH_LAST_EPOCH_BRIBES(page: number) {
  // Get 1 week ago timestamp
  const currentEpochTs = Math.floor(Date.now() / 1000 / 604800) * 604800
  const skip = page * 1000
  const query = `query getTotalBribes {
    rewards(where: {timestamp_gte: ${
      currentEpochTs - 604800
    }, timestamp_lt: ${currentEpochTs}}, first: 1000, skip: ${skip}, orderBy: timestamp, orderDirection: desc) {
      timestamp
      tokenAddress
      tokenAmount
    }
  }`

  return gql(query)
}

export function FETCH_CURRENT_EPOCH_BRIBES(page: number) {
  // Get 1 week ago timestamp
  const currentEpochTs = Math.floor(Date.now() / 1000 / 604800) * 604800
  const skip = page * 1000
  const query = `query getTotalBribes {
    rewards(where: {timestamp_gte: ${currentEpochTs}, timestamp_lt: ${
      currentEpochTs + 604800
    }}, first: 1000, skip: ${skip}, orderBy: timestamp, orderDirection: desc) {
      txHash
      bribe {
        isInternal
        id
      }
      tokenAmount
      tokenAddress
      timestamp
    }
  }`

  return gql(query)
}

export function FETCH_BRIBES_REWARDS(page: number) {
  const skip = page * 1000
  const query = gql`
    query FetchBribes {
      bribes(first: 1000 skip: ${skip}) {
        gauge {
          poolAddress
        }
        rewards {
          tokenAddress
          id
        }
        id
        isInternal
      }
    }
  `

  return query
}
