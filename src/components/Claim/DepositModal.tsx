// @ts-nocheck

'use client'

import React, { useState, useEffect } from 'react'
import { Button, Modal } from '../UI'
import { useContractWrite } from 'wagmi'
import toast, { Toaster } from 'react-hot-toast'
import { multicall } from '@wagmi/core'
import BigNumber from 'bignumber.js'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'

interface ABI {
  inputs?: {
    internalType?: string
    name?: string
    type?: string
  }[]
  name?: string
  outputs?: {
    internalType?: string
    name?: string
    type?: string
  }[]
  stateMutability?: string
  type?: string
  anonymous?: boolean
  indexed?: boolean
}

interface Item {
  token: string
  abi?: ABI[]
  address: string
  migrateAddress: string
  migrateabi?: ABI[]
  icon: string
  migrated: {
    amount: number
    icon: string
  }
  claimable: {
    amount: number
    icon: string
  }
}

interface DepositModalProp {
  open: Boolean | undefined
  item: Item | undefined
  setOpenModal: (openModal: boolean) => void
  acc: string | undefined
  migrateAmount: string | undefined
  migrateStatus: string | undefined
}

const DepositModal = ({ open, setOpenModal, item, acc, migrateAmount, migrateStatus }: DepositModalProp) => {
  const handleClose = () => setOpenModal(false)
  const [depositAmount, setdepositAmount] = useState('')
  const [tokenIds, settokenIds] = useState([])
  const [isDeposited, setisDeposited] = useState([])
  const [balance, setBalance] = useState(0)
  const [depositiserror, setdepositiserror] = useState(false)

  const addNotification = useNotificationAdderCallback()

  const {
    writeAsync: handleDeposit,
    isLoading: depositIsLoading,
    isSuccess: depositIsSuccess,
    data: depositData,
    error: depositError,
    isError: depositIsError,
  } = useContractWrite({
    address: item.migrateAddress,
    abi: item.migrateabi,
    functionName: migrateStatus === 'success' ? 'deposit' : 'depositnsh',
    args:
      item.token === 'CHR' || item.token === 'spCHR' || item.token === 'elCHR'
        ? [depositAmount * 10 ** 18]
        : [depositAmount],
  })

  const {
    writeAsync: handleapproval,
    isLoading: approvalIsLoading,
    isSuccess: approvalIsSuccess,
    data: approvalData,
    error: approvalError,
    isError: approvalIsError,
  } = useContractWrite({
    address: item.address,
    abi: item.abi,
    functionName: 'approve',
    args:
      item.token === 'CHR' || item.token === 'spCHR' || item.token === 'elCHR'
        ? [item.migrateAddress, depositAmount * 10 ** 18]
        : [item.migrateAddress, depositAmount],
  })
  const handlerdepositCheck = async () => {
    try {
      await handleapproval().then(async (res) => {
        try {
          await handleDeposit()
        } catch (err) {}
      })
    } catch (err) {}
  }
  useEffect(() => {
    if (item.token === 'veCHR' || item.token === 'chrNFT') {
      if (migrateStatus === 'success' && item.token === 'veCHR') {
        multicall({
          contracts: [
            {
              abi: item.migrateabi,
              address: item.migrateAddress,
              functionName: 'totalids',
              args: [acc],
            },
          ],
        }).then((data) => {
          const nftcontractsArray = []
          const nftids = []
          if (data) {
            for (let i = 0; i < data[0]?.result ?? 0; i++) {
              nftcontractsArray.push({
                abi: item.migrateabi,
                address: item.migrateAddress,
                functionName: 'addressToNftIds',
                args: [acc, i],
              })
            }

            multicall({
              contracts: [...nftcontractsArray],
            }).then((ids) => {
              for (let i = 0; i < ids.length; i++) {
                nftids.push(ids[i]?.result)
              }
              const deposited = []
              const depositedIds = []

              for (let i = 0; i < ids.length ?? 0; i++) {
                deposited.push({
                  abi: item.migrateabi,
                  address: item.migrateAddress,
                  functionName: 'deposited',
                  args: [parseInt(ids[i]?.result), acc],
                })
              }
              multicall({
                contracts: [...deposited],
              }).then((deposit) => {
                for (let i = 0; i < ids.length; i++) {
                  depositedIds.push(deposit[i]?.result)
                }
                const filteredArray = []
                nftids.map((value, index) => {
                  if (!depositedIds[index]) {
                    filteredArray.push(nftids[index])
                  }
                })
                settokenIds(filteredArray)
              })

              setisDeposited(depositedIds)
            })
          }
        })
      } else {
        multicall({
          contracts: [
            {
              abi: item.abi,
              address: item.address,
              functionName: 'balanceOf',
              args: [acc],
            },
          ],
        }).then((data) => {
          const nftcontractsArray = []
          const nftids = []
          if (data) {
            for (let i = 0; i < data[0]?.result ?? 0; i++) {
              nftcontractsArray.push({
                abi: item.abi,
                address: item.address,
                functionName: 'tokenOfOwnerByIndex',
                args: [acc, i],
              })
            }

            multicall({
              contracts: [...nftcontractsArray],
            }).then((ids) => {
              for (let i = 0; i < ids.length; i++) {
                nftids.push(ids[i]?.result)
              }
              settokenIds(nftids)
            })
          }
        })
      }
    } else {
      const balanceOf = multicall({
        contracts: [
          {
            abi: item.abi,
            address: item.address,
            functionName: 'balanceOf',
            args: [acc],
          },
        ],
      }).then((data) => {
        setBalance(parseInt(new BigNumber(data[0]?.result).dividedBy(10 ** 18)))
      })
    }
  }, [item])

  useEffect(() => {
    if (approvalIsError) {
      // toast(`${approvalError?.cause}`)
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `${approvalError?.cause}`,
        notificationType: NotificationType.ERROR,
        txHash: hash,
        notificationDuration: NotificationDuration.DURATION_5000,
      })
    }
    if (depositIsError) {
      // toast(`${depositError?.cause}`)
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `${depositError?.cause}`,
        notificationType: NotificationType.ERROR,
        txHash: hash,
        notificationDuration: NotificationDuration.DURATION_5000,
      })
    }
    if (approvalIsLoading) {
      // toast(`Loading approval tx...`)
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `Loading approval tx...`,
        notificationType: NotificationType.DEFAULT,
        txHash: hash,
        notificationDuration: NotificationDuration.DURATION_5000,
      })
    }
    if (depositIsLoading) {
      // toast(`Loading Migration tx...`)
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `Loading Migration tx...`,
        notificationType: NotificationType.DEFAULT,
        txHash: hash,
        notificationDuration: NotificationDuration.DURATION_5000,
      })
    }
    if (approvalIsSuccess) {
      // toast(`Submitted approval tx Successfully`)
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `Submitted approval tx Successfully`,
        notificationType: NotificationType.SUCCESS,
        txHash: hash,
        notificationDuration: NotificationDuration.DURATION_5000,
      })
    }
    if (depositIsSuccess) {
      // toast(`Submitted Migration tx Successfully`)
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `Submitted Migration tx Successfully`,
        notificationType: NotificationType.SUCCESS,
        txHash: hash,
        notificationDuration: NotificationDuration.DURATION_5000,
      })
    }
  }, [approvalIsError, depositIsError, approvalIsLoading, depositIsLoading, approvalIsSuccess, depositIsSuccess])

  return (
    <Modal className="justify-center" openModal={open}>
      <div className="relative rounded-2xl bg-shark-400 bg-opacity-40 py-[50px] text-white xl:mx-auto xl:w-[603px]">
        <button
          className="absolute right-5 top-5 z-10 cursor-pointer text-2xl text-shark-100 hover:bg-button-primary-hover hover:bg-clip-text hover:text-transparent"
          type="button"
          aria-label="Close Modal"
          title="Close"
          onClick={handleClose}
        >
          <span className="icon-x"></span>
        </button>

        <div className="p-5 text-center">
          {item.token === 'veCHR' ? (
            <>
              <label>Input tokenId one by one, to be able to migrate</label>
              <br></br>
              <br></br>
            </>
          ) : item.token === 'chrNFT' ? (
            <>
              <label>chrNFTs need to be unstaked in order to be able to be migrated</label>
              <br></br>
              <br></br>
            </>
          ) : null}

          <div className="w-100 my-2">
            <input
              className="me-8 max-w-[200px] truncate rounded-lg border border-shark-300 bg-shark-400 px-3 py-1 text-center text-xs text-shark-100 md:text-sm"
              type="text"
              value={depositAmount}
              placeholder={
                item.token === 'chrNFT' || item.token === 'veCHR'
                  ? 'Input your token ID, one by one, to be able to migrate'
                  : 'Input Amount'
              }
              onChange={(e) => setdepositAmount(e.target.value)}
            />

            <span
              onClick={() => {
                if (migrateAmount >= balance) setdepositAmount(balance)
                else setdepositAmount(migrateAmount)
              }}
            >
              <label>
                {item.token === 'CHR' || item.token === 'spCHR' || item.token === 'elCHR'
                  ? 'Balance:'
                  : item.token == 'veCHR' || item.token === 'chrNFT'
                    ? 'TokenIds:'
                    : 'TokenIds:'}
              </label>
              <label>
                {' '}
                {item.token === 'CHR' || item.token === 'spCHR' || item.token === 'elCHR'
                  ? balance
                  : item.token === 'veCHR' || item.token === 'chrNFT'
                    ? tokenIds.join(',')
                    : null}
              </label>
            </span>
          </div>
          <div className="w-100 my-5 flex items-center justify-center">
            <Button onClick={handlerdepositCheck}>
              {approvalIsLoading ? 'Approving...' : depositIsLoading ? 'Migrating...' : 'Migrate'}
            </Button>
            <Toaster />
          </div>
        </div>
      </div>
      {depositiserror
        ? addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `${depositError?.cause}`,
            notificationType: NotificationType.SUCCESS,
            txHash: hash,
            notificationDuration: NotificationDuration.DURATION_5000,
          })
        : null}
    </Modal>
  )
}

export default DepositModal
