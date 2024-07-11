import Deposit from '@/src/components/Liquidity/Deposit'
import LiquidityLayout from '@/src/components/Liquidity/Common/Layout'
export const metadata = {
  title: 'Deposit Liquidity | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Deposit Liquidity',
}
const DepositPage = () => {
  return (
    <LiquidityLayout>
      <Deposit />
    </LiquidityLayout>
  )
}

export default DepositPage
