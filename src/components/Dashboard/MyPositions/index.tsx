import { useEffect, useState } from 'react'
import { Button, Switch } from '../../UI'
import PositionTable from './PositionTable'
import { useDispatch } from 'react-redux'
import { positions } from '../MyStrategies/Strategy'
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { useAccount } from 'wagmi'
import { fetchNativePrice, fetchV3Positions } from '@/src/state/liquidity/reducer'
import { getPositionDataByPoolAddresses, priceToSqrtPrice } from '@/src/library/hooks/liquidity/useCL'
import { setApr } from '@/src/state/apr/reducer'
import { useIchiPositions } from '@/src/library/hooks/web3/useIchi'
import { getPositionAPR } from '@/src/library/hooks/algebra/getPositionApr'
import { Address } from 'viem'
import Spinner from '../../Common/Spinner'
import PositionTableMobile from './PositionTableMobile'
import { useQuery } from '@tanstack/react-query'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { useRingsCampaigns } from '@/src/state/liquidity/hooks'
import CheckBox from '../../UI/CheckBox'

import { Pool } from '@cryptoalgebra/integral-sdk'
import { FALLBACK_CHAIN_ID } from '@/src/library/constants/chains'

import TokenListItem from '@/src/library/types/token-list-item'

// import useStore from '@/src/state/zustand'

