import { useState } from 'react'
import Button from '../Button'

interface PaginationProps {
  count: number
  itemsPerPage: number
  setItemPerPage: (item: number) => void
  numberPages: number
  className: string
  activePage: number
  setActivePage: (page: number) => void
}
const PaginationMobile = ({
  count,
  className,
  itemsPerPage,
  setItemPerPage,
  numberPages,
  setActivePage,
  activePage,
}: PaginationProps) => {
  const [isOpenItemsPerPage, setIsOpenItemsPerPage] = useState(false)
  const hadlerPrev = () => setActivePage(activePage > 1 ? activePage - 1 : activePage)
  const hadlerNext = () => setActivePage(activePage < numberPages ? activePage + 1 : activePage)

  const hadlerPage = (index: number) => setActivePage(index + 1)

  return (
    <div className="flex items-center justify-between text-xs w-full ">
      <div className="flex items-center gap-2">
        <div className="flex gap-2 pagination-mobile-box h-12 bg-opacity-40 w-[168px]  text-white items-center justify-center">
          <div>
            <p>{itemsPerPage} Row</p>
          </div>
          <div className="h-[20px] w-[2px] bg-orange-600"></div>
          <div>
            <p>
              {activePage}-{itemsPerPage} of {count}
            </p>
          </div>
        </div>
        <div
          className="flex items-center justify-center cursor-default flex-shrink-0 w-12 h-12 px-4 transition-colors
        border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400 relative"
          onClick={() => setIsOpenItemsPerPage(!isOpenItemsPerPage)}
        >
          <span className="text-lg icon-cog text-white "></span>
          {isOpenItemsPerPage && (
            <div
              className="w-[68px] p-2 flex flex-col gap-1 rounded-[10px] bg-shark-400 bg-opacity-40 absolute left-full bottom-0 translate-x-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button onClick={() => setItemPerPage(5)} variant="tertiary" className="!py-1 !h-[33px] !text-xs">
                5
              </Button>
              <Button onClick={() => setItemPerPage(10)} variant="tertiary" className="!py-1 !h-[33px] !text-xs">
                10
              </Button>
              <Button onClick={() => setItemPerPage(20)} variant="tertiary" className="!py-1 !h-[33px] !text-xs">
                20
              </Button>
              <Button onClick={() => setItemPerPage(50)} variant="tertiary" className="!py-1 !h-[33px] !text-xs">
                50
              </Button>
              <Button onClick={() => setItemPerPage(100)} variant="tertiary" className="!py-1 !h-[33px] !text-xs">
                100
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 p-2">
        {numberPages > 1 && activePage > 1 && (
          <div className="flex" onClick={hadlerPrev}>
            <span className="icon-arrow-right rotate-180 flex text-lg items-center text-white"></span>
          </div>
        )}
        {numberPages > 1 && activePage !== numberPages && (
          <div onClick={hadlerNext}>
            <span className="icon-arrow-right flex items-center text-lg text-white"></span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaginationMobile
