/* eslint-disable max-len */
'use client'

import { use, useState, useEffect } from 'react'
import cn from '@/src/library/utils/cn'
import Button from '../Button'

interface PaginationProps {
  numberPages: number
  className: string
  activePage: number
  setActivePage: (page: number) => void
  itemsPerPage: number
  setItemPerPage: (item: number) => void
}

const Pagination = ({
  className,
  numberPages,
  setActivePage,
  activePage,
  itemsPerPage,
  setItemPerPage,
}: PaginationProps) => {
  const [isOpenItemsPerPage, setIsOpenItemsPerPage] = useState(false)
  const [paginationArr, setPaginationArr] = useState<number[]>([])
  const mergeClassName = cn('text-white text-xs w-full md:max-w-full box-large hidden lg:block', className)

  const pageClassName = (index: number) => {
    return cn(
      'flex items-center justify-center leading-normal transition-colors bg-shark-400 bg-opacity-40 border border-shark-400 px-[15px] h-[38px] rounded-[10px] hover:border-outrageous-orange-500 hover:bg-button-primary-hover hover:bg-opacity-80',
      activePage === index + 1 ? 'bg-button-primary bg-opacity-100' : '[&:not(:hover)]:text-navy-gray-500'
    )
  }

  const clearSelection = () => {
    if (window.getSelection) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
    }
  }

  const hadlerPrev = () => {
    setActivePage(activePage > 1 ? activePage - 1 : activePage)
    clearSelection()
  }
  const hadlerNext = () => {
    setActivePage(activePage < numberPages ? activePage + 1 : activePage)
    clearSelection()
  }

  const hadlerPage = (index: number) => {
    setActivePage(index + 1)
    clearSelection()
  }

  const visiblePages = 4
  const startPage =
    activePage <= 3 || numberPages <= 5
      ? 1
      : activePage === numberPages - 1
        ? activePage - 3
        : activePage === numberPages
          ? activePage - 4
          : activePage - 2
  const endPage = Math.min(numberPages, startPage + visiblePages)

  useEffect(() => {
    const arr = []
    for (let i = 0; i < numberPages; i++) {
      arr.push(i + 1)
    }
    setPaginationArr([...arr.slice(startPage - 1, endPage)])
  }, [activePage, itemsPerPage, startPage, numberPages, endPage])

  return (
    <div className={mergeClassName}>
      <div className="w-full flex justify-center items-center">
        <div className="w-[85%] flex items-center justify-center gap-2.5 h-[62px] relative z-10">
          <button
            type="button"
            className={`flex items-center justify-center leading-normal gap-2.5 px-5 py-2.5 ${activePage === 1 ? 'text-shark-100 opacity-60' : '[&:not(:hover)]:text-shark-100 button-secondary transition-colors'} rounded-[10px] mr-1.5`}
            onClick={hadlerPrev}
            disabled={activePage === 1}
          >
            <span className="icon-arrow-right rotate-180 text-sm"></span>
            Previous
          </button>

          {paginationArr.map((page: number, index: number) => (
            <button key={index} type="button" className={pageClassName(page - 1)} onClick={() => hadlerPage(page - 1)}>
              {page}
            </button>
          ))}

          {/* {Array.from({ length: numberPages })
            .map((_, index) => index)
            .slice(startPage, endPage)
            .map((page, index) => (
              <button
                key={index}
                type="button"
                className={pageClassName(page - 1)}
                onClick={() => hadlerPage(page - 1)}
              >
                {page}
              </button>
            ))} */}
          <button
            type="button"
            className={`flex items-center justify-center leading-normal ${activePage === numberPages ? 'text-shark-100 opacity-60' : '[&:not(:hover)]:text-shark-100 button-secondary transition-colors'} gap-2.5 px-5 py-2.5 rounded-[10px] ml-1.5`}
            onClick={hadlerNext}
            disabled={activePage === numberPages}
          >
            Next
            <span className="icon-arrow-right"></span>
          </button>
        </div>
        <div
          className="flex items-center justify-center cursor-default flex-shrink-0 w-12 h-12 px-4 transition-colors
        border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400 relative"
          onClick={() => setIsOpenItemsPerPage(!isOpenItemsPerPage)}
        >
          <span className="text-lg icon-cog text-white "></span>
          {isOpenItemsPerPage && (
            <div className="w-[68px] p-2 flex flex-col gap-1 rounded-[10px] bg-shark-400 bg-opacity-40 absolute left-full bottom-0 translate-x-1">
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
    </div>
  )
}

export default Pagination
