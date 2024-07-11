import Swap from '@/src/components/Trade/Swap'
import TradeLayout from '@/src/components/Trade/Common/Layout'
export const metadata = {
  title: 'Swap | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Fenix provides deepest liquidity to ensure that you have the best prices for any token swap on Blast.',
}

const TradePage = () => {
  return (
    <TradeLayout>
      <Swap />
    </TradeLayout>
  )
}

export default TradePage
