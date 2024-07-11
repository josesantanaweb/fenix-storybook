'use client'

import React, { useState } from 'react'
import { IOption } from "@/src/library/types"

interface SelectProps {
  options: IOption[]
  selected: IOption
  setSelected: (option: IOption) => void
}

const Select = ({ options, selected, setSelected }: SelectProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const handlerSelect = () => setOpen(!open)

  const handlerSelectedOption = (option: IOption) => {
    setSelected(option)
    setOpen(false)
  }

  return (
    <div className="relative bg-shark-400 cursor-pointer bg-opacity-40 text-white text-sm h-[50px] border border-shark-400 rounded-lg">
      <div className="px-3 flex items-center justify-between h-full" onClick={handlerSelect}>
        <span>{selected.label}</span>
        <span className="icon-chevron text-sm inline-block ml-2" />
      </div>
      {open && (
        <div className="flex flex-col absolute top-full w-full bg-shark-400 z-10 rounded-lg">
          {options.map((option: IOption, index) => (
            <li
              onClick={() => handlerSelectedOption(option)}
              key={index}
              className="p-3 list-none rounded-sm hover:bg-shark-300 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select
