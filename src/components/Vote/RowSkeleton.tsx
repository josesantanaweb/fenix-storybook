'use client'

import { TableCell, TableRow } from '@/src/components/UI'

const RowSkeleton = () => {
  return (
    <TableRow>
      <TableCell className='w-1/2'>
        <div className="animate-pulse flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-shark-400"></div>
            <div className="w-7 h-7 rounded-full bg-shark-400 -ml-2"></div>
          </div>
          <div className="flex flex-col">
            <div className="w-14 h-3 rounded bg-shark-400 mb-2"></div>
            <div className="flex">
              <div className="w-40 h-3 rounded bg-shark-400"></div>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="w-[10%]">
        <div className="animate-pulse flex flex-col justify-end w-full px-3 items-end">
          <div className="w-10 h-3 rounded bg-shark-400 mb-1"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell>
      <TableCell className="w-[10%]">
        <div className="animate-pulse flex flex-col justify-end w-full px-3 items-end">
          <div className="w-10 h-3 rounded bg-shark-400 mb-1"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell>
      <TableCell className="w-[10%]">
        <div className="animate-pulse flex flex-col justify-end w-full px-3 items-end">
          <div className="w-10 h-3 rounded bg-shark-400 mb-1"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell>
      {/* <TableCell className="w-[10%]">
        <div className="animate-pulse flex flex-col justify-end w-full px-3 items-end">
          <div className="w-10 h-3 rounded bg-shark-400 mb-1"></div>
          <div className="w-24 h-3 rounded bg-shark-400"></div>
        </div>
      </TableCell> */}
      <TableCell className="w-[20%]">
        <div className="animate-pulse flex gap-3 justify-end w-full px-3">
          <div className="flex flex-col items-end">
            <div className="w-10 h-3 rounded bg-shark-400 mb-1"></div>
            <div className="w-24 h-3 rounded bg-shark-400"></div>
          </div>
          <div className="w-20 h-8 rounded-lg bg-shark-300"></div>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default RowSkeleton
