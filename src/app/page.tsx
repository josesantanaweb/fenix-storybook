/* eslint-disable max-len */
import Landing from '@/src/components/Landing'
import Main from '@/src/components/Landing/Main'

export const metadata = {
  title: 'Fenix Finance',
  description:
    'Fenix is a decentralized exchange (DEX) that provides deep spot and perpetuals trading markets on Blast. Deposit liquidity to earn FNX emissions. Stake veFNX to receive 100% of platform rewards.',
}
const HomePage = () => {
  return (
    <main>
      <div className="pt-10 mx-auto">
        <Main/>
        <Landing />
      </div>
    </main>
  )
}

export default HomePage
