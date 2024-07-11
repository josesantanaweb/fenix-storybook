'use client'

import { TableCell, TableRow } from '@/src/components/UI'

const TableSkeleton = () => {
  return (
    <TableRow>
      <TableCell className="w-[20%]">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="flex items-center">
            <div className="rounded-full w-7 h-7 bg-shark-400"></div>
            <div className="-ml-2 rounded-full w-7 h-7 bg-shark-400"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-3 mb-2 rounded w-14 bg-shark-400"></div>
            <div className="flex">
              <div className="w-40 h-3 rounded bg-shark-400"></div>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="w-[15%]">
        <div className="flex flex-col items-end justify-end w-full px-3 animate-pulse">
          <div className="w-10 h-3 mb-1 rounded bg-shark-400"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell>
      <TableCell className="w-[13%]">
        <div className="flex flex-col items-end justify-end w-full px-3 animate-pulse">
          <div className="w-10 h-3 mb-1 rounded bg-shark-400"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell>
      <TableCell className="w-[13%]">
        <div className="flex flex-col items-end justify-end w-full px-3 animate-pulse">
          <div className="w-10 h-3 mb-1 rounded bg-shark-400"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell>
      <TableCell className="w-[13%]">
        <div className="flex flex-col items-end justify-end w-full px-3 animate-pulse">
          <div className="w-10 h-3 mb-1 rounded bg-shark-400"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell>
      <TableCell className="w-[13%]">
        <div className="flex flex-col items-end justify-end w-full px-3 animate-pulse">
          <div className="w-10 h-3 mb-1 rounded bg-shark-400"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell>
      <TableCell className="w-[13%]">
        <div className="flex justify-end w-full gap-3 animate-pulse">
          <div className="w-20 h-8 rounded-lg bg-shark-300"></div>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default TableSkeleton
