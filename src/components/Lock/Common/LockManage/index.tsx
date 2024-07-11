'use client'

import Link from 'next/link'
import Image from 'next/image'
import InputRange from '@/src/components/UI/SliderRange/InputRange'
import { Button, ProgressBar } from '@/src/components/UI'
import { FC, useCallback, useEffect, useState } from 'react'
import Filter from '@/src/components/Common/Filter'
import ActiveVote from '@/src/components/Vote/ActiveVote'
import SelectVote from '@/src/components/Modals/SelectVote'
import AboutFnx from '../AboutFnx'
import Merge from './Merge'
import Split from './Split'
import Transfer from './Transfer'
import ConfirmMerge from '@/src/components/Modals/ConfirmMerge'
import NotificationLock from '@/src/components/Lock/Notification'
import { LockElement } from '@/src/library/structures/lock/LockElement'
import { useAccount, useWriteContract } from 'wagmi'
import { createLock, getIdVeFNXLockPositions, increaseLock } from '@/src/library/web3/LockManagment'
import { fetchTokenBalance, getTokenBalance } from '@/src/library/hooks/web3/useTokenBalance'
import votingEscrowABI from '@/src/library/web3/abis/veFNX'
import { FALLBACK_CHAIN_ID } from '@/src/library/constants/chains'
import { Address } from 'viem'
import { FENIX_ADDRESS, VOTING_ESCROW_ADDRESS } from '@/src/library/constants/addresses'
import { daysFromNow, formatAmount, formatNumber, fromWei, toWei } from '@/src/library/utils/numbers'
import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from '@/src/app/layout'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { ERC20_ABI } from '@/src/library/constants/abi'
import { getPublicClient } from '@wagmi/core'
import { getTokenAllowance } from '@/src/library/web3/common/TokenManagement'

