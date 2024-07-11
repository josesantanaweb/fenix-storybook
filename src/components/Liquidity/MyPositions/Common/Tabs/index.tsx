'use client'

import { Button } from '@/src/components/UI'

interface TabsProps {
  tabActive: string
  setTabActive: (tabActive: string) => void
}

const Tabs = ({ tabActive, setTabActive }: TabsProps) => {

  const handlerIncrease = () => setTabActive("increase")
  const handlerRemove = () => setTabActive("remove")

  return (
    <div className="flex items-center gap-3 mb-5 bg-shark-400 bg-opacity-40 p-3 rounded-lg">
      <Button className="w-full mx-auto !py-3" variant={tabActive === "increase" ? "primary": "secondary"} onClick={handlerIncrease}>
        <span>Increase Liquidity</span>
      </Button>
      <Button className="w-full mx-auto !py-3" variant={tabActive === "remove" ? "primary": "secondary"} onClick={handlerRemove}>
        <span>Remove Liquidity</span>
      </Button>
    </div>
  )
}

export default Tabs
