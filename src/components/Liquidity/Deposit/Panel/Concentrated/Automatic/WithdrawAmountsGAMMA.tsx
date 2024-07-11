import { useCallback, useMemo } from 'react';
import { ethers } from 'ethers'
import { Address, erc20Abi } from 'viem'
import debounce from 'lodash/debounce';

// hooks
import { useReadContracts, useWriteContract } from 'wagmi'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import {
  useSetToken0TypedValue,
  useSetToken1TypedValue,
  useToken0,
  useToken0TypedValue,
  useToken1,
  useToken1TypedValue,
} from '@/src/state/liquidity/hooks'

// helpers
import { formatPrice, toBN } from '@/src/library/utils/numbers'
import { getWeb3Provider } from '@/src/library/utils/web3'
import formatNumberToView from '@/src/library/helper/format-number-to-view';

// components
import { Button } from '@/src/components/UI'
import { NumericalInput } from '@/src/components/UI/Input'

// models
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { IToken } from '@/src/library/types'

// constants
import { INPUT_PRECISION } from '@/src/library/constants/misc'
import { gammaVaults } from '@/src/components/Liquidity/Deposit/Panel/Concentrated/Automatic/gammaVaults'
import { gammaHypervisorABI } from '@/src/library/constants/abi/gammaHypervisorABI'

// custom models
interface Props {
  firstToken: { name: string; symbol: string }
  secondToken: { name: string; symbol: string }
  tokenList: IToken[]
}

