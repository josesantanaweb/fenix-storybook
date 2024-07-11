//@ts-nocheck
import { VeNFTAPIV3Address, VotingEscrowAddress } from './ContractAddresses'
import { getPublicClient, getWalletClient, readContract, writeContract, writeContractAsync } from '@wagmi/core'
import { Address, Hash } from 'viem'
import { VOTING_ESCROW_ADDRESS } from '../constants/addresses'
import { LockElement } from '../structures/lock/LockElement'
import veNFTAPIABIV3 from './abis/VeNFTAPIV3ABI'
import votingEscrowABI from './abis/veFNX'
import { encodeFunctionData } from 'viem'
import { wagmiConfig } from '@/src/app/layout'
import { FALLBACK_CHAIN_ID } from '../constants/chains'
import { VE_NFT_API_ADDRESS } from '../constants/addresses'
export async function getUserVeFNXLockPositions(user: Address, chainId: number, retry = true): Promise<LockElement[]> {
  try {
    const publicClient = getPublicClient(wagmiConfig)
    const nfts = await publicClient?.readContract({
      // name: 'VeNFTAPI',
      address: chainId ? VE_NFT_API_ADDRESS[chainId] : VE_NFT_API_ADDRESS[FALLBACK_CHAIN_ID],
      abi: veNFTAPIABIV3,
      functionName: 'getNFTFromAddress',
      args: [user],
    })
    const parsedElements: LockElement[] = []

    nfts.map((nft) => {
      parsedElements.push({
        veNFTInfo: {
          decimals: nft.decimals,
          voted: nft.voted,
          attachments: nft.attachments,
          id: nft.id,
          amount: nft.amount,
          voting_amount: nft.voting_amount,
          //uint256 rebase_amount;
          lockEnd: nft.lockEnd,
          vote_ts: Number(nft.vote_ts),
          votes: nft.votes,

          account: nft.account,

          token: nft.token,
          tokenSymbol: nft.tokenSymbol,
          tokenDecimals: Number(nft.tokenDecimals),
        },
      })
    })
    return parsedElements
  } catch (e) {
    //
    if (retry) {
      return getUserVeFNXLockPositions(user, false)
    } else {
      throw e
    }
  }
}
export async function getIdVeFNXLockPositions(id: Number, chainId: number, retry = true): Promise<LockElement> {
  try {
    const nft = (await readContract(wagmiConfig, {
      // name: 'VeNFTAPI',
      address: chainId ? VE_NFT_API_ADDRESS[chainId] : VE_NFT_API_ADDRESS[FALLBACK_CHAIN_ID],
      abi: veNFTAPIABIV3,
      functionName: 'getNFTFromId',
      args: [id],
    })) as any[]

    let parsedElements: LockElement = {}

    parsedElements = {
      veNFTInfo: {
        decimals: nft.decimals,
        voted: nft.voted,
        attachments: nft.attachments,
        id: nft.id,
        amount: nft.amount,
        voting_amount: nft.voting_amount,
        //uint256 rebase_amount;
        lockEnd: nft.lockEnd,
        vote_ts: Number(nft.vote_ts),
        votes: nft.votes,

        account: nft.account,

        token: nft.token,
        tokenSymbol: nft.tokenSymbol,
        tokenDecimals: Number(nft.tokenDecimals),
      },
    }
    return parsedElements
  } catch (e) {
    if (retry) {
      return getUserVeFNXLockPositions(user, false)
    } else {
      throw e
    }
  }
}

export async function createLock(fnxAmount: bigint, lockDuration: number, chainId: number): Promise<Hash> {
  const data = await writeContract(wagmiConfig, {
    address: chainId ? VOTING_ESCROW_ADDRESS[chainId] : VOTING_ESCROW_ADDRESS[FALLBACK_CHAIN_ID],
    abi: votingEscrowABI,
    functionName: 'create_lock',
    args: [fnxAmount, BigInt(lockDuration)],
  })

  return data?.hash as Hash
}

export async function mergeLock(tokenId1: number, tokenId2: number, chainId: number): Promise<Hash> {
  const data = await writeContract(wagmiConfig, {
    address: chainId ? VOTING_ESCROW_ADDRESS[chainId] : VOTING_ESCROW_ADDRESS[FALLBACK_CHAIN_ID],
    abi: votingEscrowABI,
    functionName: 'merge',
    args: [tokenId1, tokenId2],
  })

  return data as Hash
}

export async function transferLock(from: Address, to: Address, tokenId: number, chainId: number) {
  const data = await writeContract(wagmiConfig, {
    address: chainId ? VOTING_ESCROW_ADDRESS[chainId] : VOTING_ESCROW_ADDRESS[FALLBACK_CHAIN_ID],
    abi: votingEscrowABI,
    functionName: 'transferFrom',
    args: [from, to, tokenId],
  })

  return data as Hash
}

export async function splitLock(cachos: number[], tokenId: number, chainId: number) {
  const data = await writeContract(wagmiConfig, {
    address: chainId ? VOTING_ESCROW_ADDRESS[chainId] : VOTING_ESCROW_ADDRESS[FALLBACK_CHAIN_ID],
    abi: votingEscrowABI,
    functionName: 'split',
    args: [cachos, tokenId],
  })

  return data as Hash
}

export async function increaseLock(tokenId: number, amount: bigint, chainId: number): Promise<Hash> {
  const data = await writeContract(wagmiConfig, {
    address: chainId ? VOTING_ESCROW_ADDRESS[chainId] : VOTING_ESCROW_ADDRESS[FALLBACK_CHAIN_ID],
    abi: votingEscrowABI,
    functionName: 'deposit_for',
    args: [tokenId, amount],
  })

  return data as Hash
}

export async function increaseLockUntilTime(tokenId: number, lockUntil: number, chainId: number): Promise<Hash> {
  const data = await writeContract(wagmiConfig, {
    address: chainId ? VOTING_ESCROW_ADDRESS[chainId] : VOTING_ESCROW_ADDRESS[FALLBACK_CHAIN_ID],
    abi: votingEscrowABI,
    functionName: 'increase_unlock_time',
    args: [tokenId, lockUntil],
  })

  return data as Hash
}

export async function withdraw(tokenId: BigInt): Promise<Hash> {
  const provider = getPublicClient(wagmiConfig)
  const signer = await getWalletClient(wagmiConfig)
  const gas = await provider?.estimateGas({
    // args: [tokenId],
    data: encodeFunctionData({
      abi: votingEscrowABI,
      functionName: 'withdraw',
      args: [tokenId],
    }),
    to: VotingEscrowAddress,
    account: signer.account,
  })
  //
  const data = await writeContract(wagmiConfig, {
    address: VotingEscrowAddress,
    abi: votingEscrowABI,
    functionName: 'withdraw',
    args: [tokenId],
    gas: gas,
  })

  return data as Hash
}
