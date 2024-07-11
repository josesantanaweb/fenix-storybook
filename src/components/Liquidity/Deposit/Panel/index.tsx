/* eslint-disable max-len */
'use client'
import { useEffect, useState } from 'react'
import { Address, isAddress } from 'viem'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'

// hooks
import { useGammaCreatePosition } from '@/src/library/hooks/web3/useGamma'
import { useSetToken0, useSetToken1, useToken0, useToken1 } from '@/src/state/liquidity/hooks'
import { useSetChart, useShowChart } from '@/src/state/user/hooks'

// store
import { fetchv2PairId } from '@/src/state/liquidity/reducer'
import { useAppSelector } from '@/src/state'

// helpers
import { fetchTokens } from '@/src/library/common/getAvailableTokens'

// components
import { Button, Switch } from '@/src/components/UI'
import Classic from '@/src/components/Liquidity/Deposit/Panel/Classic'
import Automatic from '@/src/components/Liquidity/Deposit/Panel/Concentrated/Automatic'
import Manual from '@/src/components/Liquidity/Deposit/Panel/Concentrated/Manual'

// models
import { IToken } from '@/src/library/types'
import { V2PairId } from '@/src/state/liquidity/types'
import LoadingData from '@/src/components/Modals/LoadingData'

const DepositTypeValues = {
  VOLATILE: 'VOLATILE',
  STABLE: 'STABLE',
  CONCENTRATED_AUTOMATIC: 'CONCENTRATED_AUTOMATIC',
  CONCENTRATED_MANUAL: 'CONCENTRATED_MANUAL',
}

type DepositType = (typeof DepositTypeValues)[keyof typeof DepositTypeValues]

