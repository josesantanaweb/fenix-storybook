import LimitRange from '@/src/components/Trade/LimitRange'
import TradeLayout from '@/src/components/Trade/Common/Layout'
export const metadata = {
  title: 'Limit Range| Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Limit Range',
}
const LimitRangePage = () => {
  return (
    <TradeLayout>
      <LimitRange />
    </TradeLayout>
  )
}

export default LimitRangePage
