import { Currency, ExtendedNative, WNATIVE } from '@cryptoalgebra/integral-sdk'
import { ADDRESS_ZERO } from '@cryptoalgebra/integral-sdk'
import { DEFAULT_CHAIN_ID, DEFAULT_NATIVE_SYMBOL, DEFAULT_NATIVE_NAME } from './default-chain-id'
import { useAlgebraToken } from './useAlgebraToken'

export function useCurrency(address: `0x${string}` | undefined): Currency | ExtendedNative | undefined {
  //   const isWNative = address?.toLowerCase() === WNATIVE[0x13e31].address.toLowerCase()
  const isWNative = false
  //   const isNative = address === ADDRESS_ZERO
  const isNative = false
  const token = useAlgebraToken(isNative || isWNative ? ADDRESS_ZERO : address)

  //   const extendedEther = ExtendedNative.onChain(DEFAULT_CHAIN_ID, DEFAULT_NATIVE_SYMBOL, DEFAULT_NATIVE_NAME)

  //   if (isWNative) return extendedEther.wrapped

  //   return isNative ? extendedEther : token
  return token
}