const Panel = ({
  disableChart,
  chartPrices,
  setChartValues,
}: {
  disableChart: boolean
  chartPrices: string[]
  setChartValues: (arg0: any[]) => void
}) => {
  // common
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState<boolean>(true)

  // (tokens)
  const token0 = useToken0()
  const token1 = useToken1()
  const setToken0 = useSetToken0()
  const setToken1 = useSetToken1()

  // (chart)
  const showChart = useShowChart()
  const setChart = useSetChart()

  // (other)
  const { chainId } = useAccount()
  const { createPosition: createGammaPosition } = useGammaCreatePosition()

  // states
  // const [disableChart, setDisableChart] = useState(false)
  const [depositType, setDepositType] = useState<DepositType>('VOLATILE')
  const [defaultPairs, setDefaultPairs] = useState<Address[]>([])
  const [defaultPairsTokens, setDefaultPairsTokens] = useState<IToken[]>([])
  // const [pair, setPair] = useState<V2PairId>()
  const [isChartVisible, setIsChartVisible] = useState(showChart)
  const [provider, setProvider] = useState<number>(1)

  // computed
  const activeSwitch = depositType === 'CONCENTRATED_AUTOMATIC' || depositType === 'CONCENTRATED_MANUAL'

  // effects
  useEffect(() => {
    const searchParamToken0 = searchParams.get('token0')
    const searchParamToken1 = searchParams.get('token1')
    const typeSearch = searchParams.get('type')
    if (searchParamToken0 && isAddress(searchParamToken0)) setToken0(searchParamToken0 as Address)
    if (searchParamToken1 && isAddress(searchParamToken1)) setToken1(searchParamToken1 as Address)
    if (typeSearch && Object.values(DepositTypeValues).includes(typeSearch as DepositType)) {
      setDepositType(typeSearch as DepositType)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('type', depositType)
    params.set('token0', token0)
    params.set('token1', token1)
    router.push(pathname + '?' + params.toString(), { scroll: false })
  }, [token0, token1, depositType, searchParams, router, pathname])

  useEffect(() => {
    setLoading(true)
    const searchParamToken0 = searchParams.get('token0')
    const searchParamToken1 = searchParams.get('token1')
    const typeSearch = searchParams.get('type')
    const clmProviderParam = searchParams.get('provider')
    //

    if (clmProviderParam == '2') {
      setProvider(2)
    } else {
      setProvider(1)
    }
    if (typeSearch == 'CONCENTRATED_AUTOMATIC') setDepositType('CONCENTRATED_AUTOMATIC')
    if (typeSearch == 'CONCENTRATED_MANUAL') setDepositType('CONCENTRATED_MANUAL')
    if (typeSearch == 'STABLE') setDepositType('STABLE')
    if (typeSearch == 'VOLATILE') setDepositType('VOLATILE')

    if (!isAddress(searchParamToken0!) || !isAddress(searchParamToken1!)) return
    setDefaultPairs([searchParamToken0, searchParamToken1])
  }, [])

  useEffect(() => {
    if (disableChart) {
      setChart(false)
      setIsChartVisible(false)
    }
  }, [disableChart])

  useEffect(() => {
    const getList = async () => {
      try {
        if (chainId) {
          const responseData = await fetchTokens(chainId)
          const parsedData = responseData.map((item: any) => {
            return {
              id: 0,
              name: item.basetoken.name,
              symbol: item.basetoken.symbol,
              address: item.basetoken.address,
              decimals: item.decimals,
              img: item.logourl,
              isCommon: item.common,
              price: parseFloat(item.priceUSD),
            }
          })

          const newDefaultPairsTokens: [IToken, IToken] = [{} as IToken, {} as IToken]
          if (defaultPairs.length > 0) {
            parsedData.map((item: any) => {
              if (item.address.toLowerCase() == defaultPairs[0]?.toLowerCase()) newDefaultPairsTokens[0] = item
              if (item.address.toLowerCase() == defaultPairs[1]?.toLowerCase()) newDefaultPairsTokens[1] = item
            })
            setDefaultPairs([])
          }
          setDefaultPairsTokens(newDefaultPairsTokens)
        }
      } catch (error) {}
    }
    defaultPairs.length > 0 ? getList() : {}
  }, [defaultPairs, chainId])

  // helpers
  function handleSwitch(): void {
    setChart(!isChartVisible)
    setIsChartVisible((prevState) => !prevState)
  }

  function handlerSwitch(): void {
    setDepositType((prevType) => {
      const newType =
        prevType === 'CONCENTRATED_MANUAL' || prevType === 'CONCENTRATED_AUTOMATIC' ? 'VOLATILE' : 'CONCENTRATED_MANUAL'
      const params = new URLSearchParams(searchParams.toString())
      params.set('type', newType)
      params.set('token0', token0)
      params.set('token1', token1)
      router.push(`${pathname}?${params.toString()}`, undefined)
      return newType
    })
  }

  // async helpers
  async function createPosition(): Promise<void> {
    if (depositType === 'CONCENTRATED_AUTOMATIC') {
      createGammaPosition()
    }
  }

  return (
    <section className={`box-panel-trade ${showChart ? 'max-xl:rounded-b-none' : ''}`}>
      <div className="w-full flex flex-col xl:flex-row justify-between gap-12 items-center relative z-10">
        <div className="w-full relative">
          <div className="flex items-center justify-between mb-[25px] font-semibold">
            <h1 className="text-lg md:text-xl text-white font-medium">New Position</h1>
            <div className="flex items-center gap-[13px]">
              <span
                onClick={handleSwitch}
                className={`text-2xl ${disableChart ? 'cursor-default bg-opacity-40' : 'cursor-pointer'} ${!showChart ? `transition-all bg-shark-100 ${!disableChart && 'lg:hover:bg-gradient-to-r lg:hover:from-outrageous-orange-500 lg:hover:to-festival-500'} text-transparent bg-clip-text` : 'text-gradient'} icon-chart-fenix`}
              ></span>
              <div className="flex items-center w-[140px] gap-[9px] h-10">
                <Switch active={activeSwitch} setActive={handlerSwitch} />
                <span className="text-shark-100 text-xs leading-normal">
                  {activeSwitch ? 'Concentrated' : 'Classic'}
                </span>
              </div>
              {/* <div className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] p-2.5 border border-shark-200 bg-shark-300 bg-opacity-40 rounded-[10px] flex items-center justify-center">
                <span className="icon-cog text-white"></span>
  </div> */}
            </div>
          </div>

          <div className="bg-shark-400 bg-opacity-40 p-[13px] md:py-[11px] md:px-[19px] flex gap-1.5 md:gap-2.5 border border-shark-950 rounded-[10px] mb-2.5">
            {depositType === 'CONCENTRATED_AUTOMATIC' || depositType === 'CONCENTRATED_MANUAL' ? (
              <>
                <Button
                  className="w-full h-[38px] mx-auto !text-xs"
                  variant={depositType === 'CONCENTRATED_AUTOMATIC' ? 'primary' : 'secondary'}
                  onClick={() => setDepositType('CONCENTRATED_AUTOMATIC')}
                >
                  Automatic
                </Button>
                <Button
                  className="w-full h-[38px] mx-auto !text-xs"
                  variant={depositType === 'CONCENTRATED_MANUAL' ? 'primary' : 'secondary'}
                  onClick={() => setDepositType('CONCENTRATED_MANUAL')}
                >
                  Manual
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="w-full h-[38px] mx-auto !text-xs"
                  variant={depositType === 'STABLE' ? 'primary' : 'secondary'}
                  onClick={() => setDepositType('STABLE')}
                >
                  Stable
                </Button>
                <Button
                  className="w-full h-[38px] mx-auto !text-xs"
                  variant={depositType === 'VOLATILE' ? 'primary' : 'secondary'}
                  onClick={() => setDepositType('VOLATILE')}
                >
                  Volatile
                </Button>
              </>
            )}
          </div>

          {(depositType === 'VOLATILE' || depositType === 'STABLE') && (
            <Classic depositType={depositType} defaultPairs={defaultPairsTokens} setLoading={setLoading} />
          )}

          {depositType === 'CONCENTRATED_AUTOMATIC' && <Automatic providerPick={provider} />}
          {depositType === 'CONCENTRATED_MANUAL' && (
            <Manual
              defaultPairs={defaultPairsTokens}
              setLoading={setLoading}
              chartPrices={chartPrices}
              setChartValues={(x: any[]) => {
                setChartValues(x)
              }}
            />
          )}
          {/* {depositType === 'CONCENTRATED_MANUAL' && (
            <Button className="w-full mx-auto !text-xs !h-[49px]" variant="tertiary" onClick={createPosition}>
              Create Position
            </Button>
          )} */}

          {/* <Button className="w-full mx-auto !text-xs !h-[49px]" variant="tertiary" onClick={createPosition}>
            Create Position
          </Button> */}
        </div>
      </div>
      <LoadingData openModal={loading} setOpenModal={setLoading} />
    </section>
  )
}

export default Panel
