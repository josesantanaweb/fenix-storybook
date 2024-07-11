import { useEffect, useRef, useState } from 'react'
import BasicChartWidget from './BasicChartWidget'

export default function Chart({ className = '' }: { className?: string }) {
  const divRef = useRef<HTMLDivElement>(null)
  const [divHeight, setDivHeight] = useState(10)
  const [divWidth, setDivWidth] = useState(10)

  useEffect(() => {
    if (!divRef.current) return
    setDivHeight(divRef.current?.getBoundingClientRect().height || 0)
  }, [])

  useEffect(() => {
    if (!divRef.current) return
    const element = divRef.current

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDivHeight(height)
      setDivWidth(width)
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.unobserve(element)
    }
  }, [])

  return (
    <div
      ref={divRef}
      className={`w-full h-auto max-h-[845px] min-h-[345px] p-0 relative bg-shark-400 
      bg-opacity-40 rounded-xl border 
      border-shark-950 flex items-center justify-center ${className}`}
    >
      <BasicChartWidget height={divHeight} width={divWidth} />
    </div>
  )
}
