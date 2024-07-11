import Recurring from '@/src/components/Trade/Recurring'
import TradeLayout from '@/src/components/Trade/Common/Layout'
export const metadata = {
  title: 'Recurring | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Recurring',
}
const RecurringPage = () => {
  return (
    <TradeLayout>
      <Recurring />
    </TradeLayout>
  )
}

export default RecurringPage
