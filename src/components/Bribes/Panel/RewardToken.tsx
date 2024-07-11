'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import SelectToken from '@/src/components/Modals/SelectToken'

import { IToken } from '@/src/library/types'
import { useAccount } from 'wagmi'
import { Address } from 'viem'
import { fetchTokenBalance, getTokensBalance } from '@/src/library/hooks/web3/useTokenBalance'
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { FENIX_ADDRESS } from '@/src/library/constants/addresses'
import { formatNumber, fromWei } from '@/src/library/utils/numbers'

interface RewardTokenProps {
  token: any
  bal: string
  setToken: (token: any) => void
  setBal: (bal: string) => void
}

const RewardToken = ({ token, setToken, bal, setBal }: RewardTokenProps) => {
  const { address } = useAccount()
  const [openSelectToken, setOpenSelectToken] = useState<boolean>(false)

  const getTokenBalance = async () => {
    if (address) {
      const newbal = (await fetchTokenBalance(token?.address, address)) as bigint
      const decimals = token?.decimals
      const adjustedBal = Number(newbal) / 10 ** decimals
      setBal(adjustedBal.toString())
    }
  }
  useEffect(() => {
    getTokenBalance()
  }, [token])

  const handlerSelectToken = () => setOpenSelectToken(true)

  //
  return (
    <div className="exchange-box-x2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-sm">Reward Token</p>
        <p className="text-shark-100 flex gap-3 text-sm items-center">
          <span className="icon-wallet text-xs"></span>
          <span className="text-xs">
            Available: {token ? formatNumber(Number(bal), 2) : '0'} {token ? token.symbol : null}
          </span>
        </p>
      </div>
      <div className="flex flex-col xl:flex-row items-center gap-3 cursor-pointer" onClick={handlerSelectToken}>
        <div className="relative w-full">
          <div className="bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px]">
            {token === 'Select a Token' ? (
              'Select a Token'
            ) : (
              <div className="flex items-center gap-2">
                <Image
                  src={`/static/images/tokens/${token.symbol}.png`}
                  alt="token"
                  className="w-6 h-6 rounded-full"
                  width={20}
                  height={20}
                />
                <span className="text-base">{token.symbol}</span>
              </div>
            )}
            <span className="icon-chevron text-sm inline-block ml-2" />
          </div>
        </div>
      </div>
      <SelectToken openModal={openSelectToken} setOpenModal={setOpenSelectToken} setToken={setToken} />
    </div>
  )
}

export default RewardToken
