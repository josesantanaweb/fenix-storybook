'use client'
import { useEffect, useState } from 'react'
import { Address, zeroAddress } from 'viem'
import { blast } from 'viem/chains'
import { useSearchParams } from 'next/navigation'
import { Token, computePoolAddress } from '@cryptoalgebra/integral-sdk'

// hooks
import { useShowChart } from '@/src/state/user/hooks'
import { getPair } from '@/src/library/hooks/liquidity/useClassic'
import { useAllPools } from '@/src/state/liquidity/hooks'

// components
import Panel from '@/src/components/Liquidity/Deposit/Panel'
import Chart from '@/src/components/Liquidity/Deposit/Chart'

// constants
import { INIT_CODE_HASH_MANUAL_OVERRIDE } from '@/src/library/constants/algebra'
import { contractAddressList } from '@/src/library/constants/contactAddresses'
import { NATIVE_ETH_LOWERCASE, WETH_ADDRESS } from '@/src/library/Constants'
import InteractiveChart from './Chart/interactive'

const DepositLiquidity = () => {
  // common
  const searchParams = useSearchParams()
  const showChart = useShowChart()
  const { data } = useAllPools()

  // states
  const [pairAddress, setPairAddress] = useState<Address>('0x')
  const [token0, setToken0] = useState(searchParams.get('token0'))
  const [token1, setToken1] = useState(searchParams.get('token1'))
  const [disableChart, setDisableChart] = useState<boolean>(false)
  const [chartPrices, setChartPrices] = useState([])
  const [chartValues, setChartValues] = useState<any[]>([])

  // effects
  useEffect(() => {
    const asyncGetPair = async () => {
      const hash = window.location.hash
      const hashValue = hash.substring(1)
      const pairString = hashValue.split('-')
      if (pairString.length < 1) return

      const pair: Address = (await getPair(
        pairString[1] as Address,
        pairString[2] as Address,
        pairString[0] === 'STABLE'
      )) as Address
      if (pair != '0x0') {
        setPairAddress(pair)
      } else {
        setPairAddress(zeroAddress)
      }
    }

    asyncGetPair()
  }, [])

  useEffect(() => {
    setToken0(searchParams.get('token0'))
    setToken1(searchParams.get('token1'))

    //
  }, [searchParams])

  useEffect(() => {
    let tokenA: string | undefined
    let tokenB: string | undefined
    if (token0 !== null && token1 !== null) {
      tokenA = token0 === NATIVE_ETH_LOWERCASE ? WETH_ADDRESS : token0.toLowerCase()
      tokenB = token1 === NATIVE_ETH_LOWERCASE ? WETH_ADDRESS : token1.toLowerCase()
    }

    const baseUrls: { [key: string]: string } = {
      '0x4300000000000000000000000000000000000003/0x4300000000000000000000000000000000000004':
        'https://www.defined.fi/blast/0x1d74611f3ef04e7252f7651526711a937aa1f75e', // USDB/WETH
      '0x4300000000000000000000000000000000000004/0xf7bc58b8d8f97adc129cfc4c9f45ce3c0e1d2692':
        'https://www.defined.fi/blast/0xc066a3e5d7c22bd3beaf74d4c0925520b455bb6f', // WETH/WBTC
      '0x4300000000000000000000000000000000000004/0xeb466342c4d449bc9f53a865d5cb90586f405215':
        'https://www.defined.fi/blast/0x86d1da56fc79accc0daf76ca75668a4d98cb90a7',
    }

    const key = [tokenA, tokenB].sort().join('/')
    if (tokenA !== undefined && tokenB !== undefined) {
      const quoteToken = tokenA < tokenB ? 'token0' : 'token1'
    }

    if (baseUrls[key]) {
      setDisableChart(false)
    } else {
      setDisableChart(true)
    }
  }, [token0, token1])

  useEffect(() => {
    const tokenA = token0 && token1 ? (normalizeToken(token0) < normalizeToken(token1) ? token0 : token1) : zeroAddress
    const tokenB = token0 && token1 ? (normalizeToken(token0) < normalizeToken(token1) ? token1 : token0) : zeroAddress
    const poolAddress =
      tokenA == tokenB
        ? zeroAddress
        : computePoolAddress({
            tokenA: new Token(blast.id, tokenA, 18), // decimals here are arbitrary
            tokenB: new Token(blast.id, tokenB, 18), // decimals here are arbitrary
            poolDeployer: contractAddressList.pool_deployer,
            initCodeHashManualOverride: INIT_CODE_HASH_MANUAL_OVERRIDE,
          })

    const availablePool = data?.find((pool: any) => pool?.id?.toLowerCase() === poolAddress.toLowerCase())

    if (!token0 || !token1 || availablePool == null) {
      setDisableChart(true)
    } else {
      setDisableChart(false)
    }
  }, [token1, token0, data])

  // helpers
  function normalizeToken(token: string): string {
    return token.toLowerCase() === NATIVE_ETH_LOWERCASE ? WETH_ADDRESS.toLowerCase() : token.toLowerCase()
  }

  return (
    <div className="flex flex-col items-start gap-6 mb-4 xl:gap-10 xl:flex-row">
      <div className="flex flex-col w-full h-[100%]">
        <div className="flex flex-wrap justify-center w-full h-[100%] xl:gap-5 mb-10 xl:flex-nowrap">
          <Panel
            disableChart={disableChart}
            chartPrices={chartPrices}
            setChartValues={(x: any[]) => {
              setChartValues(x)
            }}
          />
          {showChart && (
            <InteractiveChart
              token0={token0}
              token1={token1}
              setChartPrices={(prices: any) => {
                setChartPrices(prices)
              }}
              chartValues={chartValues}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DepositLiquidity
