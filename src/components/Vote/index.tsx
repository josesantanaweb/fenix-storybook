'use client'
import { useState, useEffect, useCallback } from 'react'
import Deposit from '@/src/components/Vote/Deposit'
import VoteNow from './VoteNow/VoteNow'
import Filter from '@/src/components/Common/Filter'
import Search from '@/src/components/Common/Search'

import { DATA_ROW } from '../Liquidity/data'
import VotePools from './VoteNow/VotePools'
import SelectVote from '../Modals/SelectVote'
import Overlay from './Overlay'
import { FILTER_OPTIONS } from './data'
import HeaderRowVote from './Tables/HeaderRowVote'
import { AppThunkDispatch, useAppSelector } from '@/src/state'
import { lockState } from '@/src/state/lock/types'
import { LockElement } from '@/src/library/structures/lock/LockElement'
import { BigDecimal } from '@/src/library/common/BigDecimal'
import { getAllPairsForUser } from '@/src/library/web3/apis/PairAPIV3'
import { useAccount } from 'wagmi'
import { getAvailableTokens } from '@/src/library/web3/common/TokenManagement'
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { getAllClPairRewards, getAllPairRewards } from '@/src/library/web3/RewardAPIV3Management'
import { Token } from '@/src/library/structures/common/TokenData'
import { NULL_ADDRESS } from '@/src/library/Constants'
import { PairInfoV3 } from '@/src/library/web3/apis/pairAPI'
import { RewardPairInfo } from '@/src/library/web3/apis/RewardAPIData'
import { voteState } from '@/src/state/vote/types'
import { fetchGaugesAsync } from '@/src/state/vote/reducer'
import { useDispatch } from 'react-redux'

export interface VoteTableElement {
  voteDollarValue: number
  pair: PairInfoV3
  rewardPair: RewardPairInfo
  voteWeight: bigint
  poolAPR: number
  voteWeightPercentage?: BigDecimal
  yourVoteWeightPercentage: BigDecimal
  yourVoteWeight: bigint
  dollarRewardsValue: BigDecimal
  token0Symbol: string
  token1Symbol: string
}

