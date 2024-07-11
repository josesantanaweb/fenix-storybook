// eslint-disable-next-line
//@ts-ignore
//@ts-nocheck
import { Button } from '@/src/components/UI'
import { LockElement } from '@/src/library/structures/lock/LockElement'
import { castVotes, resetVotes } from '@/src/library/web3/VoteManagementV3'
import { useAppSelector } from '@/src/state'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from '@/src/app/layout'
import { voteState } from '@/src/state/vote/types'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import voterAbi from '@/src/library/web3/abis/VoterV3ABI'
import { useAccount, useWriteContract } from 'wagmi'
import { VOTER_ADDRESS } from '@/src/library/constants/addresses'
import { getPublicClient } from '@wagmi/core'
import Loader from '../../UI/Icons/Loader'

enum ButtonState {
  POOL_NOT_AVAILABLE = 'Pool Not Available',
  ENTER_AMOUNT = 'Enter Amount',
  APPROVAL_REQUIRED = 'Approve FNX',
  APPROVING = 'Approving...',
  WAITING_APPROVAL = 'Waiting Approval',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  WAITING_CONFIRMATION = 'Waiting Confirmation',
  PRICE_IMPACT_ALERT = 'Price Impact Too High. Swap Anyway',
  VOTE = 'Cast Votes',
  RESET = 'Reset Votes',
  LOADING = 'Loading...',
}

interface overlayProps {
  voteValue: Number
  lockInfo: LockElement | undefined
  poolArr: any
}
const Overlay = ({ voteValue, lockInfo, poolArr }: overlayProps) => {
  const [loading, setloading] = useState<Boolean>(false)
  const [currentButtonState, setCurrentButtonState] = useState(ButtonState.VOTE)
  const [resetButtonState, setResetButtonState] = useState(ButtonState.RESET)
  const { writeContractAsync } = useWriteContract()
  const { chainId } = useAccount()

  const addNotification = useNotificationAdderCallback()

  const castVote = async () => {
    try {
      const addresses = poolArr.map((pool) => pool.id)
      const weights = poolArr.map((pool) => pool.percentage)
      setCurrentButtonState(ButtonState.LOADING)
      writeContractAsync(
        {
          abi: voterAbi,
          address: VOTER_ADDRESS[chainId] as Address,
          functionName: 'vote',
          args: [Number(lockInfo.veNFTInfo.id), addresses, weights],
        },
        {
          onSuccess: async (x) => {
            setCurrentButtonState(ButtonState.LOADING)
            const publicClient = getPublicClient(wagmiConfig)
            const transaction = await publicClient?.waitForTransactionReceipt({ hash: x })

            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Voted on pools successfully.`,
              notificationType: NotificationType.SUCCESS,
              txHash: transaction?.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
            setCurrentButtonState(ButtonState.VOTE)
          },
          onError: (error) => {
            setCurrentButtonState(ButtonState.VOTE)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Transaction failed`,
              notificationType: NotificationType.ERROR,
              txHash: '',
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          },
        }
      )
    } catch (err: any) {}
  }

  const resetVote = async () => {
    try {
      if (chainId) {
        setResetButtonState(ButtonState.LOADING)
        writeContractAsync(
          {
            abi: voterAbi,
            address: VOTER_ADDRESS[chainId] as Address,
            functionName: 'reset',
            args: [Number(lockInfo.veNFTInfo.id)],
          },
          {
            onSuccess: async (x) => {
              const publicClient = getPublicClient(wagmiConfig)
              const transaction = await publicClient?.waitForTransactionReceipt({ hash: x })

              addNotification({
                id: crypto.randomUUID(),
                createTime: new Date().toISOString(),
                message: `Reset Votes successfully.`,
                notificationType: NotificationType.SUCCESS,
                txHash: transaction?.transactionHash,
                notificationDuration: NotificationDuration.DURATION_5000,
              })
              setResetButtonState(ButtonState.RESET)
            },
            onError: (error) => {
              setResetButtonState(ButtonState.RESET)
              addNotification({
                id: crypto.randomUUID(),
                createTime: new Date().toISOString(),
                message: `Transaction failed`,
                notificationType: NotificationType.ERROR,
                txHash: '',
                notificationDuration: NotificationDuration.DURATION_5000,
              })
            },
          }
        )
      }
    } catch (err: any) {}
  }

  return (
    <>
      <div className="md:flex justify-center hidden">
        <div className=" p-8 flex  justify-between  items-center w-[626px] bg-overlay-fixed backdrop-blur-md">
          <div className="flex flex-col w-full lg:w-auto">
            <p className="text-white text-xs text-nowrap">Voting Power Used</p>
            <p className="text-xl text-white">
              {Number(voteValue) <= 100
                ? (
                    ((Number(lockInfo?.veNFTInfo.voting_amount?.toString()) / 10 ** 18) * Number(voteValue)) /
                    100
                  ).toFixed(1)
                : (Number(lockInfo?.veNFTInfo.voting_amount?.toString()) / 10 ** 18).toFixed(1)}{' '}
              veFnx ({voteValue.toString()} %)
            </p>
          </div>
          <div className="flex justify-end gap-10 items-center ">
            <div className="">
              {/* <span className="py-1 border border-green-400 bg-none bg-green-500 bg-opacity-20 text-white rounded-lg px-5 text-xs">
                Voting
              </span> */}
            </div>
            <div className="flex items-center gap-4">
              {currentButtonState === ButtonState.LOADING ? (
                <Button
                  className="!h-[38px] !text-xs w-[130px] "
                  disabled={Number(voteValue) > 100}
                  onClick={() => castVote()}
                >
                  <Loader color="white" size={20} />
                </Button>
              ) : (
                <Button
                  className="!h-[38px] !text-xs w-[130px] "
                  disabled={Number(voteValue) > 100}
                  onClick={() => castVote()}
                >
                  {currentButtonState}
                </Button>
              )}
              {resetButtonState === ButtonState.LOADING ? (
                <Button className="!py-2 !text-xs w-[80px]" variant="secondary" onClick={resetVote}>
                  <Loader color="white" size={20} />
                </Button>
              ) : (
                <Button className="!py-2 !text-xs w-[80px]" variant="secondary" onClick={resetVote}>
                  {resetButtonState}
                </Button>
              )}

              <Toaster />
            </div>
          </div>
        </div>
      </div>
      {/* Desktop */}
      <div className="flex justify-center md:hidden ">
        <div className=" p-8 flex  justify-between  items-center w-[363px] h-[118px] bg-overlay-mobile backdrop-blur-md  ">
          <div className="flex flex-col w-full">
            <p className="text-white text-[10px] ">Voting Power Used</p>
            <p className="text-xl text-white">
              {Number(voteValue) <= 100
                ? (
                    ((Number(lockInfo?.veNFTInfo.voting_amount?.toString()) / 10 ** 18) * Number(voteValue)) /
                    100
                  ).toFixed(1)
                : (Number(lockInfo?.veNFTInfo.voting_amount?.toString()) / 10 ** 18).toFixed(1)}{' '}
              veFnx ({voteValue.toString()} %)
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 ">
            <div className="">
              <span className="py-1 border border-green-400 bg-none bg-green-500 bg-opacity-20 text-white rounded-lg px-5 text-[10px]">
                Voting
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button className="!h-[28px] !text-[10px] w-[100px]" disabled={Number(voteValue?.percentage) > 100}>
                {currentButtonState}
              </Button>
              <Button className="!py-2 !text-[10px] w-[80px]" variant="secondary">
                {resetButtonState}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile */}
    </>
  )
}

export default Overlay