interface pageProps {
  id: Number
}
const OPTIONS = ['7D', '3M', '6M']
enum ButtonState {
  TRANSFER = 'Transfer Position',
  ENTER_AMOUNT = 'Enter Amount',
  APPROVAL_REQUIRED = 'Approve FNX',
  APPROVING = 'Approving...',
  WAITING_APPROVAL = 'Waiting Approval',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  WAITING_CONFIRMATION = 'Waiting Confirmation',
  PRICE_IMPACT_ALERT = 'Price Impact Too High. Swap Anyway',
  INCREMENT_AMOUNT = 'Increase Amount',
  INCREMENT_TIME = 'Increase Time',
  LOADING = 'Loading...',
}
const LockManage: FC<pageProps> = ({ id }) => {
  const [changeValue, setChangeValue] = useState<number>(7)
  const [currentTab, setCurrentTab] = useState('ADD')
  const [openModal, setOpenModal] = useState(false)
  const [tokenBalance, settokenBalance] = useState<string>('0')
  const [inputAmount, setinputAmount] = useState<string>('0')
  const [openModalMergeSplit, setOpenModalMergeSplit] = useState(false)
  const [activeVote, setActiveVote] = useState(false)
  const [lock, setLock] = useState<LockElement>()
  const [selectedOption, setSelectedOption] = useState<number>(0)
  const [currentButtonState, setCurrentButtonState] = useState(ButtonState.ENTER_AMOUNT)
  const [extendCurrentButtonState, setextendCurrentButtonState] = useState(ButtonState.ENTER_AMOUNT)
  const [transferCurrentButtonState, settransferCurrentButtonState] = useState(ButtonState.ENTER_AMOUNT)
  const [tokenAllowance, settokenAllowance] = useState<string>('0')

  const [inputAddress, setinputAddress] = useState('')
  const addNotification = useNotificationAdderCallback()
  const { writeContractAsync } = useWriteContract()

  const handleOptionChange = (value: number) => {
    setSelectedOption(value)
  }
  const { address, chainId } = useAccount()

  const handlerChange = () => {
    openModal ? setOpenModal(false) : setOpenModal(true)
  }

  const OPTIONS_TAB = ['Add', 'Extend', 'Transfer']

  const handleNFTTX = async (
    currentTab: string,
    inputAmount: string,
    currentId: number,
    tokenAllowance: string,
    changeValue: number,
    toAddress: string
  ) => {
    try {
      //
      //   (Number(lock?.veNFTInfo.lockEnd) - Math.floor(Date.now() / 1000)) / 86400,
      //   changeValue,
      //   inputAmount,
      //   currentId,
      //   currentTab,
      //   'inn'
      // )
      if (chainId && address) {
        if (currentTab === 'ADD') {
          setCurrentButtonState(ButtonState.LOADING)
          if (Number(tokenAllowance) < Number(inputAmount)) {
            handleApprove(
              chainId ? (FENIX_ADDRESS[chainId] as Address) : (FENIX_ADDRESS[FALLBACK_CHAIN_ID] as Address),
              toWei(inputAmount).toString()
            )
          } else {
            writeContractAsync(
              {
                abi: votingEscrowABI,
                address: VOTING_ESCROW_ADDRESS[chainId] as Address,
                functionName: 'deposit_for',
                args: [currentId, toWei(inputAmount).toString()],
              },
              {
                onSuccess: async (x) => {
                  setCurrentButtonState(ButtonState.LOADING)
                  const publicClient = getPublicClient(wagmiConfig)
                  const transaction = await publicClient?.waitForTransactionReceipt({ hash: x })

                  addNotification({
                    id: crypto.randomUUID(),
                    createTime: new Date().toISOString(),
                    message: `Increased Lock Amount successfully.`,
                    notificationType: NotificationType.SUCCESS,
                    txHash: transaction?.transactionHash,
                    notificationDuration: NotificationDuration.DURATION_5000,
                  })
                  asyncGetAllowance()
                  setCurrentButtonState(ButtonState.INCREMENT_AMOUNT)
                },
                onError: (error) => {
                  setCurrentButtonState(ButtonState.INCREMENT_AMOUNT)
                  if (error?.message?.includes('ERC20: insufficient allowance')) {
                    addNotification({
                      id: crypto.randomUUID(),
                      createTime: new Date().toISOString(),
                      message: `ERC20: insufficient allowance`,
                      notificationType: NotificationType.ERROR,
                      txHash: '',
                      notificationDuration: NotificationDuration.DURATION_5000,
                    })
                  } else {
                    addNotification({
                      id: crypto.randomUUID(),
                      createTime: new Date().toISOString(),
                      message: `Transaction Failed.`,
                      notificationType: NotificationType.ERROR,
                      txHash: '',
                      notificationDuration: NotificationDuration.DURATION_5000,
                    })
                  }
                },
              }
            )
          }
        }
        if (currentTab == 'EXTEND') {
          writeContractAsync(
            {
              abi: votingEscrowABI,
              address: VOTING_ESCROW_ADDRESS[chainId] as Address,
              functionName: 'increase_unlock_time',
              args: [currentId, (changeValue * 86400).toString()],
            },
            {
              onSuccess: async (x) => {
                setextendCurrentButtonState(ButtonState.LOADING)
                const publicClient = getPublicClient(wagmiConfig)
                const transaction = await publicClient?.waitForTransactionReceipt({ hash: x })

                addNotification({
                  id: crypto.randomUUID(),
                  createTime: new Date().toISOString(),
                  message: `Increased Lock Time successfully.`,
                  notificationType: NotificationType.SUCCESS,
                  txHash: transaction?.transactionHash,
                  notificationDuration: NotificationDuration.DURATION_5000,
                })
                asyncGetAllowance()
                setextendCurrentButtonState(ButtonState.INCREMENT_TIME)
              },
              onError: (error) => {
                setextendCurrentButtonState(ButtonState.INCREMENT_TIME)

                if (error?.message?.includes('182 days max'))
                  addNotification({
                    id: crypto.randomUUID(),
                    createTime: new Date().toISOString(),
                    message: `New unlock time cannot be more than 182 days`,
                    notificationType: NotificationType.ERROR,
                    txHash: '',
                    notificationDuration: NotificationDuration.DURATION_5000,
                  })
              },
            }
          )
        }
        if (currentTab == 'TRANSFER') {
          settransferCurrentButtonState(ButtonState.LOADING)
          writeContractAsync(
            {
              abi: votingEscrowABI,
              address: VOTING_ESCROW_ADDRESS[chainId] as Address,
              functionName: 'transferFrom',
              args: [address, toAddress, currentId],
            },
            {
              onSuccess: async (x) => {
                settransferCurrentButtonState(ButtonState.LOADING)
                const publicClient = getPublicClient(wagmiConfig)
                const transaction = await publicClient?.waitForTransactionReceipt({ hash: x })

                addNotification({
                  id: crypto.randomUUID(),
                  createTime: new Date().toISOString(),
                  message: `Transfered successfully.`,
                  notificationType: NotificationType.SUCCESS,
                  txHash: transaction?.transactionHash,
                  notificationDuration: NotificationDuration.DURATION_5000,
                })
                asyncGetAllowance()
                settransferCurrentButtonState(ButtonState.TRANSFER)
              },
              onError: (error) => {
                settransferCurrentButtonState(ButtonState.TRANSFER)
                addNotification({
                  id: crypto.randomUUID(),
                  createTime: new Date().toISOString(),
                  message: `Transaction Failed`,
                  notificationType: NotificationType.ERROR,
                  txHash: '',
                  notificationDuration: NotificationDuration.DURATION_5000,
                })
              },
            }
          )
        }
      }
    } catch (error: any) {
      setCurrentButtonState(ButtonState.INCREMENT_TIME)
    }
  }
  const asyncGetAllowance = async () => {
    const allowanceFirst: any = await getTokenAllowance(
      address as Address,
      chainId ? (FENIX_ADDRESS[chainId] as Address) : (FENIX_ADDRESS[FALLBACK_CHAIN_ID] as Address),
      chainId ? (VOTING_ESCROW_ADDRESS[chainId] as Address) : (VOTING_ESCROW_ADDRESS[FALLBACK_CHAIN_ID] as Address)
    )
    settokenAllowance(fromWei(allowanceFirst.toString()))
  }
  const handleApprove = async (token: Address, amount: string) => {
    setCurrentButtonState(ButtonState.WAITING_APPROVAL)

    writeContractAsync(
      {
        abi: ERC20_ABI,
        address: token,
        functionName: 'approve',
        args: [chainId ? VOTING_ESCROW_ADDRESS[chainId] : VOTING_ESCROW_ADDRESS[FALLBACK_CHAIN_ID], amount],
      },
      {
        onSuccess: async (x) => {
          setCurrentButtonState(ButtonState.APPROVING)
          const publicClient = getPublicClient(wagmiConfig)
          const transaction = await publicClient?.waitForTransactionReceipt({ hash: x })

          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Approved successfully.`,
            notificationType: NotificationType.SUCCESS,
            txHash: transaction?.transactionHash,
            notificationDuration: NotificationDuration.DURATION_5000,
          })
          setCurrentButtonState(ButtonState.INCREMENT_AMOUNT)

          asyncGetAllowance()
        },
        onError: (e) => {
          setCurrentButtonState(ButtonState.APPROVAL_REQUIRED)
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Approve failed. ${e}`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
        },
      }
    )
  }
  const convertDaysToMonthsAndDays = (days: number) => {
    const daysInMonth = 30
    const months = Math.floor(days / daysInMonth)
    const remainingDays = days % daysInMonth

    return { month: months, day: remainingDays }
  }
  const calculateFutureDate = (expiryEpoch: number, daysFromNow: number) => {
    const W = 60 * 60 * 24 * 7 * 1000
    const expiryDate = new Date(expiryEpoch * 1000) // Convert from seconds to milliseconds
    const futureDate = new Date(expiryDate)
    futureDate.setDate(expiryDate.getDate() + daysFromNow)

    const day = String(futureDate.getDate()).padStart(2, '0')
    const month = String(futureDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const year = futureDate.getFullYear()

    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    const loadCurrentLocks = async () => {
      try {
        if (chainId && address) {
          const resp = await getIdVeFNXLockPositions(id, chainId)
          const tokenbalance = (await fetchTokenBalance(
            chainId ? (FENIX_ADDRESS[chainId] as Address) : (FENIX_ADDRESS[FALLBACK_CHAIN_ID] as Address),
            address
          )) as bigint
          //
          settokenBalance(fromWei(BigInt(tokenbalance).toString()))
          setLock(resp)
        }
      } catch (error) {}
    }
    loadCurrentLocks()
    asyncGetAllowance()
    if (currentTab === 'MERGE' || currentTab === 'SPLIT') setOpenModalMergeSplit(true)
  }, [address, chainId, currentTab, id])

  return (
    <div className={`w-full flex justify-center flex-col items-center    mt-28 xl:mt-20`}>
      <div className="lock-box relative w-full ">
        <div className="absolute xl:-top-14 -top-24 xl:left-10 left-0 w-full ">
          {currentTab === 'SPLIT' && (
            <NotificationLock info="Merging/splitting will cause a loss of unclaimed and pending rewards, make sure to claim everything beforehand." />
          )}
          {currentTab === 'TRANSFER' && (
            <NotificationLock info="Be aware of the address direction before you complete your transfer, it is not reversible." />
          )}
        </div>
        <div className="flex flex-col w-full xl:flex-row relative z-10">
          <div className="w-full flex flex-col mb-5 xl:w-1/2">
            <div className="flex mb-5 justify-between">
              <h4 className="text-xl font-semibold text-white">Manage Lock</h4>
              <span className="icon-refresh text-shark-100 text-xl cursor-pointer" />
            </div>
            {/* space between manage lock and reset */}
            <div>
              <Filter
                className="grid grid-cols-2 [&>button]:!w-full"
                bgBox="filter-lock-box"
                options={OPTIONS_TAB}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            </div>
            {/* tab options manage */}
            <div className="mt-5 relative">
              {currentTab === 'MERGE' && (
                <>
                  <p className="text-xs ms-1 mb-1 text-white">Current Position</p>
                </>
              )}
              {currentTab === 'SPLIT' && (
                <>
                  <p className="text-xs ms-1 mb-1 text-white">Split Position</p>
                </>
              )}
              <ActiveVote handlerChange={handlerChange} lock={lock} />
              {/* <SelectVote
                openModal={openModal}
                setOpenModal={setOpenModal}
                activeVote={activeVote}
                setActiveVote={setActiveVote}
                setlock={setLock}
              /> */}
            </div>
            {/* active vote */}
            {currentTab === 'TRANSFER' && (
              <>
                {' '}
                <div className="flex flex-col relative">
                  <div className="rotate-90 mx-auto bg-shark-400 p-1 w-8 h-8 rounded-sm bg-opacity-40 my-1">
                    <span className="icon-arrow text-2xl   flex justify-center items-center   text-gradient"></span>
                  </div>
                  <div className="p-8 exchange-box-x1">
                    <p className="text-sm text-white  mb-2">Transfer to</p>
                    <input
                      type="text"
                      placeholder="0x"
                      className="w-full bg-shark-400 p-3 rounded-lg outline-none bg-opacity-40 text-shark-100 border border-shark-300"
                      value={inputAddress}
                      onChange={(e) => setinputAddress(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            {currentTab === 'MERGE' && (
              <div className="mx-auto rotate-90 bg-shark-400 bg-opacity-40 p-1 rounded-l-lg border border-shark-300">
                <span className="icon-swap mx-auto rotate-90 text-2xl text-transparent bg-gradient-to-r from-outrageous-orange-500 to-festival-500 bg-clip-text"></span>
              </div>
            )}
            {currentTab === 'SPLIT' && (
              <>
                {/* <Split /> */}
                {/* <ConfirmMerge
                  option={currentTab}
                  openModal={openModalMergeSplit}
                  setOpenModal={setOpenModalMergeSplit}
                /> */}
              </>
            )}
            {currentTab === 'MERGE' && (
              <div className="-mt-[20px]">
                <p className="text-white text-xs ms-1 mb-1">Merge With</p>
                <Merge activeVote={activeVote} handlerChange={handlerChange} />
                {/* <ConfirmMerge
                  option={currentTab}
                  openModal={openModalMergeSplit}
                  setOpenModal={setOpenModalMergeSplit}
                /> */}
                <SelectVote
                  setlock={setLock}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  activeVote={activeVote}
                  setActiveVote={setActiveVote}
                />
              </div>
            )}
            {currentTab === 'ADD' && (
              <>
                {' '}
                <div className="flex flex-col xl:flex-row items-center gap-3 justify-center mt-5 exchange-box-x1 p-5">
                  <div className="xl:w-2/5 w-full flex flex-col gap-2">
                    <p className="text-xs  text-white">Amount to lock</p>
                    <div className="flex text-white gap-3 items-center bg-shark-400  justify-between p-3 border border-shark-300 rounded-xl bg-opacity-40 ">
                      <div className="flex gap-2 items-center">
                        <Image src={'/static/images/vote/fenix-logo.svg'} alt="fenix-logo" height={30} width={30} />
                        <p>FNX</p>
                      </div>
                      {/* <span className="icon-chevron"></span> */}
                    </div>
                  </div>

                  <div className="xl:w-3/5 w-full flex flex-col gap-2">
                    <p className="text-xs text-shark-100 text-right" onClick={() => setinputAmount(tokenBalance)}>
                      <span className="icon-wallet"></span> Available: {parseFloat(tokenBalance).toFixed(2)} FNX
                    </p>
                    <div>
                      <input
                        type="number"
                        className="w-full bg-shark-400 p-3 rounded-lg outline-none bg-opacity-40 text-shark-100 border border-shark-300"
                        placeholder="0"
                        value={inputAmount}
                        onChange={(e) => {
                          setinputAmount(e.target.value)
                          Number(e.target.value) > 0
                            ? Number(tokenAllowance) < Number(e.target.value)
                              ? setCurrentButtonState(ButtonState.APPROVAL_REQUIRED)
                              : setCurrentButtonState(ButtonState.INCREMENT_AMOUNT)
                            : setCurrentButtonState(ButtonState.ENTER_AMOUNT)
                        }}
                      />
                      <input
                        type="button"
                        className="absolute right-16 button-tertiary w-[41px] border border-shark-300 rounded-full text-white text-xs p-1 mt-3 me-4"
                        value={'Half'}
                        placeholder="Half"
                        onClick={() => setinputAmount((Number(tokenBalance) / 2).toString())}
                      />
                      <input
                        type="button"
                        className="absolute right-5 button-tertiary w-[41px] border border-shark-300 rounded-full text-white text-xs p-1 mt-3 me-4"
                        value={'Max'}
                        placeholder="max"
                        onClick={() => setinputAmount(tokenBalance)}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-col gap-3  mt-5 exchange-box-x1 p-5">
                  <div className="text-sm flex justify-between">
                    <p className="text-white text-sm text-left">Expires in</p>
                    <div className="text-shark-100 flex gap-2">{OPTIONS[selectedOption].label}</div>
                  </div>
                  <div>
                    <InputRange
                      step={1}
                      max={OPTIONS.length - 1}
                      min={0}
                      value={selectedOption}
                      onChange={(value) => handleOptionChange(value as number)}
                      disabled={false}
                    />
                    <div className="text-shark-100 flex  text-sm justify-between ">
                      {OPTIONS.map((option, index) => {
                        return <div key={index}>{option.label}</div>
                      })}
                    </div>
                  </div>
                </div> */}
                {/* amount to lock fenix */}
              </>
            )}
            {currentTab === 'EXTEND' && (
              <>
                {' '}
                {/* <div className="flex flex-col xl:flex-row items-center gap-3 justify-center mt-5 exchange-box-x1 p-5">
                  <div className="xl:w-2/5 w-full flex flex-col gap-2">
                    <p className="text-xs  text-white">Amount to lock</p>
                    <div className="flex text-white gap-3 items-center bg-shark-400  justify-between p-3 border border-shark-300 rounded-xl bg-opacity-40 ">
                      <div className="flex gap-2 items-center">
                        <Image src={'/static/images/vote/fenix-logo.svg'} alt="fenix-logo" height={30} width={30} />
                        <p>FNX</p>
                      </div>
                      <span className="icon-chevron"></span>
                    </div>
                  </div>

                  <div className="xl:w-3/5 w-full flex flex-col gap-2">
                    <p
                      className="text-xs text-shark-100 text-right"
                      onClick={() => setinputAmount(Number(tokenBalance).toFixed(2).toString())}
                    >
                      <span className="icon-wallet"></span> Available: {formatNumber(Number(tokenBalance), 2)} FNX
                    </p>
                    <div>
                      <input
                        type="number"
                        className="w-full bg-shark-400 p-3 rounded-lg outline-none bg-opacity-40 text-shark-100 border border-shark-300"
                        placeholder="0"
                        value={inputAmount}
                        onChange={(e) => setinputAmount(e.target.value)}
                      />
                      <input
                        type="button"
                        className="absolute right-16 button-tertiary w-[41px] border border-shark-300 rounded-full text-white text-xs p-1 mt-3 me-4"
                        value={'Half'}
                        placeholder="Half"
                        onClick={() => setinputAmount((Number(tokenBalance) / 2).toFixed(2).toString())}
                      />
                      <input
                        type="button"
                        className="absolute right-5 button-tertiary w-[41px] border border-shark-300 rounded-full text-white text-xs p-1 mt-3 me-4"
                        value={'Max'}
                        placeholder="max"
                        onClick={() => setinputAmount(tokenBalance)}
                      />
                    </div>
                  </div>
                </div> */}
                <div className="flex flex-col gap-3  mt-5 exchange-box-x1 p-5">
                  <div className="text-sm flex justify-between">
                    <p className="text-white text-sm text-left">Expires in</p>
                    <div className="text-shark-100 flex gap-2">{`${convertDaysToMonthsAndDays(changeValue).month}M ${convertDaysToMonthsAndDays(changeValue).day}D`}</div>
                    {/* <p>{`${convertDaysToMonthsAndDays(changeValue).month}M`}</p>
                    <p>{`${convertDaysToMonthsAndDays(changeValue).day}D`}</p> */}
                  </div>
                  <div>
                    <InputRange
                      step={7}
                      max={182}
                      min={7}
                      height={7}
                      value={changeValue}
                      onChange={setChangeValue}
                      disabled={false}
                    />
                    <div className="text-shark-100 flex  text-sm justify-between ">
                      {OPTIONS.map((option, index) => {
                        return <div key={index}>{option}</div>
                      })}
                    </div>
                  </div>
                </div>
                {/* amount to lock fenix */}
              </>
            )}

            {/* input slider range */}
            {(currentTab === 'ADD' || currentTab === 'MERGE') && (
              <div className="exchange-box-x1 xl:h-[60px] p-5 mt-5 flex justify-between items-center text-white text-xs">
                <div>
                  <p>New Voting Power</p>
                </div>
                <div>
                  <p className="p-2  border flex items-center bg-shark-400 border-shark-300 rounded-lg bg-opacity-40">
                    {Math.floor(Date.now() / 1000) < Number(lock?.veNFTInfo.lockEnd.toString())
                      ? (
                          ((Number(inputAmount) + Number(fromWei(lock?.veNFTInfo.amount.toString()))) *
                            daysFromNow(Number(lock?.veNFTInfo.lockEnd.toString()))) /
                          182
                        ).toFixed(2)
                      : '0.00'}{' '}
                    veFNX
                  </p>
                </div>
              </div>
            )}
            {currentTab === 'EXTEND' && (
              <div className="exchange-box-x1 xl:h-[60px] p-5 mt-5 flex justify-between items-center text-white text-xs">
                <div>
                  <p>New Voting Power</p>
                </div>
                <div>
                  <p className="p-2  border flex items-center bg-shark-400 border-shark-300 rounded-lg bg-opacity-40">
                    {Math.floor(Date.now() / 1000) < Number(lock?.veNFTInfo.lockEnd.toString())
                      ? (
                          (Number(fromWei(lock?.veNFTInfo.amount.toString())) *
                            (daysFromNow(Number(lock?.veNFTInfo.lockEnd.toString())) + changeValue)) /
                          182
                        ).toFixed(2)
                      : '0.00'}{' '}
                    veFNX
                  </p>
                </div>
                <div>
                  <p>New Expiry Data</p>
                </div>
                <div>
                  <p className="p-2  border flex items-center bg-shark-400 border-shark-300 rounded-lg bg-opacity-40">
                    {calculateFutureDate(Number(lock?.veNFTInfo.lockEnd.toString()), changeValue)}
                  </p>
                </div>
              </div>
            )}

            {/* section by locking your fnx */}
            {currentTab === 'MERGE' && (
              <div className="exchange-box-x1 p-5 mt-5 flex justify-between items-center text-white text-sm">
                <p className="flex gap-2 items-center text-xs">
                  <span className="icon-info text-2xl inline-block text-transparent bg-gradient-to-r from-outrageous-orange-500 to-festival-500 bg-clip-text "></span>
                  Merging/splitting will cause a loss of unclaimed and pending rewards, make sure to claim everything
                  beforehand.
                </p>
              </div>
            )}
            {/* mergin/splitt info */}
            <div className="mt-4">
              <Button
                className="w-full"
                variant="tertiary"
                disabled={currentTab === 'ADD' && Number(inputAmount) <= 0}
                onClick={() =>
                  handleNFTTX(
                    currentTab,
                    inputAmount,
                    Number(lock?.veNFTInfo.id),
                    tokenAllowance,
                    changeValue + (Number(lock?.veNFTInfo.lockEnd) - Math.floor(Date.now() / 1000)) / 86400,
                    inputAddress
                  )
                }
              >
                {currentTab === 'EXTEND' && <>{extendCurrentButtonState}</>}
                {(currentTab === 'ADD' || currentTab === 'MERGE') && <>{currentButtonState}</>}
                {/* {currentTab === 'SPLIT' && <>Split Position</>} */}
                {currentTab === 'TRANSFER' && <>{transferCurrentButtonState}</>}
              </Button>
            </div>
          </div>
          {/* Line black */}
          <div className="flex  justify-center items-center w-[10%] ">
            <div className="bg-shark-400 h-4/5 w-[1px]"></div>
          </div>
          {/* Line black */}
          <div className="relative flex flex-col w-full xl:w-[40%] mx-auto overflow-x-none border-t-2 border-shark-400 xl:border-none ">
            <div>
              <h1 className="text-white text-center text-xl font-medium mb-10 mt-5">About your veFNX</h1>
            </div>
            <AboutFnx lock={lock} />
            <div className="justify-center xl:flex hidden mt-2 cursor-pointer">
              <Link
                target="_blank"
                href="https://discord.com/invite/fenixfi"
                className="flex gap-2 text-shark-100 mt-10"
              >
                <span className="icon-discord"></span> Need some help?
              </Link>
            </div>
            <div className="absolute top-2 xl:-top-[70px] z-10 w-28 right-0 xl:right-[30px] max-w-[100px]">
              <ProgressBar progress={50} />
            </div>
          </div>
        </div>
      </div>

      <div>
        {currentTab === 'MERGE' && (
          <ConfirmMerge option={currentTab} openModal={openModalMergeSplit} setOpenModal={setOpenModalMergeSplit} />
        )}
        {currentTab === 'SPLIT' && (
          <>
            <ConfirmMerge option={currentTab} openModal={openModalMergeSplit} setOpenModal={setOpenModalMergeSplit} />
          </>
        )}
        <SelectVote
          openModal={openModal}
          setOpenModal={setOpenModal}
          activeVote={activeVote}
          setActiveVote={setActiveVote}
          setlock={setLock}
        />
      </div>
    </div>
  )
}

export default LockManage
