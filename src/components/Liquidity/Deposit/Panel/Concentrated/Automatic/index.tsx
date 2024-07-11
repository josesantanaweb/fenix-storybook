import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'

// hooks
import { useIchiVault } from '@/src/library/hooks/web3/useIchi'

// store
import { useSetToken0, useSetToken1, useToken0, useToken1 } from '@/src/state/liquidity/hooks'

// helpers
import { fetchTokens } from '@/src/library/common/getAvailableTokens'

// components
import { Button } from '@/src/components/UI'
import PairSelector from '@/src/components/Liquidity/Common/PairSelector'
import DepositAmountsICHI from '@/src/components/Liquidity/Deposit/Panel/Concentrated/Automatic/DepositAmountsICHI'
import CLMProviderSelector from '@/src/components/Liquidity/Deposit/Panel/Concentrated/Automatic/CLMProviderSelector'
import WithdrawAmountsICHI from './WithdrawAmountsICHI'
import WithdrawAmountsGAMMA from './WithdrawAmountsGAMMA'
import DepositAmountsGAMMA from './DepositAmountsGAMMA'

// models
import { IToken } from '@/src/library/types'

// constants
import {
  FENIX_TOKEN_INITIAL_STATE,
  WETH_TOKEN_INITIAL_STATE
} from '@/src/library/constants/common-constants';

// custom models
interface Props {
  providerPick?: number
}

// custom constants
const providers = [
  {
    label: 'ICHI',
    value: '1',
    apr: -1,
    src: 'https://ichi.org/',
    logo: {
      src: '/static/images/providers/ichi.svg',
      width: 63.75,
      height: 21,
    },
  },
  {
    label: 'Gamma',
    value: '2',
    apr: -1,
    src: 'https://app.gamma.xyz',
    logo: {
      src: '/static/images/providers/gamma.svg',
      width: 93.75,
      height: 51,
    },
  },
]

const Automatic = ({ providerPick }: Props) => {
  // common
  const searchParams = useSearchParams()
  const searchParamToken0 = searchParams.get('token0')
  const searchParamToken1 = searchParams.get('token1')
  const token0 = useToken0()
  const token1 = useToken1()
  const setToken0 = useSetToken0()
  const setToken1 = useSetToken1()
  const { chainId } = useAccount()
  const allIchiVaultsByTokenPair = useIchiVault(token0, token1)

  // states
  const [optionActive, setOptionActive] = useState<'ADD' | 'WITHDRAW'>('ADD')
  const [currentProvider, setCurrentProvider] = useState<string>('1')
  const [firstToken, setFirstToken] = useState<IToken>(FENIX_TOKEN_INITIAL_STATE)
  const [secondToken, setSecondToken] = useState<IToken>(WETH_TOKEN_INITIAL_STATE)
  const [tokenList, setTokenList] = useState<IToken[]>([])

  // effects
  useEffect(() => {
    const getData = async () => {
      if (chainId) {
        const tokens = await fetchTokens(chainId)
        const parsedTokens = tokens.map((item: any, index) => {
          return {
            id: index,
            name: item.basetoken.name,
            symbol: item.basetoken.symbol,
            address: item.basetoken.address,
            decimals: item.decimals,
            img: item.logourl,
            isCommon: item.common,
            price: parseFloat(item.priceUSD),
          }
        })
        setTokenList(parsedTokens)
        const token0Data = parsedTokens.find(
          (token: IToken) => token?.address?.toLowerCase() === searchParamToken0?.toLowerCase()
        )
        const token1Data = parsedTokens.find(
          (token: IToken) => token?.address?.toLowerCase() === searchParamToken1?.toLowerCase()
        )
        if (token0.toLowerCase() !== firstToken?.address?.toLowerCase() && token0Data) {
          setToken0(token0Data?.address.toLowerCase())
          setFirstToken(token0Data)
        }

        if (token1.toLowerCase() !== secondToken?.address?.toLowerCase() && token1Data) {
          setToken1(token1Data?.address.toLowerCase())
          setSecondToken(token1Data)
        }
        // set token1
        // setToken0(firstToken?.address.toLowerCase())
        // setToken1(secondToken?.address.toLowerCase())
        // setLoading(false)
      }
    }
    getData()
  }, [chainId])

  useEffect(() => {
    if (!providerPick) return;
    setCurrentProvider(providerPick.toString())
  }, [providerPick])

  // helpers
  function handlerOption(option: 'ADD' | 'WITHDRAW'): void {
    setOptionActive(option)
  }

  return (
    <>
      <PairSelector firstToken={token0} secondToken={token1} tokenList={tokenList} />
      <CLMProviderSelector
        providers={providers}
        currentProvider={currentProvider}
        setCurrentProvider={setCurrentProvider}
      />
      {/* {allIchiVaultsByTokenPair && allIchiVaultsByTokenPair.length ? (
        <>
          <CLMProviderSelector
            providers={providers}
            currentProvider={currentProvider}
            setCurrentProvider={setCurrentProvider}
          />
        </>
      ) : (
        <></>
      )} */}

      <div className="bg-shark-400 bg-opacity-40 p-[13px] md:py-[11px] md:px-[19px] flex gap-1.5 md:gap-2.5 border border-shark-950 rounded-[10px] mb-2.5">
        <Button
          onClick={() => handlerOption('ADD')}
          className="w-full h-[38px] mx-auto !text-xs"
          variant={optionActive === 'ADD' ? 'primary' : 'secondary'}
        >
          Add
        </Button>
        <Button
          onClick={() => handlerOption('WITHDRAW')}
          className="w-full h-[38px] mx-auto !text-xs"
          variant={optionActive === 'WITHDRAW' ? 'primary' : 'secondary'}
        >
          Withdraw
        </Button>
      </div>

      {currentProvider === '1' && optionActive === 'ADD' && (
        <DepositAmountsICHI
          allIchiVaultsByTokenPair={allIchiVaultsByTokenPair as any}
          token={token0}
          tokenList={tokenList}
        />
      )}
      {currentProvider === '1' && optionActive === 'WITHDRAW' && (
        <WithdrawAmountsICHI
          allIchiVaultsByTokenPair={allIchiVaultsByTokenPair as any}
          token={token0}
          tokenList={tokenList}
        />
      )}

      {currentProvider === '2' && optionActive === 'ADD' && <DepositAmountsGAMMA tokenList={tokenList} />}
      {currentProvider === '2' && optionActive === 'WITHDRAW' && (
        <WithdrawAmountsGAMMA firstToken={token0} secondToken={token1} tokenList={tokenList} />
      )}

      {/* <Button className="w-full mx-auto !text-xs !h-[49px]" variant="tertiary">
        Create Position
      </Button> */}
    </>
  )
}

export default Automatic
