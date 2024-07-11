import MyPositions from '@/src/components/Liquidity/MyPositions'
import LiquidityLayout from '@/src/components/Liquidity/Common/Layout'
export const metadata = {
  title: 'My Positions | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'My Positions',
}
const MyPositionsPage = () => {
  return (
    <LiquidityLayout>
      <MyPositions />
    </LiquidityLayout>
  )
}

export default MyPositionsPage
