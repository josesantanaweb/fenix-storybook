'use client'
import { Button } from '@/src/components/UI'
import OrderItem from '@/src/components/Trade/DCA/Orders/OrderItem'

const Orders = () => {

  return (
    <section className="w-full bg-shark-400 bg-opacity-40 p-5 h-[700px] rounded-2xl">
      <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:gap-0 mb-10">
        <div className="flex items-center justify-start w-full gap-2 px-3 py-2 md:w-2/3 filter-orders-box md:gap-5 xl:w-full">
          <Button className="h-[40px] md:h-auto w-full xl-w-auto">Active DCAs</Button>
          <Button variant="default" className="h-[40px] md:h-auto w-full xl-w-auto">
            Past DCAs
          </Button>
        </div>
        <div className="flex items-center justify-end gap-4 md:w-1/3 text-shark-100 xl:w-full">
          <span className="icon-refresh cursor-pointer"></span>
          <p className="text-xs">Refresh Data</p>
        </div>
      </div>

      <OrderItem />

      {/* Empty orders */}
      {/* <div className="flex items-center justify-center h-full py-20 text-shark-100">You have not active orders</div> */}
    </section>
  )
}

export default Orders
