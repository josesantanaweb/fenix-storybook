import { AlgebraSubgraph, ProtocolSubgraph } from '../../web3/ContractAddresses'
import createApolloClient from './index'
import { SupportedChainId, SupportedDex } from '@ichidao/ichi-vaults-sdk/dist/src/types'

// const baseClient = createApolloClient(`https://api.thegraph.com/subgraphs/name/navid-fkh/symmio_base`)
// const baseClient082 = createApolloClient(`https://api.studio.thegraph.com/query/62472/intentx-main_082/version/latest`)
const ichiClient = (chainName: string, dex: SupportedDex) => {
  return `https://api.studio.thegraph.com/proxy/61136/${chainName}-v1-${dex.toLowerCase()}/version/latest`
}

export const blastClient = createApolloClient(ProtocolSubgraph)

export default function getProtocolCoreClient() {
  return blastClient
}
export const alebraClient = createApolloClient(AlgebraSubgraph)
export function getAlgebraClient() {
  return alebraClient
}
export function getIchiClient(chainName: string, dex: SupportedDex) {
  return createApolloClient(ichiClient(chainName, dex))
}
