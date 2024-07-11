'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import SelectToken from '@/src/components/Modals/SelectToken'

import { IToken } from '@/src/library/types'
import { NumericalInput } from '@/src/components/UI/Input'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { ERC20_ABI } from '@/src/library/constants/abi'
import { useBalance, useReadContract } from 'wagmi'
import { BN_TEN, formatCurrency, formatDollarAmount, formatPrice, toBN } from '@/src/library/utils/numbers'
import { zeroAddress } from 'viem'
import { isNativeToken } from './utilsChange'
import { ethers } from 'ethers'

interface ForProps {
  token: IToken
  value: string
  setToken: (token: IToken) => void
  setValue: (value: string) => void
}

const For = ({ token, setToken, setValue, value }: ForProps) => {
  const [openSelectToken, setOpenSelectToken] = useState<boolean>(false)
  const { account, isConnected } = useActiveConnectionDetails()

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  const userBalance = useBalance({
    address: account || zeroAddress,
  })
  const handlerSelectToken = () => setOpenSelectToken(true)
  const [tokenBalance, setTokenBalance] = useState('-')
  const tokenData = useReadContract({
    address: token.address,
    functionName: 'balanceOf',
    args: [account],
    abi: ERC20_ABI,
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      userBalance.refetch()
      tokenData.refetch()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])
  const nativeToken = isNativeToken(token?.address)
  useEffect(() => {
    if (nativeToken) return
    if (tokenData.isSuccess) {
      const myNumber = tokenData.data as bigint
      const myBigNumber = toBN(myNumber.toString())
      const resultado = myBigNumber.div(BN_TEN.pow(token.decimals)).toString()
      setTokenBalance(resultado)
    }
  }, [tokenData, token.decimals, account, nativeToken])
  useEffect(() => {
    if (nativeToken) {
      //
      setTokenBalance(ethers.utils.formatEther(userBalance?.data?.value || 0n).toString())
    }
  }, [nativeToken, userBalance?.data?.value, token])
  return (
    <div className="exchange-box-x2">
      <div className="flex items-center justify-between mb-3">
        <div className="xl:w-2/6">
          <p className="text-white text-sm">For</p>
        </div>
        <div className="text-shark-100 text-sm flex xl:justify-between justify-end gap-6 xl:gap-0 xl:w-4/6 items-center">
          <p className="text-shark-100 text-sm ml-2.5">
            {value && value != '0' && formatDollarAmount(toBN(token.price).multipliedBy(value).toString())}
          </p>
          <div className="flex gap-1.5 items-center">
            <span className="icon-wallet text-xs"></span>
            <span
              onClick={() => {
                if (tokenBalance && isConnected) {
                  setValue(toBN(formatPrice(tokenBalance, 12)).toString())
                } else {
                  setValue('')
                }
              }}
            >
              Available: {((!tokenData.isLoading || nativeToken) && isConnected && !isNaN(+tokenBalance))
                ? formatPrice(tokenBalance, 6)
                : '-'}{' '}
              {token.symbol}
            </span>
          </div>
        </div>
        {/* <p className="text-white text-sm ">For</p> */}
      </div>
      <div className="flex flex-col xl:flex-row items-center gap-3">
        <div className="relative w-full xl:w-2/6">
          <div
            onClick={handlerSelectToken}
            className="bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/tokens/${token.symbol}.svg`}
                alt="token"
                className="w-6 h-6 rounded-full"
                width={20}
                height={20}
              />
              <span className="text-base">{token.symbol}</span>
            </div>
            <span className="icon-chevron text-sm inline-block ml-2" />
          </div>
        </div>
        <div className="relative w-full xl:w-4/6">
          <NumericalInput
            value={value.toString()}
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm cursor-not-allowed"
            placeholder="0.0"
            disabled
            onUserInput={(input) => {
              // setValue(input)
            }}
            precision={token.decimals}
          />
          <div className="absolute right-2 top-[10px] flex items-center gap-1"></div>
        </div>
      </div>
      <SelectToken openModal={openSelectToken} setOpenModal={setOpenSelectToken} setToken={setToken} />
    </div>
  )
}

export default For
