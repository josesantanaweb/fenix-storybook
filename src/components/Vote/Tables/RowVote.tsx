'use client'
import Image from 'next/image'
import { TableCell, TableRow, Button } from '@/src/components/UI'
import InputRange from '../../UI/SliderRange/InputRange'
import { SetStateAction, useEffect, useState } from 'react'
import MobileRowVote from './MobileRowVote'
import { AppThunkDispatch } from '@/src/state'
import { useDispatch } from 'react-redux'
import { setpercentage } from '@/src/state/vote/reducer'
import { VoteTableElement } from '@/src/state/vote/types'
import { BigDecimal } from '@/src/library/web3/common/BigDecimal'

interface RowDataProps {
  index: number
  row: VoteTableElement
  activeVote: boolean
  activeSlider?: boolean
  // setVoteValue: (value: Number) => void
  // onRangeUpdate: (index: number, value: number) => void
  poolArr: any
  setPoolArr: (value: any) => void
}

const RowDataVote = ({
  index,
  row,
  activeVote,
  activeSlider,
  // setVoteValue,
  // onRangeUpdate,
  poolArr,
  setPoolArr,
}: RowDataProps) => {
  const [changeValue, setChangeValue] = useState(0)
  const [openInfo, setOpenInfo] = useState<boolean>(false)
  useEffect(() => {
    const isPoolPresent = poolArr.filter((pool: any) => pool.id === row.pair.pair_address)
    if (isPoolPresent && isPoolPresent.length > 0) {
      setChangeValue(isPoolPresent[0].percentage)
    } else {
      setChangeValue(0)
    }
  }, [poolArr, row])
  // FIXME: CHECK MOBILE, MOBILE IS COMMENTED OUT DUE TS ERROR
  return (
    <>
      {/* <TableRow className="w-full hidden xl:flex"> */}
      <TableRow className="w-full">
        <TableCell className="w-[30%]">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Image
                src={`/static/images/tokens/${row.token0Symbol}.png`}
                alt="token"
                className="rounded-full w-7 h-7"
                width={20}
                height={20}
              />
              <Image
                src={`/static/images/tokens/${row.token1Symbol}.png`}
                alt="token"
                className="-ml-4 rounded-full w-7 h-7"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm text-white">
                {row.token0Symbol} / {row.token1Symbol}
              </h5>
              <div className="flex items-center gap-2">
                {!row.hasOwnProperty('stable')}
                {!row.pair.hasOwnProperty('stable') ? (
                  <span
                    className="py-1 px-2  text-xs rounded-lg 
                        bg-green-500 border border-solid border-1 border-green-400 bg-opacity-40 "
                  >
                    Concentrated
                  </span>
                ) : row.pair.stable ? (
                  <span className="text-white py-1 px-3 text-xs rounded-lg border bg-shark-400 border-shark-400">
                    Stable Pool
                  </span>
                ) : (
                  <span className="text-white py-1 px-3 text-xs rounded-lg border bg-shark-400 border-shark-400">
                    Volatile Pool
                  </span>
                )}

                <span className="py-1 px-3  text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
                  {!row.pair.hasOwnProperty('stable') ? Number(row.pair.fee) / 10000 : Number(row.pair.feeAmount) / 100}{' '}
                  %
                </span>
                {/* <Button variant="tertiary" className="!py-1">
                  <span className="icon-info"></span>
                </Button> */}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="w-[10%] flex justify-center">
          <div className="flex items-center">
            <p className="py-2 px-3  text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
              {row.poolAPR.toFixed(2)}%
            </p>
          </div>
        </TableCell>
        <TableCell className="w-[15%]">
          <div className="flex flex-col items-end justify-end w-full px-3">
            <p className="mb-1 text-xs text-white">
              {row.voteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 }) + '%'}
            </p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-xs text-shark-100">
                {/* <Image
                  src="/static/images/tokens/ETH.svg"
                  alt="token"
                  className="w-5 h-5 rounded-full"
                  width={20}
                  height={20}
                /> */}
                {new BigDecimal(row.voteWeight, 18).toString({ maxDecimalPlaces: 2 }) + ' veFnx'}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className="w-[15%]">
          <div className="flex flex-col items-end justify-end w-full px-3">
            <p className="mb-1 text-xs text-white">
              {row.yourVoteWeightPercentage.mulNumber(100).toString({ maxDecimalPlaces: 2 }) + '%'}
            </p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-xs text-shark-100">
                {/* <Image
                  src="/static/images/tokens/ETH.svg"
                  alt="token"
                  className="w-5 h-5 rounded-full"
                  width={20}
                  height={20}
                /> */}
                {new BigDecimal(row.yourVoteWeight, 18).toString({ maxDecimalPlaces: 2 }) + ' veFnx'}
              </p>
            </div>
          </div>
        </TableCell>

        <TableCell className="w-[10%]">
          <div className="relative flex items-center justify-end w-full gap-3">
            {/* <div className="flex flex-col items-end gap-3"> */}
            {row.rewardPair.externalBribeReward.amounts.length > 0 ? (
              <>
                {' '}
                {openInfo && (
                  <>
                    {/* <div className="absolute z-1000 bg-shark-950 rounded-lg border border-shark-300 w-auto lg:w-[200px] top-9 px-5 py-3 transform left-1/2 -translate-x-1/2 gap-y-1"> */}
                    <div className="absolute z-1000 bg-shark-950 rounded-lg border border-shark-300 w-auto lg:w-[200px] top-9 px-5 py-3 gap-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex flex-col justify-center items-start">
                          {row.rewardPair.externalBribeReward.amounts.length > 0 ? (
                            <p className="text-white text-xs">Bribe</p>
                          ) : null}
                          {row.rewardPair.externalBribeReward.amounts.map((reward, index) => {
                            return (
                              <p key={index} className="flex items-center gap-2 text-xs text-shark-100">
                                {parseInt(reward.toString()) /
                                  10 ** Number(row.rewardPair.externalBribeReward.decimals[index].toString())}{' '}
                                {row.rewardPair.externalBribeReward.symbols[index]}
                              </p>
                            )
                          })}
                        </div>
                        <div className="flex flex-col justify-center items-start">
                          {row.rewardPair.internalBribeReward.amounts.length > 0 ? (
                            <p className="text-white text-xs">Fees</p>
                          ) : null}
                          {row.rewardPair.internalBribeReward.amounts.map((reward, index) => {
                            return (
                              <p key={index} className="flex items-center gap-2 text-xs text-shark-100">
                                {parseInt(reward.toString()) /
                                  10 ** Number(row.rewardPair.internalBribeReward.decimals[index].toString())}{' '}
                                {row.rewardPair.internalBribeReward.symbols[index]}
                              </p>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <p className="text-white text-xs">$ {row.dollarRewardsValue.toString()}</p>
                <span
                  className="icon-info"
                  onMouseEnter={() => setOpenInfo(true)}
                  onMouseLeave={() => setOpenInfo(false)}
                ></span>
              </>
            ) : null}
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* <div className="flex"> */}
            {/* <p className="mb-1 text-xs text-white">Fees</p>
              <p className="flex items-center gap-2 text-xs text-shark-100">744,621.46 usdt</p>
              <p className="flex items-center gap-2 text-xs text-shark-100">132.49 usdt</p> */}
            {/* </div> */}
            <div className="flex gap-2 items-center"></div>
          </div>
          {/* </div> */}
        </TableCell>

        <TableCell className="flex items-center justify-end w-[20%]">
          {activeSlider ? (
            <div className="w-4/5">
              <div>
                <InputRange
                  step={1}
                  max={100}
                  min={0}
                  height={7}
                  value={changeValue}
                  onChange={(value) => {
                    setChangeValue(value)
                    // setVoteValue(value)
                    // onRangeUpdate(index, value)
                    const pairString = !row.pair.hasOwnProperty('stable')
                      ? 'Concentrated'
                      : row.pair.stable
                        ? 'Stable Pool'
                        : 'Volatile Pool'
                    const percentageObj: any = {
                      id: row.pair.pair_address,
                      token0: row.token0Symbol,
                      token1: row.token1Symbol,
                      pair: pairString,
                      percentage: value,
                    }
                    const isPresent = poolArr.findIndex((item: { id: string }) => item.id === row.pair.pair_address)
                    if (isPresent !== -1 && value === 0) {
                      setPoolArr((prev: any) => prev.filter((pool: any) => pool.id !== row.pair.pair_address))
                    } else if (isPresent !== -1 && value > 0) {
                      setPoolArr((prev: any) => {
                        prev[isPresent] = percentageObj
                        return [...prev]
                      })
                    } else {
                      if (value > 0) {
                        setPoolArr((prev: any) => [...prev, percentageObj])
                      }
                    }
                  }}
                  thumbSize={18}
                  disabled={!activeVote}
                />
                <div className="flex justify-between text-sm text-shark-100">{changeValue} %</div>
              </div>
            </div>
          ) : (
            <div>
              <Button variant="tertiary" className="flex gap-2 items-center !text-xs">
                <span className="icon-logout"></span>
                Claim Rewards
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
      {/* <MobileRowVote
        changeValue={changeValue}
        activeVote={activeVote}
        activeSlider={activeSlider}
        setChangeValue={setChangeValue}
        row={row}
      /> */}
    </>
  )
}

export default RowDataVote
