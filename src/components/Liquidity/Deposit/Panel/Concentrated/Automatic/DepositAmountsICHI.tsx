import { useCallback, useEffect, useState } from 'react'
import { useReadContracts } from 'wagmi'
import { formatUnits, zeroAddress, erc20Abi } from 'viem'
import {
  approveDepositToken,
  deposit,
  IchiVault,
  isDepositTokenApproved,
  SupportedDex,
  VaultApr,
} from '@ichidao/ichi-vaults-sdk'
import { Toaster } from 'react-hot-toast'
import debounce from 'lodash/debounce';

// hooks
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import {
  useAllPools,
  useSetToken0TypedValue,
  useToken0,
  useToken0TypedValue,
  useToken1,
} from '@/src/state/liquidity/hooks'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useRingsPoolApr } from '@/src/library/hooks/rings/useRingsPoolApr'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'

// helpers
import { formatAmount, formatCurrency, formatDollarAmount, toBN } from '@/src/library/utils/numbers'
import { getWeb3Provider } from '@/src/library/utils/web3'
import { postEvent } from '@/src/library/utils/events'
import formatNumberToView from '@/src/library/helper/format-number-to-view';

// components
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import { NumericalInput } from '@/src/components/UI/Input'
import Loader from '@/src/components/UI/Icons/Loader'
import Spinner from '@/src/components/Common/Spinner'

// models
import { BasicPool } from '@/src/state/liquidity/types'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { IToken } from '@/src/library/types'

// constants
import { INPUT_PRECISION } from '@/src/library/constants/misc'

// custom models
interface modifiedIchiVault extends IchiVault {
  apr?: VaultApr
}

interface Props {
  token: IToken | undefined
  allIchiVaultsByTokenPair: modifiedIchiVault[] | undefined | null
  tokenList: IToken[]
}

