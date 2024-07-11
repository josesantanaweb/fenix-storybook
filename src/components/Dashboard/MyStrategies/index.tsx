'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/src/components/UI'
import Strategy from '@/src/components/Dashboard/MyStrategies/Strategy'
import StrategyMobile from './StrategyMobile'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperCore } from 'swiper'
import 'swiper/css'
import OPTIONS_STRATEGIES from './data'
import { useAccount } from 'wagmi'
import { fetchNativePrice, fetchV3Positions } from '@/src/state/liquidity/reducer'
import { Address } from 'viem'
import { positions } from '@/src/components/Dashboard/MyStrategies/Strategy'
import { useIchiPositions, useIchiVaultsDataMap } from '@/src/library/hooks/web3/useIchi'
import { getPositionDataByPoolAddresses } from '@/src/library/hooks/liquidity/useCL'
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import Spinner from '../../Common/Spinner'
import { useDispatch } from 'react-redux'
import { setApr } from '@/src/state/apr/reducer'
import TokenListItem from '@/src/library/types/token-list-item'
import { Token } from '@/src/library/structures/common/TokenData'

const defaultVaultInfo = {
  id: '',
  tokenA: '',
  tokenB: '',
  allowTokenA: false,
  allowTokenB: false,
  apr: [],
}

