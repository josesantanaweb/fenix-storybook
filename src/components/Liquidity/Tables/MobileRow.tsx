import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import { PoolData } from '@/src/state/liquidity/types'
import { formatCurrency, fromWei } from '@/src/library/utils/numbers'
import { useWriteContract } from 'wagmi'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import V2POOLABI from '@/src/library/web3/abis/V2pool'
import { Address } from 'viem'
import { publicClient } from '@/src/library/constants/viemClient'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'

type IRow = {
  type: string
  APR: string
}
interface RowDataProps {
  row: PoolData
  titleHeader?: string
  titleHeader2?: string
  titleButton?: string
  titleButton2?: string
  activeRange?: boolean
}

const MobileRow = ({ row, titleHeader, titleHeader2, titleButton, titleButton2, activeRange }: RowDataProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const addNotification = useNotificationAdderCallback()
  const handleClaim = (id: string) => {
    writeContractAsync(
      {
        abi: V2POOLABI,
        address: id as Address,
        functionName: 'claimFees',
        args: [],
      },

      {
        onSuccess: async (x) => {
          const transaction = await publicClient.waitForTransactionReceipt({ hash: x })
          if (transaction.status == 'success') {
            // toast(`Fees Claimed successfully.`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Fees Claimed successfully.`,
              notificationType: NotificationType.SUCCESS,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          } else {
            // toast(`Fees Claimed Tx failed`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Fees Claimed Tx failed`,
              notificationType: NotificationType.ERROR,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          }
        },
        onError: (e) => {
          // toast(`Fees Claimed Tx failed.`)
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Fees Claimed Tx failed`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
        },
      }
    )
  }
  return (
    <>
      <div
        className={`border border-shark-950 px-3 py-2 rounded-[10px] bg-shark-400 ${
          isOpen ? 'bg-opacity-60' : 'bg-opacity-20'
        } ${'xl:hidden'}`}
      >
        <div className="flex gap-[9px] items-center">
          <div className="relative flex items-center">
            <Image
              src={`/static/images/tokens/${row.pairDetails.token0Symbol}.svg`}
              alt="token"
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            <Image
              src={`/static/images/tokens/${row.pairDetails.token1Symbol}.svg`}
              alt="token"
              className="w-8 h-8 -ml-5 rounded-full"
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col">
            <h5 className="text-sm font-semibold leading-normal mb-1.5">
              {row.pairDetails.pairInformationV2?.token0_symbol} / {row.pairDetails.pairInformationV2?.token1_symbol}
            </h5>
            <div className="flex items-center gap-2">
              {!row.pairDetails.pairInformationV2?.stable && row.pairDetails.pairSymbol !== 'Concentrated pool' && (
                <span className="text-white py-1 px-3 text-xs rounded-lg border bg-shark-400 border-shark-400 ">
                  Volatile Pool
                </span>
              )}
              {row.pairDetails.pairSymbol === 'Concentrated pool' && (
                <span
                  className="py-1 px-2  text-xs rounded-lg 
                bg-outrageous-orange-500 border border-solid border-1 border-outrageous-orange-400 text-white bg-opacity-40 "
                >
                  Concentrated
                </span>
              )}
              {row.pairDetails.pairInformationV2?.stable && row.pairDetails.pairSymbol !== 'Concentrated pool' && (
                <span className="text-white py-1 px-3 text-xs rounded-lg border bg-shark-400 border-shark-400 ">
                  Stable Pool
                </span>
              )}

              <span className="!py-1 px-3  text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
                {row.pairDetails.fee} %
              </span>
              <Button
                variant="tertiary"
                className="!py-1 !text-xs border !border-shark-400 !rounded-[10px] !bg-shark-400 !bg-opacity-40 !h-[30px] !px-[7px]"
              >
                <span className="icon-info"></span>
              </Button>
            </div>
          </div>
          <button type="button" className="ml-auto" onClick={() => setIsOpen(!isOpen)}>
            <span className={`icon-chevron text-xs leading-[0] block ${isOpen ? 'rotate-180' : ''}`}></span>
          </button>
        </div>

        {isOpen && (
          <>
            {activeRange && (
              <div className="flex justify-between border mt-[21px] items-center  mb-2.5 border-shark-300 p-4 rounded-lg">
                <h1 className="text-xs">Range</h1>
                <div className={`flex items-center justify-center`}>
                  <div className="flex gap-2 items-center">
                    <span className="bg-green-600 w-4 h-4 rounded-full border-4 border-black"></span>
                    <div className="text-xs flex flex-col">
                      <p className="text-shark-100 text-xs">Min Price</p>
                      <span className="p-2  text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300 text-xs">
                        $0.00
                      </span>
                    </div>
                    <div className="text-xs flex flex-col">
                      <p className="text-shark-100 text-xs">Max Price</p>
                      <span className="p-2 text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
                        $0.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2.5  mb-2.5">
              <div
                className="flex items-start justify-between border border-shark-300 p-4 rounded-lg

              "
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">APR</span>
                  {/* <span className="icon-info text-[13px]"></span> */}
                </div>
                <div className="flex gap-[7px]">
                  <div className="ml-auto text-xs leading-normal"> {row.pairDetails.maxAPR?.toFixed(2)} %</div>
                  <div
                    className="flex items-center gap-[5px] cursor-pointer
                     text-shark-100 hover:text-transparent hover:bg-gradient-to-r hover:from-outrageous-orange-500 hover:to-festival-500 hover:bg-clip-text"
                  ></div>
                </div>
              </div>

              <div className="flex items-start justify-between border  border-shark-300 p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">TVL</span>
                </div>
                <div className="flex flex-col">
                  <div className="ml-auto text-xs leading-normal">$ {formatCurrency(Number(row.pairDetails.tvl))}</div>
                  <div className="flex gap-2.5 text-shark-100">
                    {/* <div className="flex items-center gap-[5px]">
                      <Image
                        src="/static/images/tokens/FNX.svg"
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      />
                      <span className="text-xs leading-normal">2,313,873.46</span>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src="/static/images/tokens/ETH.svg"
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      />
                      <span className="text-xs leading-normal">225.38</span>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between border border-shark-300 p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">
                    {titleHeader?.length === 0 ? 'Volume' : titleHeader}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="ml-auto text-xs leading-normal">
                    ${' '}
                    {formatCurrency(
                      (
                        Number(
                          fromWei(
                            row.pairDetails.pairInformationV2?.account_token0_balance.toString(),
                            row.pairDetails.pairInformationV2?.token0_decimals
                          )
                        ) *
                          row.pairDetails.priceA +
                        Number(
                          fromWei(
                            row.pairDetails.pairInformationV2?.account_token1_balance.toString(),
                            row.pairDetails.pairInformationV2?.token1_decimals
                          )
                        ) *
                          row.pairDetails.priceB
                      ).toFixed(2)
                    )}
                  </div>
                  <div className="flex gap-2.5 text-shark-100">
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={`/static/images/tokens/${row.pairDetails.token0Symbol}.svg`}
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      />
                      <span className="text-xs leading-normal">
                        {' '}
                        {Number(
                          fromWei(
                            row.pairDetails.pairInformationV2?.account_token0_balance.toString(),
                            row.pairDetails.pairInformationV2?.token0_decimals
                          )
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={`/static/images/tokens/${row.pairDetails.token1Symbol}.svg`}
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      />
                      <span className="text-xs leading-normal">
                        {' '}
                        {Number(
                          fromWei(
                            row.pairDetails.pairInformationV2?.account_token1_balance.toString(),
                            row.pairDetails.pairInformationV2?.token1_decimals
                          )
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between border border-shark-300 p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">
                    {titleHeader2 === '' ? 'Fees' : titleHeader2}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="ml-auto text-xs leading-normal">
                    {' '}
                    $ {Number(row.pairDetails.myPoolAmountValue.toString()).toFixed(2)}
                  </div>
                  <div className="flex gap-2.5 text-shark-100">
                    <div className="flex items-center gap-[5px]">
                      {/* <Image
                        src="/static/images/tokens/FNX.svg"
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      /> */}
                      <span className="text-xs leading-normal">
                        {' '}
                        {Number(fromWei(row.pairDetails.pairInformationV2?.account_lp_balance.toString(), 18)).toFixed(
                          5
                        )}{' '}
                        LP
                      </span>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      {/* <Image
                        src="/static/images/tokens/ETH.svg"
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      /> */}
                      {/* <span className="text-xs leading-normal">225.38</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-2.5 pb-[3px] flex gap-2">
              {titleButton === '' ? (
                <Button variant="tertiary" className="flex items-center gap-2 w-full">
                  <span className="icon-info"></span>
                  Info
                </Button>
              ) : (
                <Button
                  variant="tertiary"
                  className="flex items-center gap-2 w-full"
                  onClick={() => {
                    handleClaim(row.pairDetails.id.toString())
                  }}
                >
                  <span className="icon-coin"></span>
                  Claim
                </Button>
              )}

              {titleButton2 === '' ? (
                <Button variant="tertiary" className="flex items-center gap-2 w-full" href="/liquidity">
                  <span className="icon-circles"></span>
                  Deposit
                </Button>
              ) : (
                <Button
                  variant="tertiary"
                  className="flex items-center gap-2 w-full"
                  href={
                    !row.pairDetails.pairInformationV2?.stable && row.pairDetails.pairSymbol !== 'Concentrated pool'
                      ? `/liquidity/deposit?type=VOLATILE&token0=${row.pairDetails.pairInformationV2?.token0}&token1=${row.pairDetails.pairInformationV2?.token1}`
                      : `/liquidity/deposit?type=STABLE&token0=${row.pairDetails.pairInformationV2?.token0}&token1=${row.pairDetails.pairInformationV2?.token1}`
                  }
                >
                  <span className="icon-logout"></span>
                  Manage
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default MobileRow
