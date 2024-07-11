'use client'
import StrategiesDCA from '@/src/components/Dashboard/StrategiesDCA'
import MyNest from '@/src/components/Dashboard/MyNest'
import LiquidityPositions from '@/src/components/Dashboard/LiquidityPositions'
import MyLocks from '@/src/components/Dashboard/MyLocks'
import VotingRewards from '@/src/components/Dashboard/VotingRewards'
import MyStrategies from '@/src/components/Dashboard/MyStrategies'
import MyPositions from './MyPositions'
import { useState, useEffect } from 'react'
import LoadingData from '../Modals/LoadingData'
import { useAccount } from 'wagmi'
import Blast3XBanner from '../Common/Banners/Blast3XBanner'


const Dashboard = () => {
  const [ loadingMyPositions, setLoadingMyPositions ] = useState<boolean>(false)
  const [ loadingLiquidityPositions, setLoadingLiquidityPositions ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(false)
  const { address } = useAccount()

  useEffect(() => {
    if((!loadingLiquidityPositions && !loadingMyPositions)) {
      setLoading(false)
    } else if ( address === undefined) {
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [loadingMyPositions, loadingLiquidityPositions])
  return (
    <div className="py-5">
      <Blast3XBanner/>
      {/* <MyLocks />
      <MyNest />
      <VotingRewards /> */}
      <MyPositions setLoading={setLoadingMyPositions} loading={loadingMyPositions} />
      <LiquidityPositions setLoading={setLoadingLiquidityPositions} loading={loadingLiquidityPositions} />
      {/* <StrategiesDCA /> */}
      {/* <MyStrategies /> */}
      <br></br>
      <LoadingData openModal={loading} setOpenModal={setLoading} />
    </div>
  )
}

export default Dashboard