const DepositAmountsICHI = ({
  token,
  allIchiVaultsByTokenPair,
  tokenList,
}: Props) => {
  // common
  const addNotification = useNotificationAdderCallback()
  const { account } = useActiveConnectionDetails()
  const web3Provider = getWeb3Provider()
  const { openConnectModal } = useConnectModal()
  const token0 = useToken0()
  const { data: pools } = useAllPools()
  const token1 = useToken1()
  const { data: ringsApr, isLoading: rignsAprLoading } = useRingsPoolApr(pools?.find((pool: BasicPool) => {
    return (
      (pool?.token0?.id?.toLowerCase() === token0?.toLowerCase() &&
        pool?.token1?.id?.toLowerCase() === token1?.toLowerCase()) ||
      (pool?.token0?.id?.toLowerCase() === token1?.toLowerCase() &&
        pool?.token1?.id?.toLowerCase() === token0?.toLowerCase())
    )
  }))
  // allIchiVaultsByTokenPair
  const token0TypedValue = useToken0TypedValue()
  const setToken0TypedValue = useSetToken0TypedValue()

  // states
  const [isActive, setIsActive] = useState<boolean>(false)
  const [selected, setIsSelected] = useState<string>('Choose one')
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)
  const [isToken0ApprovalRequired, setIsToken0ApprovalRequired] = useState(false)
  const [waitingApproval, setWaitingApproval] = useState(false)
  const [loading, setLoading] = useState(false)

  // computed
  const { data: token0Data } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: selected as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account || zeroAddress],
      },
      {
        address: selected as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
      },
    ],
  })
  const dex = SupportedDex.Fenix
  const tokenPrice = tokenList?.find((t) => t?.address?.toLowerCase() === selected.toLowerCase())?.price || 0
  const vaultAddress =
    allIchiVaultsByTokenPair?.find((vault) => {
      if (vault.tokenA.toLowerCase() === selected.toLowerCase() && vault.allowTokenA) {
        return true
      }
      if (vault.tokenB.toLowerCase() === selected.toLowerCase() && vault.allowTokenB) {
        return true
      }
      return false
    }) || null
  const token0Balance = token0Data?.[0]
  const token0Decimals = token0Data?.[1] || 18
  const firstTokenSymbol =
    tokenList.find((token) => {
      return token.address?.toLowerCase() === selected.toLowerCase()
    })?.symbol || 'WETH'

  // effects
  useEffect(() => {
    setToken0TypedValue('')
  }, [token0, setToken0TypedValue])

  useEffect(() => {
    const checkApproval = async () => {
      if (!account) {
        return
      }
      if (!vaultAddress || allIchiVaultsByTokenPair?.length === 0) {
        return
      }
      const isToken0Approved = await isDepositTokenApproved(
        account,
        // check if deposit token is tokenA or tokenB
        vaultAddress.tokenA.toLowerCase() === selected.toLowerCase() && vaultAddress.allowTokenA ? 0 : 1,
        token0TypedValue || '0',
        vaultAddress.id,
        web3Provider,
        dex
      )
      setIsToken0ApprovalRequired(!isToken0Approved)
      return
    }
    checkApproval()
  }, [
    token0TypedValue,
    selected,
    token0Decimals,
    dex,
    waitingApproval,
    web3Provider,
    vaultAddress,
    account,
    allIchiVaultsByTokenPair?.length,
  ])

  useEffect(() => {
    if (!vaultAddress) return
    setIsSelected(
      vaultAddress.allowTokenA ? vaultAddress.tokenA.toLocaleLowerCase() : vaultAddress.tokenB.toLocaleLowerCase()
    )
  }, [vaultAddress])

  useEffect(() => {
    if (allIchiVaultsByTokenPair && allIchiVaultsByTokenPair?.length > 0) {
      const firstToken = allIchiVaultsByTokenPair[0]
      setIsSelected(
        firstToken.allowTokenA ? firstToken.tokenA.toLocaleLowerCase() : firstToken.tokenB.toLocaleLowerCase()
      )
    }
  }, [allIchiVaultsByTokenPair])

  useEffect(() => {
    toBN(Number(token0Balance)).lte(0) ? setBtnDisabled(true) : setBtnDisabled(false)
  }, [token0Balance])

  // helpers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetToken0TypedValue = useCallback(debounce((value: string) => {
    setToken0TypedValue(formatNumberToView(value, token0?.decimals))
  }, 1000), [])

  function handlerConnectWallet(): void {
    openConnectModal && openConnectModal()
  }

  function handleToken0InputChange(value: string): void {
    setToken0TypedValue(value)
    debounceSetToken0TypedValue(value)
  }

  function getButtonText(): string {
    if (!account) return 'Connect Wallet'
    if (!vaultAddress) return 'Vault not available'
    if (waitingApproval) return 'Waiting for approval'
    if (!token0TypedValue) return 'Enter an amount'
    if (isToken0ApprovalRequired) return `Approve ${firstTokenSymbol}`

    const typedValueBN = toBN(token0TypedValue)
    const balanceBN = toBN(formatUnits(token0Balance || 0n, token0Decimals))
    if (typedValueBN.gt(balanceBN)) return 'Insufficient balance'
    if (loading) return 'Depositing'
    return 'Deposit'
  }

  function handleHalf(): void {
    if (btnDisabled) {
      setToken0TypedValue('')
    } else {
      if (token0Balance) {
        const value = toBN(formatUnits(token0Balance, token0Decimals)).div(2).toString()
        setToken0TypedValue(value)
        debounceSetToken0TypedValue(value)
      } else {
        setToken0TypedValue('')
      }
    }
  }

  function handleMax(): void {
    if (btnDisabled) {
      setToken0TypedValue('')
    } else {
      if (token0Balance) {
        const value = toBN(token0Balance.toString()).div(10 ** (token0Decimals || 18)).toString()
        setToken0TypedValue(value)
        debounceSetToken0TypedValue(value)
      } else {
        setToken0TypedValue('')
      }
    }
  }

  // async helpers
  async function createPosition(): Promise<void> {
    setLoading(true)
    try {
      if (!account) {
        handlerConnectWallet()
        return
      }
      if (!vaultAddress || allIchiVaultsByTokenPair?.length === 0) {
        // toast.error('Vault not available')
        addNotification({
          id: crypto.randomUUID(),
          createTime: new Date().toISOString(),
          message: `Vault not available.`,
          notificationType: NotificationType.ERROR,
          txHash: '',
          notificationDuration: NotificationDuration.DURATION_5000,
        })

        return
      }
      if (isToken0ApprovalRequired) {
        setWaitingApproval(true)
        try {
          //
          const txApproveDepositDetails = await approveDepositToken(
            account,
            vaultAddress.tokenA.toLowerCase() === selected.toLowerCase() && vaultAddress.allowTokenA ? 0 : 1,
            vaultAddress.id,
            web3Provider,
            dex
          )
          await txApproveDepositDetails.wait()
          setIsToken0ApprovalRequired(false)
          setWaitingApproval(false)

          return
        } catch (error) {
          //
          setWaitingApproval(false)

          return
        }
      }
      if (!token0TypedValue) {
        // toast.error('Please enter a valid amount')
        addNotification({
          id: crypto.randomUUID(),
          createTime: new Date().toISOString(),
          message: `Please enter a valid amount.`,
          notificationType: NotificationType.ERROR,
          txHash: '',
          notificationDuration: NotificationDuration.DURATION_5000,
        })
        return
      }

      // const depositToken0 = token0 >= token1 ? '0' : ethers.utils.parseUnits(token0TypedValue, token0Decimals)
      // const depositToken1 = token0 < token1 ? '0' : ethers.utils.parseUnits(token0TypedValue, token0Decimals)
      const depositToken0 = vaultAddress.allowTokenA && !vaultAddress.allowTokenB ? token0TypedValue : 0
      const depositToken1 = vaultAddress.allowTokenB && !vaultAddress.allowTokenA ? token0TypedValue : 0

      try {
        const txDepositDetails = await deposit(
          account,
          depositToken0,
          depositToken1,
          vaultAddress.id,
          web3Provider,
          dex,
          1
        )
        const tx = await txDepositDetails.wait()
        // toast.success('Deposited successfully')
        addNotification({
          id: crypto.randomUUID(),
          createTime: new Date().toISOString(),
          message: `Deposited successfully.`,
          notificationType: NotificationType.SUCCESS,
          txHash: tx.transactionHash,
          notificationDuration: NotificationDuration.DURATION_5000,
        })
        await postEvent({
          tx: tx.transactionHash,
          user: account,
          event_type: 'ADD_LIQUIDITY',
          value: tokenPrice * Number(token0TypedValue),
        })
      } catch (error) {
        //
        //
        if (error instanceof Error && 'code' in error) {
          if (error.code == 'ACTION_REJECTED') {
            // toast.error('Action rejected')
            // toast.error(error.message.split('(')[0].trim().toUpperCase())
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `${error.message.split('(')[0].trim().toUpperCase()}`,
              notificationType: NotificationType.ERROR,
              txHash: '',
              notificationDuration: NotificationDuration.DURATION_5000,
            })
            // FIXME: STARK
          } else if ('reason' in error && error?.reason == 'IV.deposit: deposits too large') {
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Deposits are unavailable due to pool volatility.`,
              notificationType: NotificationType.ERROR,
              txHash: '',
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          }
        } else {
          //
          // toast.error('Transaction failed')
          // toast.error(error.message.split('(')[0].trim().toUpperCase())
          // FIXME: STARK
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `${(error as Error).message}`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-shark-400 bg-opacity-40 px-[15px] py-[29px] md:px-[19px] border border-shark-950 rounded-[10px] mb-2.5">
        <div className="flex w-full items-center mb-2">
          <div className="flex w-full xl:w-3/5 justify-between">
            <div className="text-xs leading-normal text-white ">Deposit amounts</div>

            <span className="text-xs leading-normal text-shark-100 mr-4 flex items-center gap-x-2">
              {token0TypedValue && tokenList?.find((t) => t?.address?.toLowerCase() === selected.toLowerCase())?.price
                ? formatDollarAmount(
                    toBN(token0TypedValue)
                      .multipliedBy(
                        tokenList?.find((t) => t?.address?.toLowerCase() === selected.toLowerCase())?.price || 0
                      )
                      .toString()
                  )
                : ''}
            </span>
          </div>
          <div className="xl:w-2/5 flex-shrink-0 flex justify-end">
            <span className="text-xs leading-normal text-shark-100 mr-4 flex items-center gap-x-2">
              <span className="icon-wallet text-xs"></span>
              Available: {token0Balance ? formatCurrency(formatUnits(token0Balance || 0n, token0Decimals)) : '-'}{' '}
              {tokenList?.find((t) => t?.address?.toLowerCase() === selected.toLowerCase())?.symbol}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full xl:w-3/5">
            <Toaster />
            <NumericalInput
              value={token0TypedValue}
              onUserInput={handleToken0InputChange}
              precision={token0Decimals || INPUT_PRECISION}
              placeholder="0.0"
              className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
            />
            <div className="absolute right-2 top-[10px] flex items-center gap-1 max-md:hidden">
              <Button variant="tertiary" className="!py-1 !px-3" onClick={handleHalf}>
                Half
              </Button>
              <Button variant="tertiary" className="!py-1 !px-3" onClick={handleMax}>
                Max
              </Button>
            </div>
          </div>
          <div className="relative xl:w-2/5 flex-shrink-0">
            <div className="bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px]">
              {allIchiVaultsByTokenPair && allIchiVaultsByTokenPair.length !== 0 && selected ? (
                <>
                  <div
                    className="w-full flex justify-between items-center gap-2"
                    onClick={() => setIsActive(!isActive)}
                  >
                    <div className="flex justify-center items-center gap-3">
                      <>
                        <Image
                          src={`/static/images/tokens/${firstTokenSymbol}.svg`}
                          alt="token"
                          className="w-6 h-6 rounded-full"
                          width={20}
                          height={20}
                        />
                        <span className="text-base">{firstTokenSymbol}</span>
                      </>

                      {/* <span
                        className={`inline-block ml-2 text-xs icon-chevron md:text-sm ${isActive ? 'rotate-180' : ''}`}
                      /> */}
                    </div>
                    <span
                      className={`inline-block ml-2 text-xs icon-chevron md:text-sm ${isActive ? 'rotate-180' : ''}`}
                    />
                  </div>
                  <div
                    className={`rounded-lg absolute top-[calc(100%+10px)] w-[230px] left-1/2 max-md:-translate-x-1/2 md:w-full md:left-0 right-0 flex flex-col gap-[5px] overflow-auto scrollbar-hide z-20 p-3
                    ${isActive ? 'visible bg-shark-500 !bg-opacity-80 border-shark-200' : 'hidden'}`}
                  >
                    {allIchiVaultsByTokenPair.map((vault: modifiedIchiVault) => (
                      <div
                        className="flex justify-start items-center gap-3 cursor-pointer m-1 p-2 bg-shark-300 border-shark-200 rounded-md hover:bg-shark-100"
                        key={vault.id}
                        onClick={() => {
                          setIsActive(false)
                          setIsSelected(
                            vault.allowTokenA ? vault.tokenA.toLocaleLowerCase() : vault.tokenB.toLocaleLowerCase()
                          )
                        }}
                      >
                        <Image
                          // src={`/static/images/tokens/${token?.symbol}.svg`}
                          src={`/static/images/tokens/${
                            tokenList.find((t) => {
                              return (
                                t.address?.toLowerCase() ===
                                (vault.allowTokenA ? vault.tokenA.toLowerCase() : vault.tokenB.toLowerCase())
                              )
                            })?.symbol
                          }.svg`}
                          alt="token"
                          className="w-6 h-6 rounded-full"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col">
                          <span className="text-base">
                            {
                              tokenList.find((t) => {
                                return (
                                  t.address?.toLowerCase() ===
                                  (vault.allowTokenA ? vault.tokenA.toLowerCase() : vault.tokenB.toLowerCase())
                                )
                              })?.symbol
                            }
                          </span>
                          {rignsAprLoading && <Loader />}
                          {!rignsAprLoading && vault?.apr && (
                            <span className="text-sm">
                              APR :{' '}
                              {((vault?.apr as any[1])[0]?.apr === null
                                || isNaN(+(vault?.apr as any[1])[0]?.apr)
                                || (vault?.apr as any[1])[0]?.apr < 0)
                                ? '0'
                                : formatAmount(
                                    toBN((vault?.apr as any[1])[0]?.apr?.toFixed(0))
                                      .plus(ringsApr || 0)
                                      .toString(),
                                    2
                                  )}
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-sm text-shark-100">No vaults available</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <Button onClick={testinPosition}>Deposit testing</Button> */}
      <Button
        onClick={createPosition}
        disabled={!(+token0TypedValue && !isNaN(+token0TypedValue))}
        variant="tertiary"
        className="w-full mx-auto !text-xs !h-[49px]"
        walletConfig={{
          needWalletConnected: true,
          needSupportedChain: true,
        }}
      >
        {loading && (
          <span className="m-2 text-sm">
            <Spinner />
          </span>
        )}{' '}
        {getButtonText()}
      </Button>
    </>
  )
}

export default DepositAmountsICHI
