import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import {
  getUserAmounts,
  getUserBalance,
  IchiVault,
  SupportedDex,
  VaultApr,
  withdraw,
} from '@ichidao/ichi-vaults-sdk'
import { Toaster } from 'react-hot-toast'

// hooks
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { useAllPools, useToken0, useToken1 } from '@/src/state/liquidity/hooks'
import { useRingsPoolApr } from '@/src/library/hooks/rings/useRingsPoolApr'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'

// helpers
import { formatAmount, formatDollarAmount, toBN } from '@/src/library/utils/numbers'
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { getWeb3Provider } from '@/src/library/utils/web3'

// components
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import { NumericalInput } from '@/src/components/UI/Input'
import Loader from '@/src/components/UI/Icons/Loader'

// models
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { BasicPool } from '@/src/state/liquidity/types'
import { IToken } from '@/src/library/types'

// constants
import { ichiVaults } from './ichiVaults'
import { INPUT_PRECISION } from '@/src/library/constants/misc'
import debounce from 'lodash/debounce';
import formatNumberToView from '@/src/library/helper/format-number-to-view';

// custom models
interface modifiedIchiVault extends IchiVault {
  apr?: VaultApr
}

interface Props {
  token: IToken | undefined
  allIchiVaultsByTokenPair: modifiedIchiVault[] | undefined | null
  tokenList: IToken[]
}

// custom constants
const BUTTON_TEXT_WITHDRAW = 'Withdraw'

