
import Navigation from '@/src/components/Trade/Common/Navigation'

interface TradeLayoutProps {
  children: React.ReactNode
}

const TradeLayout = ({ children }: TradeLayoutProps) => {
  return (
    <section className="container py-5">
      <Navigation />
      {children}
    </section>
  )
}

export default TradeLayout
