import ERC20ABI from '../abis/TokenERC20ABI'
import ERC721ABI from '../abis/TokenERC721ABI'

import { fetchBalance, readContract, writeContract } from '@wagmi/core'
import { Address, Hash } from 'viem'
import { NULL_ADDRESS } from '../../Constants'
import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { wagmiConfig } from '@/src/app/layout'
import { ProtocolSubgraph } from '../ContractAddresses'

const GET_AVAILABLE_TOKENS = gql`
  query {
    tokens(first: 5) {
      id
      symbol
      name
      decimals
    }
  }
`

export async function getAvailableTokens(): Promise<{
  tokens: { id: string; symbol: string; name: string; decimals: string }[]
}> {
  const client = new ApolloClient({
    uri: ProtocolSubgraph,
    cache: new InMemoryCache(),
  })

  try {
    //@ts-ignore
    const response = await client.query({
      query: GET_AVAILABLE_TOKENS,
    })

    return response.data
  } catch (error) {
    console.error('Error fetching available tokens:', error)
    throw error // Re-throw for handling in the calling code
  }
}

/**
 * ERC721ABI: isApprovedForAll
 *
 * Check if operator is approved to spend all NFTs
 * @param userAddress
 * @param operator
 * @param nftContractAddress
 * @returns
 */
export async function checkIsApproveForAllOperator(
  userAddress: Address,
  operator: Address,
  nftContractAddress: Address
): Promise<boolean> {
  const isApproved = (await readContract(wagmiConfig, {
    address: nftContractAddress,
    abi: ERC721ABI,
    functionName: 'isApprovedForAll',
    args: [userAddress, operator],
  })) as boolean

  return isApproved
}

/**
 * ERC721: setApprovalForAll
 *
 * Approve to spend all NFTs
 * @param operator
 * @param approved
 * @param nftContractAddress
 * @returns
 */
export async function setApproveAllNFTsForOperator(
  operator: Address,
  approved: boolean,
  nftContractAddress: Address
): Promise<Hash> {
  const data = await writeContract(wagmiConfig, {
    address: nftContractAddress,
    abi: ERC721ABI,
    functionName: 'setApprovalForAll',
    args: [operator, approved],
  })

  return data as Hash
}

/**
 * ERC721: approve
 *
 * Approve to spend NFT
 * @param to
 * @param tokenId
 * @param nftContractAddress
 * @returns
 */
export async function approveNFTs(to: Address, tokenId: number, nftContractAddress: Address): Promise<Hash> {
  const data = await writeContract(wagmiConfig, {
    address: nftContractAddress,
    abi: ERC721ABI,
    functionName: 'approve',
    args: [to, tokenId],
  })

  return data as Hash
}

/**
 * ERC20: approve
 *
 * Approve allowanceAddress to spend tokenAddress
 * @param tokenAddress
 * @param amount
 * @param allowanceAddress
 * @returns
 */
export async function approveTokenUsage(tokenAddress: Address, allowanceAddress: Address): Promise<Hash> {
  // Approve allowanceAddress to spend tokenAddress

  const data = await writeContract(wagmiConfig, {
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'approve',
    args: [allowanceAddress, (BigInt(1) << BigInt(256)) - BigInt(1)],
  })

  return data as Hash
}

/**
 * ERC20: allowance
 *
 * Obtain the tokens approved for routerAddress by address of tokenAddress
 * @param address
 * @param tokenAddress
 * @param allowanceAddress
 * @returns
 */
export async function getTokenAllowance(
  address: Address,
  tokenAddress: Address,
  allowanceAddress: Address
): Promise<number> {
  // Obtain the tokens approved for routerAddress by address of tokenAddress
  try {
    const allowance = (await readContract(wagmiConfig, {
      address: tokenAddress,
      abi: ERC20ABI,
      functionName: 'allowance',
      args: [address, allowanceAddress],
    })) as any
    //
    return parseInt(allowance.toString())
  } catch (e) {
    return 0
  }
}

/**
 * ERC20: balanceOf
 *
 * Obtain the balance of tokenAddress for userAddress
 * @param userAddress
 * @param tokenAddress
 * @returns
 */
// export async function getTokenBalance(userAddress: Address, tokenAddress: Address): Promise<bigint> {
//   // Obtain the balance of tokenAddress for userAddress
//   if (tokenAddress == NULL_ADDRESS) {
//     // ETH
//     const balance = await fetchBalance({ address: userAddress })
//     return BigInt(balance.value)
//   } else {
//     // ERC20
//     const balance = await fetchBalance({ address: userAddress, token: tokenAddress })
//     return BigInt(balance.value)
//   }
// }
