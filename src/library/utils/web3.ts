import { ethers } from 'ethers'

export const getWeb3Provider = () => {
  let web3Provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
  if (typeof window !== 'undefined' && window.ethereum) {
    web3Provider = new ethers.providers.Web3Provider(window.ethereum)
  } else {
    web3Provider = new ethers.providers.JsonRpcProvider('https://rpc.blast.io')
  }
  return web3Provider
}