const WithdrawAmountsGAMMA = ({
  firstToken,
  secondToken,
  tokenList,
}: Props) => {
  // common
  const { account } = useActiveConnectionDetails() as { account: Address }
  const addNotification = useNotificationAdderCallback()
  const token0 = useToken0()
  const token1 = useToken1()
  const token0TypedValue = useToken0TypedValue()
  const token1TypedValue = useToken1TypedValue()
  const setToken0TypedValue = useSetToken0TypedValue()
  const setToken1TypedValue = useSetToken1TypedValue()
  const { writeContractAsync } = useWriteContract()
  const vault = gammaVaults.find(
    (vault) =>
      (vault?.token0?.toLowerCase() === token0 && vault?.token1?.toLowerCase() === token1) ||
      (vault?.token1?.toLowerCase() === token0 && vault?.token0?.toLowerCase() === token1)
  )
  const vaultData = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: vault?.id as Address,
        functionName: 'balanceOf',
        args: [account],
      },
      {
        abi: erc20Abi,
        address: vault?.id as Address,
        functionName: 'decimals',
      },
    ],
  })

  // computed
  const token0IToken = useMemo(() => {
    return tokenList.find((token) => token?.address?.toLowerCase() === token0?.toLowerCase())
  }, [tokenList, token0])
  const vaultDecimals = vaultData?.data?.[1]?.result || 18
  const userVaultBalance = ethers.utils.formatUnits(vaultData?.data?.[0]?.result?.toString() || '0', vaultDecimals)

  // helpers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetToken0TypedValue = useCallback(debounce((value: string) => {
    setToken0TypedValue(formatNumberToView(value, token0IToken?.decimals))
  }, 1000), [])

  function handleToken0InputChange(value: string) {
    setToken0TypedValue(value)
    debounceSetToken0TypedValue(value)
  }

  function handleHalf(): void {
    if (toBN(userVaultBalance).gt(0)) {
      const value = toBN(formatPrice(userVaultBalance, vaultDecimals)).div(2).toString()
      setToken0TypedValue(value)
      debounceSetToken0TypedValue(value)
    }
  }

  function handleMax(): void {
    if (toBN(userVaultBalance).gt(0)) {
      const value = toBN(formatPrice(userVaultBalance, vaultDecimals)).toString()
      setToken0TypedValue(value)
      debounceSetToken0TypedValue(value)
    }
  }

  // async helpers
  async function withdraw(): Promise<void> {
    if (!vault?.id) return
    //
    console.log(vaultData?.data?.[0]?.result?.toString(), BigInt(ethers.utils.parseUnits(token0TypedValue, vaultDecimals).toString()))
    await writeContractAsync(
      {
        address: vault.id as Address,
        functionName: 'withdraw',
        abi: gammaHypervisorABI,
        args: [
          BigInt(ethers.utils.parseUnits(token0TypedValue, vaultDecimals).toString()),
          account,
          account,
          [0n, 0n, 0n, 0n],
        ],
      },
      {
        onSuccess: async (txHash) => {
          const web3Provider = getWeb3Provider()
          setToken0TypedValue('')
          addNotification({
            id: crypto.randomUUID(),
            message: 'Withdraw successful',
            notificationType: NotificationType.SUCCESS,
            txHash,
            notificationDuration: NotificationDuration.DURATION_5000,
            createTime: new Date().toISOString(),
          })
          await web3Provider.waitForTransaction(txHash)
          vaultData?.refetch()
          setTimeout(() => {
            vaultData?.refetch()
          }, 1000)
        },
      }
    )
  }

  return (
    <div className="bg-shark-400 bg-opacity-40 px-[15px] py-[29px] md:px-[19px] border border-shark-950 rounded-[10px] mb-2.5">
      {vault?.id ? (
        <>
          {' '}
          <div className="text-xs leading-normal text-white ">Withdraw amounts</div>
          <div className="flex items-end gap-3 mb-[14px]">
            <div className="relative w-full xl:w-3/5">
              <NumericalInput
                value={token0TypedValue}
                onUserInput={handleToken0InputChange}
                precision={INPUT_PRECISION}
                placeholder="0.0"
                className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-s"
              />
              <div className="absolute right-2 top-[10px] flex items-center gap-1 max-md:hidden">
                <Button
                  variant="tertiary"
                  className="!py-1 !px-3"
                  onClick={handleHalf}
                >
                  Half
                </Button>
                <Button
                  variant="tertiary"
                  className="!py-1 !px-3"
                  onClick={handleMax}
                  //   onClick={() => {
                  //     toBN(token0Balance).gt(0) &&
                  //       handleToken0InputChange(toBN(formatPrice(token0Balance, 14)).toString())
                  //   }}
                >
                  Max
                </Button>
              </div>
            </div>

            <div className="relative xl:w-2/5 flex-shrink-0">
              <span className="text-xs leading-normal text-shark-100 mr-4 flex items-center gap-x-2 mb-1">
                {/*
            <span className="icon-wallet text-xs"></span>
*/}
                {/*
            LP Tokens: 234234234 ($34.33)
*/}
              </span>
              <div className="bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px]">
                <div className="flex items-center w-full">
                  <div className="flex justify-start flex-col">
                    {/*  <Image
                    src={`/static/images/tokens/${token?.symbol}.svg`}
                    alt="token"
                    className="w-6 h-6 rounded-full"
                    width={20}
                    height={20}
                />*/}
                    <span>LP Tokens</span>
                    {/*
                <span className="text-base">{token?.symbol}</span>
*/}{' '}
                    {/*   <span className={'text-xs leading-normal text-shark-100'}> 0.34 WETH ($11.22)</span>
                <span className={'text-xs leading-normal text-shark-100'}>0.22 USDB ($4.45)</span>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <Button
        variant={'tertiary'}
        disabled={!vault?.id || +token0TypedValue > +userVaultBalance || !(+token0TypedValue && !isNaN(+token0TypedValue))}
        onClick={withdraw}
        walletConfig={{
          needSupportedChain: true,
          needWalletConnected: true,
        }}
        className="w-full mx-auto !text-xs !h-[49px] mt-4"
      >
        {vault?.id ? (+token0TypedValue > +userVaultBalance ? 'Insufficient balance' : 'Withdraw') : 'Vault not available'}
      </Button>
    </div>
  )
}

export default WithdrawAmountsGAMMA
