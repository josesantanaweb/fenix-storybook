//@ts-ignore
//@ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MainBox from '@/src/components/Common/Boxes/MainBox'
import InfoBox from '@/src/components/Common/InfoBox'
import STEPS from './data'
import ChoosePool from '@/src/components/Bribes/Panel/ChoosePool'
import RewardToken from '@/src/components/Bribes/Panel/RewardToken'
import RewardSummary from '@/src/components/Bribes/Panel/RewardSummary'
import Total from '@/src/components/Bribes/Panel/Total'
import Separator from '@/src/components/Trade/Common/Separator'
import { Button, ProgressBar } from '@/src/components/UI'
import { IToken } from '@/src/library/types'
import { getTokenAllowance } from '@/src/library/web3/common/TokenManagement'
import { fromWei, toWei } from '@/src/library/utils/numbers'
import { fetchTokenBalance } from '@/src/library/hooks/web3/useTokenBalance'
import { useAccount, useWriteContract } from 'wagmi'
import Loader from '../UI/Icons/Loader'
import { Address } from 'viem'
import { createBribe } from '@/src/library/web3/RewardManagement'
import { waitForTransactionReceipt } from 'viem/actions'
import { ERC20_ABI } from '@/src/library/constants/abi'
import { getPublicClient } from '@wagmi/core'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { wagmiConfig } from '@/src/app/layout'
import externalbribeABI from '@/src/library/web3/abis/externalBribeABI'

enum ButtonState {
  POOL_NOT_AVAILABLE = 'Pool Not Available',
  ENTER_AMOUNT = 'Enter Amount',
  APPROVAL_REQUIRED = 'Approve Token',
  APPROVING = 'Approving...',
  WAITING_APPROVAL = 'Waiting Approval',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  WAITING_CONFIRMATION = 'Waiting Confirmation',
  CREATE_BRIBE = 'Create Bribe',
  LOADING = 'Loading...',
}

