import TradeLayout from '@/src/components/Trade/Common/Layout'
import Blast3XBanner from '@/src/components/Common/Banners/Blast3XBanner'
import Bridge from '@/src/components/Trade/Bridge'


export const metadata = {
  title: 'Bridge | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Perform cross-chain transfers directly on Fenix to import your tokens onto the Blast network.',
}

export default function Page() {
  return (
    <TradeLayout>
      <Blast3XBanner />
      <Bridge/>
    </TradeLayout>
  )
}
