
import Liquidity from '@/src/components/Liquidity'

export const metadata = {
  title: 'Liquidity | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Fenix provides the most advanced liquidity platform on Blast with automated position management. Deposit liquidity and sit back to earn rewards.',
}
const LiquidityPage = () => {
  return (
    <main>
      <div className="container">
        <Liquidity />
      </div>
    </main>
  )
}

export default LiquidityPage
