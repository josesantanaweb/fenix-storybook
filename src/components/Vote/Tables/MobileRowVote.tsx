import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import InputRange from '@/src/components/UI/SliderRange/InputRange'
import { VoteTableElement } from '@/src/state/vote/types'
import { BigDecimal } from '@/src/library/web3/common/BigDecimal'

interface RowDataProps {
  index: number
  row: VoteTableElement
  activeVote: boolean
  activeSlider?: boolean
  // onRangeUpdate: (index: number, value: number) => void
  poolArr: any
  setPoolArr: (value: any) => any
}

const MobileRowVote = ({ index, row, activeVote, activeSlider, poolArr, setPoolArr }: RowDataProps) => {
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <>
      <div
        className={`border border-shark-950 px-3 py-2 rounded-[10px] bg-shark-400 ${
          isOpen ? 'bg-opacity-60' : 'bg-opacity-20'
        } ${'xl:block'}`}
      >
        <div className="flex gap-[9px] justify-between items-center">
          <div className="flex items-center">
            <div className="relative flex items-center mr-2">
              <Image
                src={`/static/images/tokens/${row.token0Symbol}.svg`}
                alt="token"
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
              <Image
                src={`/static/images/tokens/${row.token1Symbol}.svg`}
                alt="token"
                className="w-8 h-8 -ml-5 rounded-full"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold leading-normal mb-1.5">
                {row.token0Symbol} / {row.token1Symbol}
              </h5>
              <div className="flex items-center gap-2">
                <span className="py-1 px-3  text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
                  {!row.pair.hasOwnProperty('stable') ? Number(row.pair.fee) / 10000 : Number(row.pair.feeAmount) / 100}{' '}
                  %
                </span>
                {/* <Button
                  variant="tertiary"
                  className="!py-1 !text-xs border !border-shark-400 !rounded-[10px] !bg-shark-400 !bg-opacity-40 !h-[30px] !px-[7px]"
                >
                  <span className="icon-info"></span>
                </Button> */}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mx-2">
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
            </div>
            <button type="button" className="ml-auto" onClick={() => setIsOpen(!isOpen)}>
              <span className={`icon-chevron text-xs leading-[0] block ${isOpen ? 'rotate-180' : ''}`}></span>
            </button>
          </div>
        </div>

        {isOpen && (
          <>
            <div className="flex flex-col gap-2.5 mt-[21px] mb-2.5">
              <div className="flex items-start justify-between border border-shark-300 p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">APR</span>
                </div>
                <div className="flex gap-[7px]">
                  <div className="ml-auto text-xs leading-normal">{row.poolAPR.toFixed(2)}%</div>
                  <div
                    className="flex items-center gap-[5px] cursor-pointer
                         text-shark-100 hover:text-transparent hover:bg-gradient-to-r hover:from-outrageous-orange-500 hover:to-festival-500 hover:bg-clip-text"
                  ></div>
                </div>
              </div>

              <div className="flex items-start justify-between border  border-shark-300 p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">Your Votes</span>
                </div>
                <div className="flex flex-col">
                  <div className="ml-auto text-xs leading-normal">
                    {row.yourVoteWeightPercentage.mulNumber(100).toString({ maxDecimalPlaces: 2 }) + '%'}
                  </div>
                  <div className="flex gap-2.5 text-shark-100">
                    <div className="flex items-center gap-[5px]">
                      <span className="text-xs leading-normal">
                        {new BigDecimal(row.yourVoteWeight, 18).toString({ maxDecimalPlaces: 2 }) + ' veFnx'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between border border-shark-300 p-4 rounded-lg">
                <div>
                  <span className="text-xs font-medium leading-normal">Total Votes</span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col items-end">
                    <p className="text-white text-xs">
                      {row.voteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 }) + '%'}
                    </p>
                    <p className="flex gap-2 mt-2 text-xs text-shark-100">
                      {new BigDecimal(row.voteWeight, 18).toString({ maxDecimalPlaces: 2 }) + ' veFnx'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between border border-shark-300 p-4 rounded-lg">
                <p className="mb-1 text-xs text-white">Total Rewards</p>
                <div className=" relative flex gap-2 items-center">
                  {row.rewardPair.externalBribeReward.amounts.length > 0 ? (
                    <>
                      {' '}
                      {openInfo && (
                        <>
                          <div className="absolute z-1000 bg-shark-950 rounded-lg border border-shark-300 w-[120px] h-fit right-0 top-9 px-5 py-3 gap-y-1">
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
              </div>

              <div className="flex items-start justify-between border border-shark-300 p-4 rounded-lg">
                {activeSlider ? (
                  <div className="w-full">
                    <div>
                      <InputRange
                        step={1}
                        max={100}
                        min={0}
                        height={7}
                        value={changeValue}
                        onChange={(value) => {
                          setChangeValue(value)
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
                          const isPresent = poolArr.findIndex(
                            (item: { id: string }) => item.id === row.pair.pair_address
                          )
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
                      <div className="flex justify-between text-sm text-shark-100">
                        <p>0%</p>
                        <p>100%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <Button variant="tertiary" className="flex gap-2 w-full items-center">
                      <span className="icon-logout"></span>
                      Claim Rewards
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default MobileRowVote
