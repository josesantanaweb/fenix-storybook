//@ts-nocheck
import { useState } from 'react'

import PairSelector from '@/src/components/Liquidity/Common/PairSelector'
import CLMProviderSelector from '@/src/components/Liquidity/Deposit/Panel/Concentrated/Automatic/CLMProviderSelector'
import DepositAmountsICHI from '@/src/components/Liquidity/Deposit/Panel/Concentrated/Automatic/DepositAmountsICHI'
import DepositAmountsGAMMA from '@/src/components/Liquidity/Deposit/Panel/Concentrated/Automatic/DepositAmountsGAMMA'

const providers = [
  {
    label: 'ICHI',
    value: '1',
    apr: 5.08,
    src: 'https://ichi.org/',
    logo: {
      src: '/static/images/providers/ichi.svg',
      width: 63.75,
      height: 21,
    },
  },
  {
    label: 'GAMMA',
    value: '2',
    apr: 3.08,
    src: 'https://www.gamma.xyz/',
    logo: {
      src: '/static/images/providers/gamma.svg',
      width: 95.158,
      height: 16,
    },
  },
]

const Automatic = () => {
  const [firstToken, setFirstToken] = useState({ name: 'Fenix', symbol: 'FNX' })
  const [secondToken, setSecondToken] = useState({ name: 'ethereum', symbol: 'ETH' })
  const [currentProvider, setCurrentProvider] = useState<string>('1')

  return (
    <>
      <PairSelector
        firstToken={firstToken}
        secondToken={secondToken}
        setFirstToken={(token) => setFirstToken(token)}
        setSecondToken={(token) => setSecondToken(token)}
      />

      <CLMProviderSelector
        providers={providers}
        currentProvider={currentProvider}
        setCurrentProvider={setCurrentProvider}
      />

      {currentProvider === '1' && <DepositAmountsICHI token={firstToken} />}
      {currentProvider === '2' && <DepositAmountsGAMMA firstToken={firstToken} secondToken={secondToken} />}
    </>
  )
}

export default Automatic
