/* eslint-disable max-len */
import React from 'react'
import Image from 'next/image'

interface ReferralCardProps {
  title: string
  img: string
  description: string
}

const ReferralCard = ({ title, img, description }: ReferralCardProps) => {
  return (
    <div className="mx-auto relative group transition-colors duration-300 ease-in-out hover:border hover:border-solid hover:border-outrageous-orange-400 after:content-[''] after:bg-gradient-to-r after:from-outrageous-orange-500 after:to-festival-500 after:w-full after:h-full  after:md:max-w-[362px] after:top-0 after:left-0 after:z-10 after:rounded-xl after:opacity-0 after:transition-all hover:after:opacity-80 after:max-h-[240px] after:absolute bg-shark-400 bg-opacity-40  p-5 rounded-xl border border-solid border-shark-300 w-full md:max-w-[362px] 2xl:min-w-[362px] min-h-[216px] max-h-[240px]">
      <span className="relative z-50 flex flex-col gap-2">
        <Image src={img} className="w-full h-[110px] object-cover" alt="" height={362} width={110} />
        <h1 className="text-white font-semibold text-xs">{title}</h1>
        <p className="text-shark-100 group-hover:text-white  font-normal text-xs line-clamp-3">{description}</p>
      </span>
    </div>
  )
}

export default ReferralCard
