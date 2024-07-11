import Navigation from '@/src/components/Liquidity/Common/Navigation'


interface LiquidityLayoutProps {
  children: React.ReactNode
}

const LiquidityLayout = ({ children }: LiquidityLayoutProps) => {
  return (
    <section className="container py-5">
      <Navigation />
      {children}
    </section>
  )
}

export default LiquidityLayout
