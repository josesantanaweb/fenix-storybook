'use client'
import Image from "next/image"

interface Point {
  title?: string
  description?: string
  icon?: string
}

interface PointProps {
  point: Point
}

const Point = ({ point }: PointProps) => {
  return (
    <div className="point-box bg-shark-400 bg-opacity-40 p-5 rounded-lg flex flex-col justify-center items-center relative">
      <div className="flex items-center justify-center w-10 h-10 px-2 mb-2 rounded-lg bg-shark-400">
        <span
          className={`inline-block text-lg text-gradient ${point.icon}`}
        ></span>
      </div>
      <h4 className="text-sm text-white text-center mb-2">{point.title}</h4>
      <p className="text-sm text-shark-100 text-center">
        {point.description}
      </p>
      {
        point.title === "Provide Liquidity" &&
        <span className="absolute top-0 -left-[7px] z-0 rotate-90">
          <Image src="/static/images/components/line.svg" alt="line" className="w-1 h-8" width={1} height={35} />
        </span>
      }
      {
        point.title === "Provide Liquidity" &&
        <span className="absolute top-0 -right-[10px] z-0 rotate-90">
          <Image src="/static/images/components/line.svg" alt="line" className="w-1 h-8" width={1} height={35} />
        </span>
      }
    </div>
  )
}

export default Point
