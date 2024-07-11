export const getAllGammaPairs = () => {
  //  TODO
}

// export const getGammaPairsForTokens = (
//   chainId?: ChainId,
//   address0?: string,
//   address1?: string,
//   feeAmount?: FeeAmount
// ) => {
//   const config = getConfig(chainId)
//   const gammaAvailable = config['gamma']['available']
//   if (gammaAvailable && chainId && address0 && address1) {
//     const gammaPairs = GammaPairs[chainId]
//     if (!gammaPairs) return
//     const pairs =
//       gammaPairs[address0.toLowerCase() + '-' + address1.toLowerCase() + `${feeAmount ? `-${feeAmount}` : ''}`]
//     const reversedPairs =
//       gammaPairs[address1.toLowerCase() + '-' + address0.toLowerCase() + `${feeAmount ? `-${feeAmount}` : ''}`]
//     if (pairs) {
//       return { reversed: false, pairs }
//     } else if (reversedPairs) {
//       return { reversed: true, pairs: reversedPairs }
//     }
//     return
//   }
//   return
// }