const WithdrawAmountsICHI = ({
  token,
  allIchiVaultsByTokenPair,
  tokenList,
}: Props) => {
  // common
  const addNotification = useNotificationAdderCallback()
  const { account } = useActiveConnectionDetails()
  const web3Provider = getWeb3Provider()
  const { chainId } = useAccount()
  const token0 = useToken0()
  const token1 = useToken1()
  const { data: pools } = useAllPools()
  const { data: ringsApr, isLoading: rignsAprLoading } = useRingsPoolApr(pools?.find((pool: BasicPool) => {
    return (
      (pool?.token0?.id?.toLowerCase() === token0?.toLowerCase() &&
        pool?.token1?.id?.toLowerCase() === token1?.toLowerCase()) ||
      (pool?.token0?.id?.toLowerCase() === token1?.toLowerCase() &&
        pool?.token1?.id?.toLowerCase() === token0?.toLowerCase())
    )
  }))

  // states
  const [isActive, setIsActive] = useState<boolean>(false)
  const [selected, setIsSelected] = useState<string>('Choose one')
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)
  const [totalShareDollar, setTotalShareDollar] = useState<Number>(0)
  const [totalUserShares, setTotalUserShares] = useState<string>('0')
  const [amoutToWithdraw, setAmountToWithdraw] = useState<string>('')

  // computed
  const dex = SupportedDex.Fenix
  // const NOT_USE_THIS_VAULT = '0x468e041af71b28be7c3b2ad9f91696a0206f0053' // BNB Vault in thena for testing
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
  const firstTokenSymbol =
    tokenList.find((token) => {
      return token.address?.toLowerCase() === selected.toLowerCase()
    })?.symbol || 'WETH'

  // effects
  // useEffect to get the total user shares (balance in the vault)
  useEffect(() => {
    if (!account || !vaultAddress) {
      setTotalUserShares('0')
      return
    }

    setIsSelected(vaultAddress.allowTokenA ? vaultAddress.tokenA.toLowerCase() : vaultAddress.tokenB.toLowerCase())
    const getTotalUserShares = async () => {
      let data
      try {
        data = await getUserBalance(account, vaultAddress.id, web3Provider, dex)
      } catch (e) {
        return
      }
      const amounts: [string, string] & { amount0: string; amount1: string } = await getUserAmounts(
        account,
        vaultAddress.id,
        web3Provider,
        dex
      )
      const tokenAid = ichiVaults.find((v) => {
        if (v.id === vaultAddress.id) {
          return v
        }
      })?.tokenA

      const tokenBid = ichiVaults.find((v) => {
        if (v.id === vaultAddress.id) {
          return v
        }
      })?.tokenB
      if (chainId) {
        const tokenList = await fetchTokens(chainId)
        const tokenAprice = tokenList.find((t) => t?.tokenAddress?.toLowerCase() === tokenAid?.toLowerCase())?.priceUSD
        const tokenBprice = tokenList.find((t) => t?.tokenAddress?.toLowerCase() === tokenBid?.toLowerCase())?.priceUSD
        setTotalShareDollar(
          Number(amounts.amount0) * Number(tokenAprice) + Number(amounts.amount1) * Number(tokenBprice)
        )
      }

      setTotalUserShares(data)
    }
    getTotalUserShares()
  }, [account, vaultAddress, web3Provider, chainId])

  useEffect(() => {
    if (allIchiVaultsByTokenPair && allIchiVaultsByTokenPair?.length > 0) {
      const firstToken = allIchiVaultsByTokenPair[0]
      setIsSelected(
        firstToken.allowTokenA ? firstToken.tokenA.toLocaleLowerCase() : firstToken.tokenB.toLocaleLowerCase()
      )
    }
  }, [allIchiVaultsByTokenPair])

  useEffect(() => {
    toBN(totalUserShares).lte(0) ? setBtnDisabled(true) : setBtnDisabled(false)
  }, [totalUserShares])

  // helpers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetAmountToWithdraw = useCallback(debounce((value: string) => {
    setAmountToWithdraw(formatNumberToView(value, token0?.decimals))
  }, 1000), [])

  function handleSetAmountToWithdraw(value: string) {
    setAmountToWithdraw(value)
    debounceSetAmountToWithdraw(value)
  }

  function getButtonText(): string {
    if (!account) return 'Connect Wallet'
    if (!vaultAddress) return 'Vault not available'
    if (!amoutToWithdraw || amoutToWithdraw == '0') return 'Enter an amount'
    if (parseFloat(amoutToWithdraw) > parseFloat(totalUserShares)) return 'Insufficient balance'
    return BUTTON_TEXT_WITHDRAW
  }

  function handleDecString(value: string, decimals: number): string {
    const regex = new RegExp(`^(\\d+\\.\\d{0,${decimals}})`)
    const match = value.match(regex)
    return match ? match[0] : value
  }

  function handleHalf(): void {
    if (btnDisabled) {
      setAmountToWithdraw('')
    } else {
      if (!totalUserShares || totalUserShares === '') {
        setAmountToWithdraw('')
      } else {
        const value = handleDecString(toBN(totalUserShares).div(2).toString(), 18)
        setAmountToWithdraw(value)
        debounceSetAmountToWithdraw(value)
      }
    }
  }

  function handleMax(): void {
    if (btnDisabled) {
      setAmountToWithdraw('')
    } else {
      if (!totalUserShares || totalUserShares === '') {
        setAmountToWithdraw('')
      } else {
        const value = toBN(totalUserShares.toString()).toString()
        setAmountToWithdraw(value)
        debounceSetAmountToWithdraw(value)
      }
    }
  }

  // async helpers
  // withdraw function
  // FIXME: poner toast??
  async function withdrawFromVault(): Promise<void> {
    if (getButtonText() !== BUTTON_TEXT_WITHDRAW) return
    if (!account) return
    if (!vaultAddress) return
    try {
      const txnDetails = await withdraw(
        account,
        ethers.utils.parseEther(amoutToWithdraw),
        vaultAddress.id,
        web3Provider,
        dex
      )
      // toast.success('Withdrawal Transaction Sent')
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `Withdrawal Transaction Sent.`,
        notificationType: NotificationType.SUCCESS,
        txHash: '',
        notificationDuration: NotificationDuration.DURATION_5000,
      })
      const tx = await txnDetails.wait()
      // toast.success('Withdrawal Successful')
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `Withdrawal Successful.`,
        notificationType: NotificationType.SUCCESS,
        txHash: tx.transactionHash,
        notificationDuration: NotificationDuration.DURATION_5000,
      })
      setAmountToWithdraw('')
    } catch (error: any) {
      if (error?.code == 401) return
      // toast.error(error?.message)
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: `${error?.message}`,
        notificationType: NotificationType.ERROR,
        txHash: '',
        notificationDuration: NotificationDuration.DURATION_5000,
      })
    }
  }

  return (
    <>
      <div className="bg-shark-400 bg-opacity-40 px-[15px] py-[29px] md:px-[19px] border border-shark-950 rounded-[10px] mb-2.5">
        <div className="flex w-full items-center mb-2">
          <div className="flex w-full xl:w-3/5 justify-between">
            <div className="text-xs leading-normal text-white">Withdraw amounts</div>
            <span className="text-xs leading-normal text-shark-100 mr-4 flex items-center gap-x-2">
              {totalShareDollar
                ? formatDollarAmount((Number(totalShareDollar) / Number(totalUserShares)) * Number(amoutToWithdraw))
                : '$ 0'}

              {/* {amoutToWithdraw && tokenList?.find((t) => t?.address?.toLowerCase() === selected.toLowerCase())?.price
                ? formatDollarAmount(
                    toBN(amoutToWithdraw)
                      .multipliedBy(
                        tokenList?.find((t) => t?.address?.toLowerCase() === selected.toLowerCase())?.price || 0
                      )
                      .toString()
                  )
                : ''} */}
            </span>
          </div>
          <div className="xl:w-2/5 flex-shrink-0 flex justify-end">
            <span className="text-xs leading-normal text-shark-100 mr-4 flex items-center gap-x-2">
              <span className="icon-wallet text-xs"></span>
              Withdrawable LP : {totalUserShares != '0' ? formatAmount(totalUserShares, 4) : '-'}{' '}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full xl:w-3/5">
            <Toaster />
            <NumericalInput
              value={amoutToWithdraw}
              onUserInput={handleSetAmountToWithdraw}
              precision={INPUT_PRECISION}
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
              {allIchiVaultsByTokenPair && allIchiVaultsByTokenPair.length !== 0 ? (
                <>
                  <div
                    className="w-full flex justify-between items-center gap-2"
                    onClick={() => setIsActive(!isActive)}
                  >
                    <div className="flex justify-center items-center gap-3">
                      {/* {selected !== 'Choose one' ? ( */}
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
                          setIsActive(!isActive)
                          setIsSelected(
                            vault.allowTokenA ? vault.tokenA.toLocaleLowerCase() : vault.tokenB.toLocaleLowerCase()
                          )
                        }}
                      >
                        <Image
                          src={`/static/images/tokens/${
                            tokenList.find(
                              (t) =>
                                t?.address?.toLowerCase() ===
                                (vault.allowTokenA ? vault.tokenA.toLowerCase() : vault.tokenB.toLowerCase())
                            )?.symbol
                          }.svg`}
                          alt="token"
                          className="w-6 h-6 rounded-full"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col">
                          <span className="text-base">
                            {
                              tokenList.find(
                                (t) =>
                                  t?.address?.toLowerCase() ===
                                  (vault.allowTokenA ? vault.tokenA.toLowerCase() : vault.tokenB.toLowerCase())
                              )?.symbol
                            }
                          </span>
                          {rignsAprLoading && <Loader />}
                          {!rignsAprLoading && vault?.apr && (
                            <span className="text-sm">
                              APR :{' '}
                              {((vault?.apr  as any[1])[0]?.apr === null
                                || isNaN(+(vault?.apr as any[1])[0]?.apr)
                                || (vault?.apr  as any[1])[0]?.apr < 0)
                                ? '0'
                                : formatAmount(
                                    toBN((vault?.apr  as any[1])[0]?.apr?.toFixed(0))
                                      .plus(ringsApr || 0)
                                      .toString(),
                                    2
                                  )}
                              %
                            </span>
                          )}
                        </div>
                        {/* <span className="text-base">{token?.symbol}</span> */}
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

      <Button
        onClick={withdrawFromVault}
        disabled={!(+amoutToWithdraw && !isNaN(+amoutToWithdraw))}
        walletConfig={{
          needWalletConnected: true,
          needSupportedChain: true,
        }}
        variant="tertiary"
        className="w-full mx-auto !text-xs !h-[49px]"
      >
        {getButtonText()}
      </Button>
    </>
  )
}

export default WithdrawAmountsICHI
