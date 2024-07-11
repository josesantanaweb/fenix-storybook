import { AddressMap } from '../utils/address'
import { SupportedChainId } from './chains'

export const RING_POINTS_ADDRESS: AddressMap = {
  [SupportedChainId.BLAST]: '0xA7c167f58833c5e25848837f45A1372491A535eD',
}

export const OPEN_OCEAN_REFERRER: AddressMap = {
  [SupportedChainId.BLAST]: '0x67E65683B933bb389Ee2Bf8d5f4E79786dc1b441',
}

export const TOKEN_API: AddressMap = {
  [SupportedChainId.BLAST]: 'https://fenix-dex-api.vercel.app/token-prices',
  // [SupportedChainId.BLAST_SEPOLIA]: 'https://fenix-api-testnet.vercel.app/token-prices',
}
export const REWARD_API_ADDRESS: AddressMap = {
  [SupportedChainId.BLAST]: '0xF623821bD472c6458d38eC4fBBb56A2Af7B2520D',
  // [SupportedChainId.BLAST_SEPOLIA]: '0x30C2Da38cb366088c2a0e0228f80E828e1D92349',
}
export const PAIR_API_ADDRESS: AddressMap = {
  [SupportedChainId.BLAST]: '0xC6bde67CE78e5574c6B693C2FA0a2565D350e66b',
  // [SupportedChainId.BLAST_SEPOLIA]: '0x44026Eb2b649149c6FA9E9dd70A1B2381621DE6c',
}
export const REWARD_CLIENT: AddressMap = {
  [SupportedChainId.BLAST]: 'https://api.studio.thegraph.com/query/67572/fenix-bribev3/version/latest',
  // [SupportedChainId.BLAST_SEPOLIA]: 'https://api.studio.thegraph.com/query/67572/fenix-bribev3/version/latest',
}
export const ALGEBRA_SUBGRAPH: AddressMap = {
  [SupportedChainId.BLAST]:
    'https://api.goldsky.com/api/public/project_clxadvm41bujy01ui2qalezdn/subgraphs/fenix-v3-dex/ce3738b/gn',
  // [SupportedChainId.BLAST_SEPOLIA]: 'https://api.studio.thegraph.com/query/67572/fenix-algeabra-v3/version/latest',
}
export const PROTOCOL_SUBGRAPH: AddressMap = {
  [SupportedChainId.BLAST]: 'https://api.studio.thegraph.com/query/67572/mainnet-algebra-fenix/version/latest',
  // [SupportedChainId.BLAST_SEPOLIA]: 'https://api.studio.thegraph.com/query/67572/fenix-algeabra-v3/version/latest',
}
export const VE_NFT_API_ADDRESS: AddressMap = {
  [SupportedChainId.BLAST]: '0x7936BA527C9Cf7B292fe9Bba848EBacd7a7B230B',
  // [SupportedChainId.BLAST_SEPOLIA]: '0x1aF3099C0316066261fD4c0703bB733f8F3a2500',
}
export const FENIX_ADDRESS: AddressMap = {
  [SupportedChainId.BLAST]: 'FENIX_ADDRESS',
  // [SupportedChainId.BLAST_SEPOLIA]: '0xA12E4649fdDDEFD0FB390e4D4fb34fFbd2834fA6',
}
export const VOTING_ESCROW_ADDRESS: AddressMap = {
  [SupportedChainId.BLAST]: '0x8fD4fEeC9fB3d3fFb7c5e3f6Cf3A1c3A1c0f3A1c',
  // [SupportedChainId.BLAST_SEPOLIA]: '0x4dD9e7dd344a309030B22d36A567f0d99C6a5403',
}
export const MINTER_ADDRESS: AddressMap = {
  [SupportedChainId.BLAST]: '0x8fD4fEeC9fB3d3fFb7c5e3f6Cf3A1c3A1c0f3A1c',
  // [SupportedChainId.BLAST_SEPOLIA]: '0xDA283872Fc205f56cE5b0268D719373dc33e35dA',
}
export const VOTER_ADDRESS: AddressMap = {
  [SupportedChainId.BLAST]: '0x8fD4fEeC9fB3d3fFb7c5e3f6Cf3A1c3A1c0f3A1c',
  // [SupportedChainId.BLAST_SEPOLIA]: '0x6cCe3E45CCe11bE2CD4715442b0d1c3675C5D055',
}
