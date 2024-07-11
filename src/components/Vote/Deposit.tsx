'use client'

import { Button } from '@/src/components/UI'
import MainBox from '@/src/components/Common/Boxes/MainBox'
import InfoBox from '../Common/InfoBox'
import { EXCHANGE_LIST } from './data'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { voteState } from '@/src/state/vote/types'
import { useAppSelector } from '@/src/state'
import { BigDecimal } from '@/src/library/common/BigDecimal'
import { Abi, Address } from 'viem'
import { MINTER_ADDRESS } from '@/src/library/constants/addresses'
import MINTER_ABI from '@/src/library/constants/abi/Minter'
import { wagmiConfig } from '@/src/app/layout'
import { multicall } from '@wagmi/core'
import { formatAmount, fromWei } from '@/src/library/utils/numbers'

interface DepositProps {
  vote: voteState
}

const Deposit = ({ vote }: DepositProps) => {
  const [tokens, setTokens] = useState<Number>(0)
  const [weeklyEmission, setweeklyEmission] = useState<string>('0')
  const [rewardAmountUsd, setRewardAmountUsd] = useState<BigDecimal>(new BigDecimal(0n, 18))
  const { chainId } = useAccount()

  const tokensData = async () => {
    //
    if (chainId) {
      const availableTokenData = await fetchTokens(chainId)
      setTokens(availableTokenData.length)

      const weekly_emission = await multicall(wagmiConfig, {
        contracts: [
          {
            address: MINTER_ADDRESS[chainId] as Address,
            abi: MINTER_ABI as Abi,
            functionName: 'weekly_emission',
          },
        ],
      })
      EXCHANGE_LIST[3].amount = `${formatAmount(fromWei((weekly_emission[0].result as BigInt).toString()), 2, true)} FNX`
      setweeklyEmission(fromWei((weekly_emission[0].result as BigInt).toString()))

      //

      const pushExternal: BigDecimal[] = []
      const pushInternal: BigDecimal[] = []
      const a = vote.voteTableElement.map((reward) => {
        const usdValueExternal = reward.rewardPair.externalBribeReward.tokens
          .map((token, index) => {
            const tokenElement = availableTokenData.find((t) => t.tokenAddress.toLowerCase() === token.toLowerCase())
            if (!tokenElement) return new BigDecimal(0n, 18)
            return new BigDecimal(
              reward.rewardPair.externalBribeReward.amounts[index],
              Number(reward.rewardPair.externalBribeReward.decimals[index])
            ).mulNumber(Number(tokenElement.priceUSD) ?? 0)
          })
          .reduce((a, b) => b.add(a), new BigDecimal(0n, 18))
        pushExternal.push(usdValueExternal)
      })
      const b = vote.voteTableElement.map((reward) => {
        const usdValueExternal = reward.rewardPair.internalBribeReward.tokens
          .map((token, index) => {
            const tokenElement = availableTokenData.find((t) => t.tokenAddress.toLowerCase() === token.toLowerCase())
            if (!tokenElement) return new BigDecimal(0n, 18)
            return new BigDecimal(
              reward.rewardPair.internalBribeReward.amounts[index],
              Number(reward.rewardPair.internalBribeReward.decimals[index])
            ).mulNumber(Number(tokenElement.priceUSD) ?? 0)
          })
          .reduce((a, b) => b.add(a), new BigDecimal(0n, 18))
        pushInternal.push(usdValueExternal)
      })
      const totalExternal = pushExternal?.reduce((a, b) => b.add(a), new BigDecimal(0n, 18))
      const totalInternal = pushInternal?.reduce((a, b) => b.add(a), new BigDecimal(0n, 18))
      EXCHANGE_LIST[0].amount = `$ ${totalInternal.toString()}`
      EXCHANGE_LIST[1].amount = `$ ${totalExternal.toString()}`
      EXCHANGE_LIST[2].amount = `$ ${totalInternal.add(totalExternal).toString()}`

      setRewardAmountUsd(totalExternal)
      //
    }
  }

  useEffect(() => {
    tokensData()
    // fetchData()
  }, [chainId, vote])
  return (
    <MainBox>
      <div className="flex flex-col items-center justify-between w-full xl:flex-row relative z-10">
        <div className="w-full xl:w-1/2">
          <h4 className="mb-3 text-2xl font-semibold text-white">Vote</h4>
          <p className="mb-4 text-xs text-shark-100 font-normal">
            Voters earn a share of transaction fees and incentives for helping govern how emissions are distributed.
          </p>
          <div className="flex items-center flex-col md:flex-row gap-3">
            <div className="flex gap-2 items-center w-full xl:w-auto">
              <div className="bg-shark-400 p-1 rounded-lg border border-shark-400 border-1 bg-opacity-40">
                <span className="icon-clock p-1 text-lg text-gradient"></span>
              </div>
              <p className="text-white text-xs font-normal whitespace-nowrap">Current voting round</p>
            </div>
            <Button variant="tertiary" className="w-full xl:w-auto" href="/rewards">
              <span className="flex text-xs font-normal whitespace-nowrap">Claim Earnings</span>
            </Button>
          </div>
          <p className="flex items-center gap-3 py-2  text-xs text-shark-100">
            <span className="inline-block text-2xl text-transparent icon-circles bg-gradient-to-r from-outrageous-orange-500 to-festival-500 bg-clip-text"></span>
            There are currently {tokens.toString()} tokens listed.
          </p>
          <div className="text-xs flex gap-2 text-shark-100 xl:mb-0">
            {/* <p className="flex gap-1 cursor-pointer">
              <span className="icon-link"></span>
              View Tokens
            </p>
            <p className="flex gap-1 cursor-pointer">
              <span className="icon-link"></span>
              List New Token
            </p> */}
          </div>
        </div>
        <div className="relative flex flex-col w-full  mt-5 xl:mt-0 overflow-y-auto overflow-x-hidden xl:w-[40%]">
          {EXCHANGE_LIST.map((exchange, index) => (
            <InfoBox key={index} data={exchange} hasTooltip={false} />
          ))}
        </div>
      </div>
    </MainBox>
  )
}

export default Deposit
