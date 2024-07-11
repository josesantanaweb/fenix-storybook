import { gql } from '@apollo/client'

export const GET_ICHI_VAULTS_BY_IDS = gql`
  query GetVaults($ids: [String!]!) {
    ichiVaults(where: { id_in: $ids }) {
      allowTokenA
      allowTokenB
      tokenA
      tokenB
      id
    }
  }
`
