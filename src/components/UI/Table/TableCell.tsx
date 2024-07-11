'use client'

import React from 'react'
import cn from '@/src/library/utils/cn'

interface TableCellProps {
  className?: string
  children: React.ReactNode
}

const TableCell = ({ className, children }: TableCellProps) => {
   const mergeClass = cn('flex  px-2.5 py-2', className)

   return <div className={mergeClass}>{children}</div>
}

export default TableCell