const MyPositions = ({ loading, setLoading } : { loading: boolean, setLoading:(loading: boolean) => void }) => {
  const dispatch = useDispatch()
  const [position, setposition] = useState<positions[]>([])
  const [ichiPosition, setIchiPosition] = useState<any[]>([])
  const [allGamaData, setAllGamaData] = useState<any>()
  const [userGamaData, setUserGamaData] = useState<any>()
  const [positionAmounts, setpositionAmounts] = useState<any>([])
  const [tokens, setTokens] = useState<TokenListItem[]>([])
  // const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [activeSwitch, setActiveSwitch] = useState(false)
  const { chainId } = useAccount()
  const { ichipositions, ichiLoading } = useIchiPositions()
  const { address } = useAccount()
  const [loadingIchi, setLoadingIchi] = useState(false)
  const [loadingGamma, setLoadingGamma] = useState(false)

  // const isConnected = useStore((state) => state.isConnected)
  const { isConnected } = useActiveConnectionDetails()

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
    setIchiPosition([])
    getGammaAddressData()
  }, [address])

  useEffect(() => {
    if (ichipositions.length > 0) {
      setIchiPosition((prev) => [...prev, ...ichipositions])
    }
  }, [ichipositions])

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
          // console.log('hit no')
        }
      }

      if (newArr.length > 0) {
        setIchiPosition((prev) => [...prev, ...newArr])
      }
      setLoadingGamma(false)
    }
  }, [allGamaData, userGamaData, address])

  const tokensprice = async () => {
    if (chainId) setTokens(await fetchTokens(chainId))
  }
  useEffect(() => {
    tokensprice()
  }, [chainId])

  const fetchpositions = async (address: Address) => {
    const positions = await fetchV3Positions(address)
    console.log('here :>>');
    const nativePrice = await fetchNativePrice()
    const positionsPoolAddresses = await positions.map((position: positions) => {
      return {
        id: position.pool.id,
        liq: position.liquidity,
        lower: position.tickLower.tickIdx,
        higher: position.tickUpper.tickIdx,
      }
    })
    const amounts: any = await getPositionDataByPoolAddresses(positionsPoolAddresses)
    const aprs = await Promise.all(
      positions.map((position: positions, index: number) => {
        return getPositionAPR(position.pool.liquidity, position, position.pool, position.pool.poolDayData, nativePrice)
      })
    )
    // const fees = await Promise.all(
    //   positions.map(async (position: positions, index: number) => {
    //     const pool: Pool = {
    //       ...position.pool,
    //       sqrtRatioX96: '',
    //       tickCurrent: '',
    //       tickDataProvider: '',
    //       _tickSpacing: '',
    //       token0: {
    //         ...position.pool.token0,
    //         address: position.pool.token0.id, // Add address here
    //         chainId: FALLBACK_CHAIN_ID, // Add chainId here
    //       },
    //       token1: {
    //         ...position.pool.token1,
    //         address: position.pool.token1.id, // Add address here
    //         chainId: FALLBACK_CHAIN_ID, // Add chainId here
    //       },
    //       // Add the missing properties here
    //     } as unknown as Pool
    //     return getPositionFees(pool, Number(position.id), position)
    //   })
    //)
    const final = positions.map((position: positions, index: number) => {
      //
      return {
        ...position,
        depositedToken0: Number(amounts[index][0]) / 10 ** Number(position.token0.decimals), // Assigning amount0 to depositedToken0
        depositedToken1: Number(amounts[index][1]) / 10 ** Number(position.token1.decimals), // Assigning amount1 to depositedToken1
        apr: isNaN(aprs[index]) ? '0.00%' : aprs[index].toFixed(2) + '%',
        // fees: fees[index],
      }
    })
    console.log('setpositionfinal', final)
    setposition([...final])
    setpositionAmounts(amounts)
    setLoading(false)
  }
  useEffect(() => {
    if (address) fetchpositions(address)
    setLoading(true)
  }, [address])

  useEffect(() => {
    dispatch(setApr(position))
  }, [position, dispatch])

  const { data: ringsCampaign, loading: isLoadingRingsCampaign } = useRingsCampaigns()

  const newPositions = [...position, ...ichiPosition]
  return (
    <>
      {newPositions.length !== 0 && loading === false && isLoadingRingsCampaign === false && address ? (
        <div className="mb-10 mt-5 flex flex-col ">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-lg">Concentrated Positions</h1>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-white text-lg font-normal">Show Dust Positions</p>
              <CheckBox
                checked={activeSwitch}
                onClick={() => {
                  setActiveSwitch(!activeSwitch)
                }}
              />
              <Button
                variant="tertiary"
                className="!py-3 xl:me-5 !text-xs !lg:text-sm flex items-center gap-1"
                href="/liquidity"
              >
                <span className="icon-logout" />
                Create position
              </Button>
            </div>
          </div>
          <div className="dashboard-box flex flex-col">
            <PositionTable data={newPositions} tokens={tokens} ringsCampaign={ringsCampaign} showDust={activeSwitch} />
            <PositionTableMobile
              data={newPositions}
              tokens={tokens}
              ringsCampaign={ringsCampaign}
              showDust={activeSwitch}
            />
          </div>
        </div>
      ) : (position.length === 0 && loading === false && isLoadingRingsCampaign === false) || address === undefined ? (
        <div className="flex flex-col gap-3 w-full mb-10 mt-10 mx-auto">
          <div className="text-white flex justify-between items-center">
            <p className="flex gap-3 text-lg">Your Liquidity Positions</p>
            {/* <div className=" flex items-center gap-3">
              <Switch active={activeSwitch} setActive={handlerSwitch}/>
              <Button
                variant="tertiary"
                className={`!py-3 xl:me-5 !text-xs  flex items-center gap-1 !lg:text-sm ${isConnected === true ? '!block' : '!hidden'}`}
                href="/liquidity"
              >
                <span className="icon-logout" />
                Create position
              </Button>
            </div> */}
          </div>
          {/* <div className="box-dashboard p-6 flex gap-8 items-center ">
            <p className="text-white text-sm">You have no positions.</p>
          </div> */}
        </div>
      ) : (
        <div className="flex flex-col  gap-3 w-full mb-10 mt-10 mx-auto items-center">
          <div className="text-white flex justify-start w-full max-w-[1127px]">
            <p className="flex justify-start text-lg ms-2 w-full">Concentrated Liquidity Positions</p>
          </div>
          <div className="box-referrals-short p-6 flex gap-8 justify-center ">
            <div className="relative z-50">
              <p className="text-white text-sm flex items-center gap-3">
                <Spinner /> Loading
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MyPositions