const Vote = () => {
  const [currentTab, setCurrentTab] = useState('ALL')
  const [activeVote, setActiveVote] = useState(false)
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  // const filterData = DATA_ROW.filter((row) => row.type === currentTab)
  const [nowTime, setnowTime] = useState<Number>(0)
  const [isVoteLoading, setIsVoteLoading] = useState(true)
  const [lock, setLock] = useState<LockElement>()
  const [voteTableElements, setVoteTableElements] = useState([] as VoteTableElement[])
  const [voteValue, setVoteValue] = useState<Number>(0)
  const [searchValue, setSearchValue] = useState<string>('')
  const { address, chainId } = useAccount()
  const vote = useAppSelector((state) => state.vote as voteState)
  const locks = useAppSelector((state) => state.lock as lockState)
  const dispatch = useDispatch<AppThunkDispatch>()

  useEffect(() => {
    if (address && chainId) dispatch(fetchGaugesAsync({ address, chainId }))
  }, [address, chainId, locks])

  useEffect(() => {
    updateCurrentVotePairs()
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  const updateCurrentVotePairs = useCallback(async () => {
    if (!address) {
      setIsVoteLoading(false)
      return
    }
    if (chainId) {
      const availableTokenData = await fetchTokens(chainId)
      //
      if (!availableTokenData) {
        //
        setIsVoteLoading(false)
        return
      }

      setIsVoteLoading(true)
      const tokensObject: Record<string, Token> = {}
      availableTokenData.forEach((token) => {
        tokensObject[token.tokenAddress] = {
          id: token.tokenAddress,
          symbol: token.basetoken.symbol,
          name: token.basetoken.name,
          decimals: token.decimals,
        }
      })
      //
      const r = await getAllPairRewards(address, tokensObject, chainId)
      const rCL = await getAllClPairRewards(address, tokensObject, chainId)

      //

      const validRewards = [
        ...r.filter((r) => {
          return r._pool !== NULL_ADDRESS && r._gauge !== NULL_ADDRESS
        }),
        ...rCL.filter((r) => {
          return r._pool !== NULL_ADDRESS && r._gauge !== NULL_ADDRESS
        }),
      ]
      //
      let totalVotingPower = 0n
      let userTotalVotingPower = 0n
      validRewards.forEach((r) => {
        totalVotingPower += r.totalVotesOnGauge
        userTotalVotingPower += r.totalVotesOnGaugeByUser
      })

      const chrTokenPrice = 1

      const availablePairsV3 = await getAllPairsForUser(address, chainId)

      const voteElements: VoteTableElement[] = []
      validRewards.forEach((reward) => {
        const pair = availablePairsV3.find((pair) => pair.gauge.toLowerCase() === reward._gauge.toLowerCase())!

        if (!pair) {
          return
        }

        const usdValueExternal = reward.externalBribeReward.tokens
          .map((token, index) => {
            const tokenElement = availableTokenData!.find((t) => t.tokenAddress.toLowerCase() === token.toLowerCase())
            if (!tokenElement) return new BigDecimal(0n, 18)
            return new BigDecimal(
              reward.externalBribeReward.amounts[index],
              Number(reward.externalBribeReward.decimals[index])
            ).mulNumber(1)
          })
          .reduce((a, b) => b.add(a), new BigDecimal(0n, 18))

        const usdValueInternal = reward.internalBribeReward.tokens
          .map((token, index) => {
            const tokenElement = availableTokenData!.find((t) => t.tokenAddress.toLowerCase() === token.toLowerCase())
            if (!tokenElement) {
              return new BigDecimal(0n, 18)
            }
            return new BigDecimal(
              reward.internalBribeReward.amounts[index],
              Number(reward.internalBribeReward.decimals[index])
            ).mulNumber(1)
          })
          .reduce((a, b) => b.add(a), new BigDecimal(0n, 18))

        const currentVotingAmount = lock?.veNFTInfo
          ? new BigDecimal(lock?.veNFTInfo.voting_amount, 18)
          : new BigDecimal(0n, 18)
        const parsedVoteWeight = new BigDecimal(reward.totalVotesOnGauge, 18)

        const pairToken0Details = tokensObject[pair.token0.toLowerCase()]
        const pairToken1Details = tokensObject[pair.token1.toLowerCase()]

        const token0Symbol = pairToken0Details ? pairToken0Details.symbol : pair.token0_symbol
        const token1Symbol = pairToken1Details ? pairToken1Details.symbol : pair.token1_symbol

        const voteDollarValue =
          ((usdValueExternal.toRoundedFloat() + usdValueInternal.toRoundedFloat()) /
            (parsedVoteWeight.toRoundedFloat() + currentVotingAmount.toRoundedFloat())) *
          currentVotingAmount.toRoundedFloat()

        // if (isNaN(voteDollarValue)) {
        //   voteDollarValue = 0;
        // }

        const getPoolAPR = () => {
          // TODO: FUSDC APR BUG
          // if (token0Symbol === 'FUSDC') {
          //   debugger;
          //
          //
          // }
          if (reward.totalVotesOnGauge > 0n) {
            const totalVotesOnGaugeBigDecimal = new BigDecimal(reward.totalVotesOnGauge, 18)
              .mulNumber(chrTokenPrice)
              .toRoundedFloat()

            // if (token0Symbol === 'FUSDC') {
            //
            //
            //
            //
            //
            //
            //
            // }

            return (usdValueExternal.add(usdValueInternal).toRoundedFloat() * 100 * 52.1) / totalVotesOnGaugeBigDecimal
          }
          return usdValueExternal.add(usdValueInternal).toRoundedFloat()
        }

        voteElements.push({
          voteDollarValue,
          pair: pair,
          voteWeight: reward.totalVotesOnGauge,
          voteWeightPercentage:
            totalVotingPower > 0n
              ? BigDecimal.div2BigInt(reward.totalVotesOnGauge, totalVotingPower, 18)
              : new BigDecimal(0n, 18),
          rewardPair: reward,
          poolAPR: getPoolAPR(),
          dollarRewardsValue: usdValueExternal.add(usdValueInternal),
          yourVoteWeight: reward.totalVotesOnGaugeByUser,
          yourVoteWeightPercentage:
            userTotalVotingPower > 0n
              ? BigDecimal.div2BigInt(reward.totalVotesOnGaugeByUser, userTotalVotingPower, 18)
              : new BigDecimal(0n, 18),
          token0Symbol,
          token1Symbol,
        } as VoteTableElement)
      })

      voteElements.sort((a, b) => {
        if (a.voteWeight! > b.voteWeight!) {
          return -1
        }
        if (a.voteWeight! < b.voteWeight!) {
          return 1
        }
        return 0
      })
      //
      // sentryTx.endTimestamp = parseInt((Date.now() / 1000).toFixed(0));
      // sentryTx.finish();
      // Sentry.flush(2000).then(() =>
      setVoteTableElements(voteElements)
      setIsVoteLoading(false)
    }
  }, [address, chainId])

  const [poolArr, setPoolArr] = useState<any>([])

  const removePool = (id: any) => {
    const filterArr = poolArr.filter((pool: any) => pool.id !== id)
    setPoolArr(filterArr)
  }

  useEffect(() => {
    const total: number = poolArr.reduce(
      (acc: number, current: { percentage: number }) => acc + Number(current.percentage),
      0
    )
    setVoteValue(total)
  }, [poolArr])

  useEffect(() => {
    setPoolArr([])
  }, [lock])

  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-col items-center gap-5 py-5 xl:flex-row">
        <div className="w-full xl:w-[60%]">
          <Deposit vote={vote} />
        </div>
        <div className="w-full xl:w-[40%] ">
          <VoteNow lock={lock} openModal={openModal} setOpenModal={setOpenModal} activeVote={activeVote} />
        </div>
      </div>
      <h1 className="text-xl font-medium text-white">Select Liquidity Pools for Voting</h1>
      <div className="flex flex-col items-center justify-between gap-5 mt-5 mb-10 xl:flex xl:flex-row">
        <div className="w-full xl:w-2/3">
          <Filter options={FILTER_OPTIONS} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>
        <div className="w-full xl:w-1/3">
          <Search setSearchValue={setSearchValue} searchValue={searchValue} placeholder="Search by symbol" />
        </div>
      </div>
      {activeVote && (
        <div className="mb-5">
          <h2 className="text-sm font-medium text-white">Vote Pools</h2>
          <div className="relative flex flex-row gap-2 justify-start overflow-x-auto overflow-y-hidden p-2">
            <div className="flex gap-2 transform translate-x-2 min-w-max">
              {poolArr.length > 0 &&
                poolArr.map((pool: any, index: number) => (
                  <VotePools key={index} data={pool} removePool={removePool} />
                ))}
            </div>
          </div>
        </div>
      )}
      <HeaderRowVote
        activeVote={activeVote}
        filterData={voteTableElements}
        loading={loading}
        // setVotePercentage={setVoteValue}
        vote={vote}
        lock={locks}
        tab={currentTab}
        search={searchValue}
        poolArr={poolArr}
        setPoolArr={setPoolArr}
      />
      <SelectVote
        activeVote={activeVote}
        setActiveVote={setActiveVote}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setlock={setLock}
      />

      <div className="p-5 mx-auto fixed bottom-4 z-50 left-0 xl:w-1/2 right-0 md:block">
        {activeVote && <Overlay voteValue={voteValue} lockInfo={lock} poolArr={poolArr} />}
      </div>
    </section>
  )
}

export default Vote
function dispatch(arg0: any) {
  throw new Error('Function not implemented.')
}
