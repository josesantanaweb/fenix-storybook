export enum SupportedChainId {
  BLAST = 81457,
  // BLAST_SEPOLIA = 168587773,
}

export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId]
}

export const FALLBACK_CHAIN_ID = SupportedChainId.BLAST
