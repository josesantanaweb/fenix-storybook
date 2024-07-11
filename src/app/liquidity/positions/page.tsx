import Positions from '@/src/components/Liquidity/Positions'
import LiquidityLayout from '@/src/components/Liquidity/Common/Layout'
export const metadata = {
  title: 'Positions | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Positions',
}
const PositionsPage = () => {
  return (
    <LiquidityLayout>
      <Positions />
    </LiquidityLayout>
  )
}

export default PositionsPage
