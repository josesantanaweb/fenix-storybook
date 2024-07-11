'use client'

import { NATIVE_ETH_LOWERCASE, WETH_ADDRESS } from '@/src/library/Constants'
import { contractAddressList } from '@/src/library/constants/contactAddresses'
import { useAllPools } from '@/src/state/liquidity/hooks'
import { zeroAddress } from 'viem'
import { Token, computePoolAddress } from '@cryptoalgebra/integral-sdk'
import { blast } from 'viem/chains'
import { INIT_CODE_HASH_MANUAL_OVERRIDE } from '@/src/library/constants/algebra'
import { D3ChartSettingsProps, D3ChartWrapper } from '@/src/library/d3'
import { D3ChartCandlesticks } from '@/src/components/simulator/input/d3Chart'
import { useEffect, useState } from 'react'
import { getCandles } from '@/src/utils/definedApi'
import Chart from '.'
import Toggle from '@/src/components/Common/Layout/Header/Mobile/Toggle'
import { Button, Switch } from '@/src/components/UI'
import { usePathname, useSearchParams } from 'next/navigation'

const InteractiveChart = ({
  token0,
  token1,
  setChartPrices,
  chartValues,
}: {
  token0?: string | null
  token1?: string | null
  setChartPrices: ([]) => void
  chartValues: any[]
}) => {
  const [prices, setPrices] = useState({
    buy: {
      min: '3000',
      max: '3700',
    },
    sell: {
      min: '3000',
      max: '3700',
    },
  })
  const [candles, setCandles] = useState<any[]>([])
  const [fullCandles, setFullCandles] = useState<any[]>([])

  const [currentPrice, setCurrenPrice] = useState(0)
  const [isInteractive, setIsInteractive] = useState(true)
  const [zoomCandles, setZoomCandles] = useState(30)

  useEffect(() => {
    const asyncFn = async () => {
      const data = await getCandles(chartValues[4], chartValues[3] ? 'token1' : 'token0')
      setFullCandles(data)
    }

    asyncFn()
  }, [chartValues])

  useEffect(() => {
    setCandles(fullCandles.slice(-zoomCandles))
  }, [fullCandles, zoomCandles])
  const pathname = usePathname()
  //chartValues [current price, min range price, max range price, isInverse, pool address]
  useEffect(() => {
    if (!chartValues[0]) return
    const isFullRange = chartValues[1] == '0' && chartValues[2] == '-1'
    setCurrenPrice(chartValues[3] ? 1 / chartValues[0].toFixed(10) : chartValues[0].toFixed(10))
    if (isInteractive) {
      setPrices({
        buy: {
          min: chartValues[3] ? 1 / chartValues[2] : chartValues[1],
          max: chartValues[3] ? 1 / chartValues[1] : chartValues[2],
        },
        sell: {
          min: chartValues[3] ? 1 / chartValues[2] : chartValues[1],
          max: chartValues[3] ? 1 / chartValues[1] : chartValues[2],
        },
      })
    }
  }, [chartValues, isInteractive])

  const normalizeToken = (token: string) =>
    token.toLowerCase() === NATIVE_ETH_LOWERCASE ? WETH_ADDRESS.toLowerCase() : token.toLowerCase()

  const tokenA = token0 && token1 ? (normalizeToken(token0) < normalizeToken(token1) ? token0 : token1) : zeroAddress
  const tokenB = token0 && token1 ? (normalizeToken(token0) < normalizeToken(token1) ? token1 : token0) : zeroAddress
  const poolAddress =
    tokenA == tokenB
      ? '0x0000000000000000000000000000000000000000'
      : computePoolAddress({
          tokenA: new Token(blast.id, tokenA, 18), // decimals here are arbitrary
          tokenB: new Token(blast.id, tokenB, 18), // decimals here are arbitrary
          poolDeployer: contractAddressList.pool_deployer,
          initCodeHashManualOverride: INIT_CODE_HASH_MANUAL_OVERRIDE,
        })

  const { data } = useAllPools()

  const availablePool = data?.find((pool: any) => pool?.id?.toLowerCase() === poolAddress.toLowerCase())

  const chartSettings: D3ChartSettingsProps = {
    width: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 40,
    marginLeft: 0,
    marginRight: 40,
  }
  const searchParams = useSearchParams()
  const [showInteractiveChart, setShowInteractiveChart] = useState(true)
  // useEffect(() => {
  //   const liquidityDepositType = searchParams.get('type')
  //   if (liquidityDepositType !== 'CONCENTRATED_MANUAL') {
  //     setShowInteractiveChart(false)
  //     setIsInteractive(false)
  //   } else {
  //     setIsInteractive(false)

  //     setShowInteractiveChart(true)
  //   }
  //   //
  // }, [searchParams])
  if (!token0 || !token1 || availablePool == null) return null
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return (
    <div className="w-[100%] relative">
      <div className="flex gap-x-2 justify-end items-center my-4">
        <Button
          className="h-[38px]"
          onClick={() => {
            setIsInteractive(true)
          }}
          variant={isInteractive ? 'primary' : 'secondary'}
        >
          Interactive Chart
        </Button>

        <Button
          onClick={() => {
            setIsInteractive(false)
          }}
          className="h-[38px]"
          variant={!isInteractive ? 'primary' : 'secondary'}
        >
          Trading View
        </Button>
      </div>

      <div
        className={`sticky top-5 left-0 flex flex-col w-[100%] xl:rounded-2xl max-xl:rounded-b-2xl max-xl:pb-4 max-xl:h-[600px] xl:h-[525px] px-3 xl:border xl:border-shark-950 xl:p-[3px] max-xl:bg-shark-400 max-xl:bg-opacity-40 justify-items-stretch`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* <Switch
              active={isInteractive}
              setActive={() => {
                setIsInteractive(!isInteractive)
              }}
            />
            <p>Interactive Chart</p>
            <Button onClick={() => setZoomCandles(zoomCandles + 1)}>+</Button>
            <Button onClick={() => setZoomCandles(zoomCandles - 1)}>-</Button> */}
          </div>
        </div>
        {!isInteractive ? (
          <iframe
            height="100%"
            width="100%"
            src={`https://dexscreener.com/blast/${poolAddress}?embed=1&theme=dark&trades=0&info=0`}
            allow="clipboard-write"
            className="rounded-lg"
          />
        ) : candles.length > 0 ? (
          <D3ChartWrapper
            settings={chartSettings}
            className="rounded-12 self-stretch bg-black h-full"
            data-testid="price-chart"
          >
            {(dms) => (
              <D3ChartCandlesticks
                dms={dms}
                prices={prices}
                onPriceUpdates={(x) => {
                  setPrices(x)
                }}
                data={candles}
                marketPrice={currentPrice}
                bounds={
                  prices.buy.min == ''
                    ? {
                        buy: {
                          min: currentPrice.toString(),
                          max: currentPrice.toString(),
                        },
                        sell: {
                          min: currentPrice.toString(),
                          max: currentPrice.toString(),
                        },
                      }
                    : prices
                }
                onDragEnd={(x) => {
                  setChartPrices([x.buy.min, x.buy.max])
                }}
                isLimit={{ buy: false, sell: false }}
                type={'overlapping'}
                overlappingSpread={'0'}
              />
            )}
          </D3ChartWrapper>
        ) : (
          <Chart token0={token0} token1={token1}></Chart>
        )}
      </div>
    </div>
  )
}

export default InteractiveChart