const Bribes = () => {
  // const [tokenSell, setTokenSell] = useState<IToken>({ name: 'Fenix', symbol: 'FNX' })
  const { address, chainId } = useAccount()
  const [currentButtonState, setCurrentButtonState] = useState(ButtonState.APPROVAL_REQUIRED)
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)
  const [tokenAllowance, settokenAllowance] = useState<string>('0')
  const [tokenSell, setTokenSell] = useState<any>('Select a Pool')
  const [tokenGet, setTokenGet] = useState<any>('Select a Token')
  const [poolValue, setPoolValue] = useState<number>(0)
  const [bal, setBal] = useState<string>('0')
  const addNotification = useNotificationAdderCallback()
  const { writeContractAsync } = useWriteContract()

  const fetTokenAllowance = async () => {
    if (address && chainId) {
      if (tokenGet !== 'Select a Token' && tokenSell !== 'Select a Pool') {
        const tokenAllow = await getTokenAllowance(
          address,
          tokenGet?.address,
          tokenSell?.rewardPair?._externalBribeAddress
        )
        //
        settokenAllowance(parseFloat(tokenAllow / 10 ** tokenGet?.decimals))
      }
    }
  }

  useEffect(() => {
    fetTokenAllowance()
  }, [address, chainId, currentButtonState, poolValue, tokenGet, tokenSell])

  useEffect(() => {
    Number(poolValue) > Number(tokenAllowance)
      ? setCurrentButtonState(ButtonState.APPROVAL_REQUIRED)
      : setCurrentButtonState(ButtonState.CREATE_BRIBE)
  }, [poolValue])

  const handleApprove = async (token: Address, amount: string, externalAddress: Address) => {
    setCurrentButtonState(ButtonState.WAITING_APPROVAL)

    writeContractAsync(
      {
        abi: ERC20_ABI,
        address: token,
        functionName: 'approve',
        args: [externalAddress, amount],
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
          asyncGetAllowance()
          setCurrentButtonState(ButtonState.CREATE_BRIBE)
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
  const asyncGetAllowance = async () => {
    //
    const allowance: any = await getTokenAllowance(
      address as Address,
      tokenGet?.address,
      tokenSell?.rewardPair?._externalBribeAddress
    )
    //
    settokenAllowance(parseFloat(allowance / 10 ** tokenGet?.decimals))
  }

  const handleCreateBribe = async (tokenAddress: Address, amount: string, externalBribeAddress: Address) => {
    if (tokenAddress == 'Select a Token') {
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `Select a Pool & Token`,
        notificationType: NotificationType.ERROR,
        txHash: '',
        notificationDuration: NotificationDuration.DURATION_5000,
      })
    }
    //
    try {
      setCurrentButtonState(ButtonState.LOADING)
      writeContractAsync(
        {
          abi: externalbribeABI,
          address: externalBribeAddress,
          functionName: 'notifyRewardAmount',
          args: [tokenAddress, amount],
        },
        {
          onSuccess: async (x) => {
            setCurrentButtonState(ButtonState.LOADING)
            const publicClient = getPublicClient(wagmiConfig)
            const transaction = await publicClient?.waitForTransactionReceipt({ hash: x })

            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Created Bribe successfully.`,
              notificationType: NotificationType.SUCCESS,
              txHash: transaction?.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
            asyncGetAllowance()
            setCurrentButtonState(ButtonState.CREATE_BRIBE)
          },
          onError: (error) => {
            setCurrentButtonState(ButtonState.CREATE_BRIBE)
            if (error?.message?.includes('ERC20: insufficient allowance'))
              addNotification({
                id: crypto.randomUUID(),
                createTime: new Date().toISOString(),
                message: `ERC20: insufficient allowance`,
                notificationType: NotificationType.ERROR,
                txHash: '',
                notificationDuration: NotificationDuration.DURATION_5000,
              })

            if (error?.message?.includes('reward token not verified'))
              addNotification({
                id: crypto.randomUUID(),
                createTime: new Date().toISOString(),
                message: `Reward token not verified for this pool`,
                notificationType: NotificationType.ERROR,
                txHash: '',
                notificationDuration: NotificationDuration.DURATION_5000,
              })
          },
        }
      )
    } catch (error: any) {
      //

      setCurrentButtonState(ButtonState.CREATE_BRIBE)
    }
  }

  return (
    <div className="lock-box">
      <div className="flex flex-col w-full xl:flex-row relative z-10   ">
        <div className="w-full mb-5 xl:w-[45%]">
          <div className="flex justify-between mb-5">
            <h4 className="text-xl font-semibold text-white">Bribes</h4>
            <span className="icon-refresh text-shark-100 text-xl cursor-pointer" />
          </div>

          <div className="mb-3">
            <ChoosePool token={tokenSell} setToken={setTokenSell} value={poolValue} setValue={setPoolValue} />
            <Separator single />
            <RewardToken token={tokenGet} setToken={setTokenGet} bal={bal} setBal={setBal} />
          </div>
          <div className="mb-3">
            <Total bal={bal} value={poolValue} setValue={setPoolValue} />
          </div>
          <div className="mb-3">
            <RewardSummary token={tokenSell} value={poolValue} rewardToken={tokenGet} />
          </div>

          <div className="mt-4">
            <Button
              className="w-full"
              variant="primary"
              onClick={() => {
                if (Number(tokenAllowance) < Number(poolValue)) {
                  handleApprove(
                    tokenGet?.address,
                    (poolValue * 10 ** tokenGet?.decimals).toString(),
                    tokenSell?.rewardPair?._externalBribeAddress
                  )
                } else {
                  handleCreateBribe(
                    tokenGet?.address,
                    (poolValue * 10 ** tokenGet?.decimals).toString(),
                    tokenSell?.rewardPair?._externalBribeAddress
                  )
                }
              }}
            >
              {currentButtonState === ButtonState.LOADING ? (
                <Loader color="white" size={20} />
              ) : currentButtonState === ButtonState.APPROVING ? (
                <>
                  <Loader color="white" size={20} /> {currentButtonState}
                </>
              ) : (
                <>{currentButtonState}</>
              )}
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center w-[10%] relative ">
          <div className="bg-shark-400 h-4/5 w-[1px]"></div>
        </div>
        <div className=" flex flex-col w-full xl:w-[45%] max-h-[390px]  overflow-x-none">
          <div>
            <h1 className="text-white text-xl font-medium mb-5">How it works</h1>
          </div>
          {STEPS.map((exchange, index) => (
            <InfoBox
              hasDecorator={STEPS.length === index + 1 ? false : true}
              bgBox="exchange-box-info"
              key={index}
              data={exchange}
              textColor={'text-shark-100'}
            />
          ))}
          <Link
            target="_blank"
            href="https://discord.com/invite/fenixfi"
            className="mt-6 cursor-pointer xl:absolute bottom-0 right-36  text-sm"
          >
            <p className="flex gap-2 justify-center text-shark-100">
              <span className="icon-discord"></span>Need some help?
            </p>
          </Link>
          <div className="absolute xl:-top-[70px]  -top-6 right-0 z-10 w-28  xl:right-[3%] max-w-[100px]">
            <ProgressBar progress={50} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bribes
