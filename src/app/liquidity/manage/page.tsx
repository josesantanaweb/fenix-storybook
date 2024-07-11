import ManageLiquidity from '@/src/components/Liquidity/Manage'
import LiquidityLayout from '@/src/components/Liquidity/Common/Layout'
export const metadata = {
  title: 'Manage Liquidity | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Manage Liquidity',
}
const ManagePage = () => {
  return (
    <LiquidityLayout>
      <ManageLiquidity />
    </LiquidityLayout>
  )
}

export default ManagePage