const MyStrategies = () => {
  const dispatch = useDispatch()
  const slidesPerView = 3
  const swiperRef = useRef<SwiperCore | null>(null)
  const [modalSelected, setModalSelected] = useState('delete')
  const [openModal, setOpenModal] = useState(false)
  const [position, setposition] = useState<any[]>([])
  const [nonZeroPosition, setNonZeroposition] = useState<any[]>([])
  const [positionAmounts, setpositionAmounts] = useState<any>([])

  const [tokens, setTokens] = useState<TokenListItem[]>([])

  const [loadingIchi, setLoadingIchi] = useState(false)
  const [loadingGamma, setLoadingGamma] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const { chainId, address } = useAccount()
  const { ichipositions, ichiLoading } = useIchiPositions()
  const vaultsMap = useIchiVaultsDataMap(
    nonZeroPosition.filter(({ liquidity }) => liquidity === 'ichi').map(({ id }) => id)
  )

  const tokensprice = async () => {
    if (chainId) setTokens(await fetchTokens(chainId))
  }

  useEffect(() => {
    tokensprice()
  }, [chainId])

  const slideToLeft = () => {
    if (swiperRef.current && progress > 0) {
      swiperRef.current.slidePrev()
      setProgress(swiperRef?.current?.progress)
    }
  }
  const slideToRight = () => {
    if (swiperRef.current && progress < 1) {
      swiperRef.current.slideNext()
      setProgress(swiperRef?.current?.progress)
    }
  }

  const [allGamaData, setAllGamaData] = useState<any>()
  const [userGamaData, setUserGamaData] = useState<any>()

  const getAllGammaData = () => {
    fetch(`https://wire2.gamma.xyz/fenix/blast/hypervisors/allData`)
      .then((res) => res.json())
      .then((data) => {
        const isEmpty = Object.keys(data).length === 0
        if (!isEmpty) {
          console.log(data, 'setAllGamaData')
          setAllGamaData(data)
        } else setAllGamaData(null)
      })
      .catch((err) => console.log(err))
  }
  const getGammaAddressData = () => {
    fetch(`https://wire2.gamma.xyz/fenix/blast/user/${address?.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        const isEmpty = Object.keys(data).length === 0
        if (!isEmpty) {
          setUserGamaData(data)
        } else setUserGamaData(null)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getAllGammaData()
  }, [])

  useEffect(() => {
    if (ichipositions.length > 0) {
      setposition((prev) => [...prev, ...ichipositions])
    }
  }, [ichipositions])

  useEffect(() => {
    setposition([])
    getGammaAddressData()
  }, [address])

  useEffect(() => {
    if (tokens.length < 1) return
    setNonZeroposition(
      position.filter((i) => {
        const tvl =
          Number(i?.depositedToken0) *
            Number(tokens.find((e) => e.tokenAddress.toLowerCase() === i?.token0?.id.toLowerCase())?.priceUSD) +
          Number(i?.depositedToken1) *
            Number(tokens.find((e) => e.tokenAddress.toLowerCase() === i?.token1?.id.toLowerCase())?.priceUSD)

        return tvl > 0.1
      })
    )
  }, [position, tokens])
  useEffect(() => {
    setLoadingGamma(true)
    if (allGamaData != null && userGamaData != null && address) {
      const newArr: any[] = []
      for (const item in allGamaData) {
        if (userGamaData[address.toLowerCase()]?.hasOwnProperty(item.toLowerCase())) {
          const nestedObj = userGamaData[address.toLowerCase()][item]
          const newObj = {
            liquidity: 'gamma',
            id: item,
            pool: { id: allGamaData[item].poolAddress },
            depositedToken0: nestedObj.balance0,
            depositedToken1: nestedObj.balance1,
            token0: { id: allGamaData[item].token0 },
            token1: { id: allGamaData[item].token1 },
            inRange: allGamaData[item].inRange,
            apr: allGamaData[item].returns.monthly.feeApr,
          }

          newArr.push(newObj)
        } else {
          console.log('hit no')
        }
      }

      if (newArr.length > 0) {
        setposition((prev) => [...prev, ...newArr])
      }
      setLoadingGamma(false)
    }
  }, [allGamaData, userGamaData, address])

  useEffect(() => {
    dispatch(setApr(position))
  }, [position, dispatch])

  // console.log(position)
  // console.log(tokens)
  return (
    <>
      {position.length > 0 ? (
        <div className="relative">
          <div className="mb-4 flex w-[100%] items-center justify-between">
            <h2 id="strategies" className="text-lg text-white">
              Automated Strategies
            </h2>
            <Button variant="tertiary" className="!lg:text-sm !py-3 !text-xs xl:me-5" href="/liquidity">
              <span className="icon-logout"></span>New strategy
            </Button>
          </div>
          <div className="dashboard-box mb-10 hidden xl:block">
            <Swiper
              spaceBetween={50}
              breakpoints={{
                1560: { slidesPerView: 3 },
                1480: { slidesPerView: 3 },
                1380: { slidesPerView: 2 },
                1200: { slidesPerView: 2 },
              }}
              slidesPerView={slidesPerView}
              navigation={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper
                swiper.on('slideChangeTransitionEnd', () => {
                  if (swiperRef.current) {
                    setProgress(swiper.progress)
                  }
                })
              }}
              allowTouchMove={false}
            >
              {Array.from({ length: nonZeroPosition.length }).map((_, index) => {
                return (
                  <>
                    <SwiperSlide key={index}>
                      <Strategy
                        row={nonZeroPosition[index]}
                        tokens={tokens}
                        ichiTokens={vaultsMap[nonZeroPosition[index].id] || defaultVaultInfo}
                        options={OPTIONS_STRATEGIES}
                        setModalSelected={setModalSelected}
                        setOpenModal={setOpenModal}
                      />
                    </SwiperSlide>
                  </>
                )
              })}
            </Swiper>
            {nonZeroPosition?.length >= 3 && (
              <div className="flex justify-center gap-2">
                <span
                  className={`icon-arrow-left ${progress <= 0 ? 'cursor-not-allowed text-shark-400' : 'cursor-pointer text-white'} text-2xl`}
                  onClick={slideToLeft}
                ></span>
                <span
                  className={`icon-arrow-right text-2xl ${progress >= 1 ? 'cursor-not-allowed text-shark-400' : 'cursor-pointer text-white'}`}
                  onClick={slideToRight}
                ></span>
              </div>
            )}
          </div>
          <div className="dashboard-box mb-10 block xl:hidden">
            <div className="">
              {Array.from({ length: nonZeroPosition.length }).map((_, index) => {
                return (
                  <>
                    <SwiperSlide key={index}>
                      <StrategyMobile
                        row={nonZeroPosition[index]}
                        tokens={tokens}
                        ichiTokens={vaultsMap[nonZeroPosition[index].id] || defaultVaultInfo}
                        options={OPTIONS_STRATEGIES}
                        setOpenModal={setOpenModal}
                        setModalSelected={setModalSelected}
                      />
                    </SwiperSlide>
                  </>
                )
              })}
            </div>
          </div>
          {/* {MODAL_LIST[modalSelected]} */}
        </div>
      ) : nonZeroPosition.length === 0 || address === undefined ? (
        <div className="mx-auto mt-10 flex w-full flex-col gap-3">
          <div className="flex items-center justify-between text-white">
            <p className="ms-2 flex gap-3 text-lg">Automated Strategies</p>
          </div>
          <div className="box-dashboard flex items-center gap-8 p-6">
            <p className="text-sm text-white">You have no strategies.</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-10 flex w-full flex-col gap-3">
          <div className="flex items-center justify-between text-white">
            <p className="ms-2 flex gap-3 text-lg">Automated Strategies</p>
          </div>
          <div className="box-dashboard flex items-center justify-center gap-8 p-6">
            <p className="flex items-center gap-3 text-sm text-white">
              <Spinner /> Loading
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default MyStrategies
