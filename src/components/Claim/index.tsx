'use client'

import ClaimBox from './ClaimBox'
import { useEffect, useState } from 'react'
import Search from '@/src/components/Common/Search'
import HeaderRowReward from './Tables/HeaderRowReward'
import { useAccount } from 'wagmi'
import { multicall, createConfig, http } from '@wagmi/core'
import rewardAbi from './ABI/abi'
import { blastSepolia } from 'viem/chains'
import { wagmiConfig } from '@/src/app/layout'
import { Address } from 'viem'

const Claim = () => {
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState<string>('')
  const [rewardData, setRewardData] = useState<any>([])
  const [claimedData, setClaimedData] = useState<any>([])

  const { address } = useAccount()

  const getRewardsData = async (address: Address) => {
    try {
      setLoading(true)
      const res = await multicall(wagmiConfig, {
        contracts: [
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'chrClaimAmount',
            args: [address],
          },
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'spchrClaimAmount',
            args: [address],
          },
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'elchrClaimAmount',
            args: [address],
          },
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'vechrClaimAmount',
            args: [address],
          },
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'chrnftClaimAmount',
            args: [address],
          },
        ],
      })
      if (res.length > 0) {
        setRewardData(res)
        setLoading(false)
      } else {
        setRewardData([])
        setLoading(false)
      }
    } catch (error) {
      setRewardData([])
      setLoading(false)
    }
  }

  const getClaimedData = async (address: Address) => {
    try {
      setLoading(true)
      const res = await multicall(wagmiConfig, {
        contracts: [
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'chrClaimedAmount',
            args: [address],
          },
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'spchrClaimedAmount',
            args: [address],
          },
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'elchrClaimedAmount',
            args: [address],
          },
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'vechrClaimedAmount',
            args: [address],
          },
          {
            abi: rewardAbi,
            address: '0xfda5afc7Dd1BD194509E62f463547C3BCd93c09b',
            functionName: 'chrnftClaimedAmount',
            args: [address],
          },
        ],
      })
      if (res.length > 0) {
        setClaimedData(res)
        setLoading(false)
      } else {
        setClaimedData([])
        setLoading(false)
      }
    } catch (error) {
      setClaimedData([])
      setLoading(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    if (address) {
      getRewardsData(address)
      getClaimedData(address)
    }
  }, [address])

  return (
    <section className="relative">
      <div className="flex flex-col items-center gap-5 py-5 xl:flex-row">
        <div className="w-full flex justify-center">
          <ClaimBox />
        </div>
      </div>
      <h1 className="text-xl font-medium text-white">Claim overview</h1>
      <div className="flex flex-col items-center justify-between gap-5 mt-5 mb-10 xl:flex xl:flex-row">
        {/* <div className="w-full ">
          <Search placeholder="Search by Name" searchValue={searchValue} setSearchValue={setSearchValue} />
        </div> */}
      </div>
      <div className="flex flex-col justify-center items-center gap-2 mx-2 mt-2 mb-4">
        <div className="w-full">
          {/* <h1 className="text-xl font-medium text-white mb-6">Claim</h1> */}
          <div className="p-2">
            <HeaderRowReward
              filterData={rewardData}
              claim={claimedData}
              loading={loading}
              activePagination={false}
              search={searchValue}
            />
          </div>
        </div>
      </div>
    </section>
    // <section className="px-3 py-6 md:py-0 md:px-0">
    //   <div className="flex flex-col items-center gap-6 mb-10 xl:flex-row">
    //     <MainBox>
    //       <Migration />
    //     </MainBox>
    //     <Steps steps={STEPS} />
    //   </div>
    //   <Overview />
    // </section>
  )
}

export default Claim
